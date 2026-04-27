// cadastro.component.ts
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiInputPhone, TuiPassword } from '@taiga-ui/kit';
import { UsuarioService } from '../../../shared/service/usuario.service';
import { TUI_IS_IOS } from '@taiga-ui/cdk';

@Component({
  selector: 'app-cadastro-usuario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TuiButton,
    TuiPassword,
    TuiIcon,
    TuiTextfield,
    TuiInputPhone
  ],
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.scss']
})
export class CadastroUsuarioComponent implements OnInit {
  protected readonly isIos = inject(TUI_IS_IOS);
  cadastroForm: FormGroup;
  senhaVisivel = false;
  confirmarSenhaVisivel = false;
  protected value = '';


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: UsuarioService
  ) {
    this.cadastroForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      telefone: ['', [Validators.required]],
      confirmarSenha: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {}

  toggleSenhaVisivel(campo: 'senha' | 'confirmar'): void {
    if (campo === 'senha') {
      this.senhaVisivel = !this.senhaVisivel;
    } else {
      this.confirmarSenhaVisivel = !this.confirmarSenhaVisivel;
    }
  }

  salvarUsuario(): void {
    if (this.cadastroForm.valid && this.senhasCoincidem()) {
      this.service.saveUsuario(this.cadastroForm.value).subscribe({
        next: () => {
          this.router.navigate(['/login'], { queryParams: { registrado: 'true' } });
        },
        error: error => {
          console.log(error);
        }
      })
    }
  }

  senhasCoincidem(): boolean {
    const senha = this.cadastroForm.get('senha')?.value;
    const confirmarSenha = this.cadastroForm.get('confirmarSenha')?.value;
    return senha === confirmarSenha;
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  protected get pattern(): string | null {
    return this.isIos ? '+[0-9-]{1,20}' : null;
  }
}