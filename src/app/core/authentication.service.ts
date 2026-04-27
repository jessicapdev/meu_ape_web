import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, catchError, filter, take, shareReplay } from 'rxjs/operators';
import { JwtHelperService } from './jwt-helper.service';
import { Usuario } from '../../shared/models/usuario.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<Usuario | null>;
  public currentUser: Observable<Usuario | null>;
  
  private refreshInProgress$ = new BehaviorSubject<boolean>(false);
  private tokenRefreshed$ = new BehaviorSubject<string | null>(null);
  private readonly TOKEN_EXPIRY_MARGIN = 60;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) {
    const user = this.getUserFromStorage();
    this.currentUserSubject = new BehaviorSubject<Usuario | null>(user);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  /**
   * Método seguro para recuperar usuário do localStorage
   */
  private getUserFromStorage(): Usuario | null {
    try {
      const raw = localStorage.getItem('currentUser');
      
      if (!raw || raw === 'undefined' || raw === 'null' || raw.trim() === '') {
        return null;
      }

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') {
        return null;
      }

      return parsed as Usuario;
    } catch (error) {
      this.clearStorage();
      return null;
    }
  }

  get currentUserValue(): Usuario | null {
    return this.getUserFromStorage();
  }

  get accessToken(): string | null {
    const user = this.getUserFromStorage();
    return user?.token || null;
  }

  get refreshToken(): string | null {
    const raw = localStorage.getItem('refreshToken');
    if (!raw || raw === 'undefined' || raw === 'null' || raw === 'null') {
      return null;
    }
    return raw;
  }

  isAuthenticated(): boolean {
    const token = this.accessToken;
    if (!token) return false;
    return !this.jwtHelper.isTokenExpired(token, this.TOKEN_EXPIRY_MARGIN);
  }

  ensureValidToken(): Observable<string | null> {
    const token = this.accessToken;
    
    if (!token) {
      console.warn('[Auth] Token não encontrado');
      return of(null);
    }

    if (!this.jwtHelper.isTokenExpired(token, this.TOKEN_EXPIRY_MARGIN)) {
      return of(token);
    }

    return this.refreshAccessToken();
  }

  login(email: string, senha: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${environment.apiUrl}/auth/login`, { email, senha })
      .pipe(
        tap(response => {
          this.storeTokens(response);
          this.currentUserSubject.next(response);
        }),
        map(response => response)
      );
  }

  refreshAccessToken(): Observable<string | null> {
    const currentRefreshToken = this.refreshToken;
    
    if (!currentRefreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    if (this.refreshInProgress$.value) {
      return this.tokenRefreshed$.pipe(
        filter(token => token !== null),
        take(1)
      );
    }

    this.refreshInProgress$.next(true);
    this.tokenRefreshed$.next(null);

    return this.http.post<{ token: string; refreshToken?: string }>(
      `${environment.apiUrl}/auth/refresh`,
      { refreshToken: currentRefreshToken }
    ).pipe(
      tap(response => {
        this.updateAccessToken(response.token);
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
      }),
      map(response => response.token),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      }),
      tap(newToken => {
        this.tokenRefreshed$.next(newToken);
        this.refreshInProgress$.next(false);
      })
    );
  }

  private storeTokens(response: Usuario): void {
    localStorage.setItem('currentUser', JSON.stringify(response));
    localStorage.setItem('refreshToken', response.refreshToken ?? '');
    localStorage.setItem('username', response?.nome ?? '');
  }

  private updateAccessToken(newToken: string): void {
    const currentUser = this.getUserFromStorage();
    if (currentUser) {
      currentUser.token = newToken;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      this.currentUserSubject.next({ ...currentUser });
    }
  }

  logout(): void {
    const refreshToken = this.refreshToken;
    
    if (refreshToken) {
      this.http.post(`${environment.apiUrl}/auth/logout`, { refreshToken })
        .subscribe({ error: () => {} });
    }

    this.clearStorage();
    this.currentUserSubject.next(null);
    this.tokenRefreshed$.next(null);
    this.refreshInProgress$.next(false);
  }

  private clearStorage(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
  }

  setUserName(username: string): void {
    localStorage.setItem('username', username);
  }

  getUserRoles(): string[] {
    const token = this.accessToken;
    if (!token) return [];
    const decoded = this.jwtHelper.decodeToken(token);
    return decoded?.roles || decoded?.authorities || [];
  }

  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }

}