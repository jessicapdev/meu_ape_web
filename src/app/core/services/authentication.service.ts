import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from '../../../shared/models/usuario';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<Usuario>;
  public currentUser: Observable<Usuario>;

  constructor(private http: HttpClient) {
    const raw = localStorage.getItem('currentUser');
    const user: Usuario = raw ? JSON.parse(raw) : null;
    this.currentUserSubject = new BehaviorSubject<Usuario>(user);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Usuario {
    return this.currentUserSubject.getValue();
  }

  login(email: string, senha: string) {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, { email, senha })
    .pipe(
      map(
        user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('username', user.nome)
      this.currentUserSubject.next(user);
      return user;
    }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('username');
  }

  //set name user new in storage
  setUserName(username:string){
    localStorage.setItem('username', JSON.stringify(username)); 
  }

}
