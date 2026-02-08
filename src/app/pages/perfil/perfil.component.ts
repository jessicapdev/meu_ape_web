import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiDataList, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiInputPhone, TuiSelect } from '@taiga-ui/kit';
import { TUI_IS_IOS } from '@taiga-ui/cdk';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { UsuarioService } from '../../../shared/service/usuario.service';

@Component({
  selector: 'app-perfil',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiButton,
    TuiSelect,
    TuiDataList,
    TuiTextfield,
    TuiInputPhone,
    TuiIcon,
    SidebarComponent
  ],
  standalone: true,
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
  protected readonly isIos = inject(TUI_IS_IOS);
  protected get pattern(): string | null {
    return this.isIos ? '+[0-9-]{1,20}' : null;
  }
  profileForm: FormGroup;
  userTypes = [
    { label: 'Cliente', value: 'cliente' },
    { label: 'Profissional', value: 'profissional' }
  ];
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {
    this.profileForm = this.fb.group({
      nomeCompleto: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      foto: ['']
    });
  }

  ngOnInit(): void {
    this.loadLogoImage();
    this.getDadosUsuario()
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  private loadLogoImage(): void {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      this.imagePreview = canvas.toDataURL('image/jpeg');
    };
    
    img.onerror = (error) => {
      console.error('Erro ao carregar imagem:', error);
    };
    
    img.src = 'assets/img/logo.jpeg';
  }

  removeImage(): void {
    this.selectedFile = null;
    this.loadLogoImage();
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.profileForm.get('foto')?.setValue(this.selectedFile);
      this.usuarioService.updateUsuario(this.profileForm.value).subscribe({
        next: (response) => {
          console.log('Usuário atualizado com sucesso:', response);
        },
        error: (error) => {
          console.error('Erro ao atualizar usuário:', error);
        }
      })
    }
  }

  getDadosUsuario(): void {
    this.usuarioService.getUsuario().subscribe({
      next: (response) => {
        this.profileForm.get('email')?.setValue(response.email);
        this.profileForm.get('nomeCompleto')?.setValue(response.nome);
        this.profileForm.get('foto')?.setValue(response.foto);
        if(response?.foto){
          this.imagePreview = response.foto;
        }
      },
      error: (error) =>{
        console.error('Erro ao atualizar usuário:', error);
      }
    })
  }

}