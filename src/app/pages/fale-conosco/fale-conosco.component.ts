// fale-conosco.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiButtonLoading, TuiTextarea } from '@taiga-ui/kit';
import { ContatoService } from '../../../shared/service/contato.service';
import { AlertMessageComponent } from '../../../shared/components/alert-message/alert-message.component';

@Component({
  selector: 'app-fale-conosco',
  standalone: true,
  imports: [
    CommonModule,
    AlertMessageComponent,
    ReactiveFormsModule,
    TuiButton,
    TuiTextfield,
    TuiTextarea,
    TuiIcon,
    TuiButtonLoading
  ],
  templateUrl: './fale-conosco.component.html',
  styleUrls: ['./fale-conosco.component.scss']
})
export class FaleConoscoComponent implements OnInit {
  error: { show: boolean, message: string } = { show: false, message: '' };
  contatoForm: FormGroup;
  enviando = false;
  enviado = false;

  empresa = {
    nome: 'Minha Empresa LTDA',
    telefone: '(11) 9 4010-60342',
    whatsapp: '(11) 9 4010-60342',
    email: 'contato@minhaempresa.com.br',
    endereco: 'Rua Exemplo, 123 - São Paulo/SP',
    horario: 'Seg a Sex: 09h às 18h'
  };

  constructor(
    private fb: FormBuilder,
    private contatoService: ContatoService
  ) {
    this.contatoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      assunto: ['', Validators.required],
      mensagem: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.contatoForm.valid) {
      this.enviando = true;
      this.contatoService.enviarContato(this.contatoForm.value).subscribe({
        next: () => {
          this.enviando = false;
          this.enviado = true;
        },
        error: () => {
          this.enviando = false;
          this.error.show = true;
          this.error.message = 'Erro ao tentar enviar mensagem. Tente novamente mais tarde.';
        }
      })
    }
  }

  novoContato(): void {
    this.enviado = false;
    this.contatoForm.reset();
  }

  copiarTexto(texto: string): void {
    navigator.clipboard.writeText(texto).then(() => {
      alert('Texto copiado para a área de transferência!');
    });
  }

  abrirWhatsApp(): void {
    window.open(`https://wa.me/55119401060342`, '_blank');
  }

  abrirGoogleMaps(): void {
    window.open('https://maps.google.com/?q=Rua Exemplo, 123 São Paulo SP', '_blank');
  }
}