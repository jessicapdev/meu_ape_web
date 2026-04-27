// login.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TuiButton, TuiError, TuiIcon, TuiNotification, TuiTextfield } from '@taiga-ui/core';
import { TuiButtonLoading, TuiPassword } from '@taiga-ui/kit';
import { AuthenticationService } from '../../core/authentication.service';
import { first } from 'rxjs';
import { TuiValidationError } from '@taiga-ui/cdk';
import { AlertMessageComponent } from '../../../shared/components/alert-message/alert-message.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TuiButtonLoading,
    TuiButton,
    TuiTextfield,
    TuiPassword,
    TuiIcon,
    TuiError,
    AlertMessageComponent
  ],
  providers: [
    AuthenticationService
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  protected loginForm: FormGroup;
  protected senhaVisivel = false;
  protected lembrarMe = false;
  protected loading = false;
  protected submitted = false;
  protected returnUrl = '';
  protected error = new TuiValidationError('Erro ao fazer login.');
  protected loginError = false;
  protected success: { show: boolean, message: string } = { show: false, message: '' };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });

    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['']);
    }
  }

  ngOnInit(): void {
    const emailSalvo = localStorage.getItem('emailLembrado');
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';

    if (emailSalvo) {
      this.loginForm.patchValue({ email: emailSalvo });
      this.lembrarMe = true;
    }

    this.route.queryParams.subscribe(params => {
      if (params['registrado'] === 'true') {
        this.success.show = true;
        this.success.message = 'Cadastro realizado com sucesso! Faça login para continuar';
      }
    });
  }

  toggleLembrarMe(): void {
    this.lembrarMe = !this.lembrarMe;
  }

  onLogin(): void {
    this.loading = true;
    
    if (this.loginForm.valid) {
      if (this.lembrarMe) {
        localStorage.setItem('emailLembrado', this.loginForm.get('email')?.value);
      } else {
        localStorage.removeItem('emailLembrado');
      }
    } 

    this.authenticationService.login(this.f['email'].value, this.f['senha'].value)
    .pipe(first())
    .subscribe({
      next: () => {
        this.loginError = false;
        this.loading = false;
        this.router.navigate(['home']);
      },
      error: error => {
        this.loginError = true;
        this.loading = false;
      }
    });
  }

  navigateToCadastro(): void {
    this.router.navigate(['/cadastro']);
  }

  navigateToEsqueciSenha(): void {
    this.router.navigate(['/recuperar-senha']);
  }

  get f() {
    return this.loginForm.controls;
  }

  protected get computedError(): TuiValidationError | null {
    return this.loginError ? this.error : null;
  }

}