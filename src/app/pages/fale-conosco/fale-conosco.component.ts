// fale-conosco.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiButtonLoading } from '@taiga-ui/kit';

@Component({
  selector: 'app-fale-conosco',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiButton,
    TuiTextfield,
    TuiIcon,
    TuiButtonLoading
  ],
  templateUrl: './fale-conosco.component.html',
  styleUrls: ['./fale-conosco.component.scss']
})
export class FaleConoscoComponent implements OnInit {
  contatoForm: FormGroup;
  enviando = false;
  enviado = false;

  // Dados da empresa
  empresa = {
    nome: 'Minha Empresa LTDA',
    telefone: '(11) 4002-8922',
    whatsapp: '(11) 9 9344-98823',
    email: 'contato@minhaempresa.com.br',
    endereco: 'Rua Exemplo, 123 - São Paulo/SP',
    horario: 'Seg a Sex: 09h às 18h'
  };

  constructor(private fb: FormBuilder) {
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
      
      setTimeout(() => {
        this.enviando = false;
        this.enviado = true;
        console.log('Formulário enviado:', this.contatoForm.value);
      }, 2000);
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
    window.open(`https://wa.me/5511934498823`, '_blank');
  }

  abrirGoogleMaps(): void {
    window.open('https://maps.google.com/?q=Rua Exemplo, 123 São Paulo SP', '_blank');
  }
}