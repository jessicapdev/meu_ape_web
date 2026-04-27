import { 
  HttpEvent, 
  HttpHandler, 
  HttpInterceptor, 
  HttpRequest, 
  HttpErrorResponse 
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, finalize } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  
  // URLs que não precisam de token
  private readonly PUBLIC_URLS = [
    '/auth/login',
    '/auth/refresh',
    '/auth/recuperar',
    '/api/empreendimentos/buscar',
    '/detalhe', 
    '/usuarios/criar-conta',
    '/contatos' 
  ];

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    if (this.isPublicUrl(request)) {
      return next.handle(request);
    }

    return this.authService.ensureValidToken().pipe(
      switchMap(validToken => {
        
        if (!validToken) {
          this.router.navigate(['/login']);
          return throwError(() => new Error('Authentication required'));
        }

        const authRequest = this.addAuthHeader(request, validToken);
        
        return next.handle(authRequest).pipe(
          catchError(error => this.handleHttpError(error, request, next))
        );
      })
    );
  }

  private addAuthHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    const email = this.authService.currentUserValue?.email;
    
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`
    };

    if (email) {
      headers['email'] = email;
    }

    return request.clone({ setHeaders: headers });
  }

  private handleHttpError(
    error: HttpErrorResponse, 
    request: HttpRequest<any>, 
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    
    if (error.status === 401 && !this.isRefreshUrl(request.url)) {
      
      return this.authService.refreshAccessToken().pipe(
        switchMap(newToken => {
          if (!newToken) {
            this.authService.logout();
            this.router.navigate(['/login']);
            return throwError(() => new Error('Session expired'));
          }
          
          // Refaz a requisição original com novo token
          const retryRequest = this.addAuthHeader(request, newToken);
          return next.handle(retryRequest);
        }),
        catchError(refreshError => {
          this.authService.logout();
          this.router.navigate(['/login']);
          return throwError(() => refreshError);
        })
      );
    }

    return throwError(() => error);
  }

  private isPublicUrl(request: HttpRequest<any>): boolean {
    const url = request.url;
    const method = request.method;

    const isWhitelisted = this.PUBLIC_URLS.some(publicUrl => url.includes(publicUrl));
    if (isWhitelisted) return true;

    // Cadastro de usuário e Envio de contato (Ambos são POST públicos)
    // Verificamos o método para não liberar acidentalmente o perfil ou listagens privadas
    const isPublicPost = method === 'POST' && (url.endsWith('/usuarios') || url.endsWith('/contatos'));

    return isPublicPost;
  }

  private isRefreshUrl(url: string): boolean {
    return url.includes('/auth/refresh');
  }
}