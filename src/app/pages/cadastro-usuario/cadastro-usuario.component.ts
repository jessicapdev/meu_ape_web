import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MustMatch } from '../../../asset/utils/must-match.validator';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../shared/service/usuario.service';
import { Usuario } from '../../../shared/models/usuario';

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class CadastroUsuarioComponent implements OnInit {

  private fileBase64: any;
  public selectedFiles: any;

  public isLoading = false;
  public error = '';

  cadastroUsuarioForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.cadastroUsuarioForm = this.fb.group({
    nome: this.fb.control(''),
    email: this.fb.control('', Validators.email),
    senha: this.fb.control('', Validators.minLength(6)),
    confirmacao: this.fb.control('')
  }, {
    validator: MustMatch('senha', 'confirmacao')
  });

  }

  onSubmit(){
    if (this.cadastroUsuarioForm.invalid) {
      return;
    }

    let novoUsuario: Usuario = new Usuario();
    novoUsuario.nome = this.cadastroUsuarioForm.get('nome')?.value;
    novoUsuario.email = this.cadastroUsuarioForm.get('email')?.value;
    novoUsuario.senha = this.cadastroUsuarioForm.get('senha')?.value;
    novoUsuario.foto = this.fileBase64;
    this.saveUsuario(novoUsuario);
  }

  onCancel(){
    this.cadastroUsuarioForm.reset();
    this.router.navigate(['/login']);
  }

  saveUsuario(usuario: Usuario) {
    this.isLoading = true;
    this.usuarioService.saveUsuario(usuario).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Usuário salvo com sucesso!', response);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erro ao salvar usuário', err);
        if (err.status === 409) {
          this.error = 'Este e-mail já está cadastrado.';
        } else {
          this.error = 'Ocorreu um erro ao tentar cadastrar. Tente novamente.';
        }
      }
    });
  }

  onFileSelected(event: Event){
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      this.selectedFiles = target.files;
      
      const reader = new FileReader();
      reader.onload = () => {
        this.fileBase64 = (reader.result as string).split(',')[1];
      };
      reader.readAsDataURL(file);
    }
  }
  
}
