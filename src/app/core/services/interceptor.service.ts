import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class Interceptor implements HttpInterceptor {
    
    constructor(
        private authenticationService: AuthenticationService,
        private router: Router
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const currentUser = this.authenticationService.currentUserValue;
        const email = currentUser?.email;
        const token = currentUser?.token;

        if (token) {
            const headers: Record<string, string> = {
                Authorization: `Bearer ${token}`
            };
            
            if (email) {
                headers['email'] = email;
            }
            
            request = request.clone({ setHeaders: headers });
        }

        return next.handle(request).pipe(
            catchError(error => {
                if (error.status === 401) {
                    this.authenticationService.logout();
                    this.router.navigate(['/login']);
                }
                return throwError(() => error);
            })
        );
    }
}