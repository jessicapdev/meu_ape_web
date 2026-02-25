import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class JwtHelperService {
  
  decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  }

  isTokenExpired(token: string, offsetSeconds: number = 0): boolean {
    if (!token) return true;
    
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    const expirationDate = new Date(0);
    expirationDate.setUTCSeconds(decoded.exp);
    
    // Adiciona margem de segurança (padrão: 60 segundos antes de expirar)
    return expirationDate.valueOf() <= (new Date().valueOf() + (offsetSeconds * 1000));
  }

  getTokenExpirationDate(token: string): Date | null {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return null;
    
    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }
}