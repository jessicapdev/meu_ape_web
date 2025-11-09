import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  saveUsuario(body: any){
    return this.http.post<Usuario>(`${environment.apiUrl}/usuarios`, body, this.httpOptions).pipe(catchError(r => throwError(r.error)));
  }

  updateUsuario(body: any){
    return this.http.put<Usuario>(`${environment.apiUrl}/usuarios`, body, this.httpOptions).pipe(catchError(r => throwError(r.error)));
  }
}
