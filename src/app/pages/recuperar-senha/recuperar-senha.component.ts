import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiButtonLoading } from '@taiga-ui/kit';

@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TuiButton,
    TuiButtonLoading,
    TuiTextfield,
    TuiIcon,
  ],
  templateUrl: './recuperar-senha.component.html',
  styleUrl: './recuperar-senha.component.scss'
})
export class RecuperarSenhaComponent {
  esqueciSenhaForm: FormGroup;
  emailEnviado = false;
  carregando = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.esqueciSenhaForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.esqueciSenhaForm.valid) {
      this.carregando = true;
      
      // Simular envio de email
      setTimeout(() => {
        this.carregando = false;
        this.emailEnviado = true;
      }, 2000);
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  reenviarEmail(): void {
    this.emailEnviado = false;
    this.esqueciSenhaForm.reset();
  }
}
