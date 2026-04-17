import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  saveUsuario(body: any){
    return this.http.post<Usuario>(`${environment.apiUrl}/usuarios`, body);
  }

  updateUsuario(body: any){
    return this.http.put<Usuario>(`${environment.apiUrl}/usuarios/criar-conta`, body);
  }

  getUsuario(){
    return this.http.get<Usuario>(`${environment.apiUrl}/usuarios/perfil`);
  }
}
