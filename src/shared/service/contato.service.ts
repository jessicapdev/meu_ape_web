import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Contato } from '../models/contato.model';

@Injectable({
  providedIn: 'root'
})
export class ContatoService {
  constructor(private http: HttpClient) {}

  enviarContato(contato: Contato): Observable<any> {
    return this.http.post(`${environment.apiUrl}/contatos`, contato);
  }

  getContatos(): Observable<Contato[]> {
    return this.http.get<Contato[]>(`${environment.apiUrl}/contatos`);
  }

  updateContato(id: string, contato: Partial<Contato>): Observable<any> {
    return this.http.put(`${environment.apiUrl}/contatos/status/${id}`, contato);
  }

  updateStatusContato(id: string, lido: Boolean): Observable<any> {
    return this.http.put(`${environment.apiUrl}/contatos/status/${id}`, lido);
  }
}
