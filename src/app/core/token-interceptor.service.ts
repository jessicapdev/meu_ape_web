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
    '/auth/register',
    '/public/'
  ];

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // Ignora URLs públicas
    if (this.isPublicUrl(request.url)) {
      return next.handle(request);
    }

    // ESTRATÉGIA PROATIVA: Garante token válido ANTES de enviar
    return this.authService.ensureValidToken().pipe(
      switchMap(validToken => {
        
        // Não autenticado e não conseguiu refresh
        if (!validToken) {
          this.router.navigate(['/login']);
          return throwError(() => new Error('Authentication required'));
        }

        // Adiciona token à requisição
        const authRequest = this.addAuthHeader(request, validToken);
        
        // ESTRATÉGIA REATIVA: Se ainda assim receber 401, tenta refresh novamente
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
    
    // Apenas trata erro 401 e não é retry de refresh
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

  private isPublicUrl(url: string): boolean {
    return this.PUBLIC_URLS.some(publicUrl => url.includes(publicUrl));
  }

  private isRefreshUrl(url: string): boolean {
    return url.includes('/auth/refresh');
  }
}