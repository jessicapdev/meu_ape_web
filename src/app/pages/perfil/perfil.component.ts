import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiDataList, TuiIcon, TuiLoader, TuiTextfield } from '@taiga-ui/core';
import { TuiButtonLoading, TuiInputPhone, TuiSelect } from '@taiga-ui/kit';
import { TUI_IS_IOS } from '@taiga-ui/cdk';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { UsuarioService } from '../../../shared/service/usuario.service';
import { AlertMessageComponent } from '../../../shared/components/alert-message/alert-message.component';
import { AuthenticationService } from '../../core/authentication.service';
import { Router } from '@angular/router';
import { GerenciamentoEmpreendimentoComponent } from './gerenciamento-empreendimento/gerenciamento-empreendimento.component';
import { MensagensRecebidasComponent } from './mensagens-recebidas/mensagens-recebidas.component';

@Component({
  selector: 'app-perfil',
  imports: [
    CommonModule,
    AlertMessageComponent,
    ReactiveFormsModule,
    TuiButton,
    TuiSelect,
    TuiDataList,
    TuiTextfield,
    TuiButtonLoading,
    TuiInputPhone,
    TuiIcon,
    SidebarComponent,
    GerenciamentoEmpreendimentoComponent,
    MensagensRecebidasComponent
],
  standalone: true,
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
  protected readonly isIos = inject(TUI_IS_IOS);
  protected loading: boolean = false;
  protected get pattern(): string | null {
    return this.isIos ? '+[0-9-]{1,20}' : null;
  }
  error: { show: boolean, message: string } = { show: false, message: '' };
  success: { show: boolean, message: string } = { show: false, message: '' };
  profileForm: FormGroup;
  userTypes = [
    { label: 'Cliente', value: 'cliente' },
    { label: 'Profissional', value: 'profissional' }
  ];
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  currentTab: string = 'perfil';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private service: AuthenticationService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
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
    this.loading = true;
    if (this.profileForm.valid) {
      this.profileForm.get('foto')?.setValue(this.selectedFile);
      this.usuarioService.updateUsuario(this.profileForm.value).subscribe({
        next: () => {
          this.loading = false;
          this.success.show = true;
          this.success.message = 'Dados do usuário atualizados com sucesso';
        },
        error: () => {
          this.loading = false;
          this.error.show = true;
          this.error.message = 'Erro ao tentar atualizar dados do usuário';
        }
      })
    }
  }

  getDadosUsuario(): void {
    this.usuarioService.getUsuario().subscribe({
      next: (response) => {
        this.profileForm.get('email')?.setValue(response.email);
        this.profileForm.get('nome')?.setValue(response.nome);
        this.profileForm.get('foto')?.setValue(response.foto);
        this.profileForm.get('telefone')?.setValue(response.telefone);
        if(response?.foto){
          this.imagePreview = response.foto;
        }
      },
      error: (error) =>{
        this.service.logout();
        this.router.navigate(['/login']);
      }
    })
  }

  mudarAba(item: any): void {
    switch (item.label) {
      case 'Mensagens Recebidas':
        this.currentTab = 'mensagens-recebidas';
        break;
      case 'Perfil':
        this.currentTab = 'perfil';
        break;
      case 'Empreendimentos':
        this.currentTab = 'empreendimentos';
        break;
      default:
        break;
    }
  }

  mostrarAbaSelecionada(): void {
    // Lógica para mostrar a aba selecionada
    console.log('Mostrando aba selecionada');
  }

}