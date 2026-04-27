import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Contato } from '../models/contato.model';
import { PageResponse } from '../models/page-response.model';

@Injectable({
  providedIn: 'root'
})
export class ContatoService {
  constructor(private http: HttpClient) {}

  enviarContato(contato: Contato): Observable<any> {
    return this.http.post(`${environment.apiUrl}/contatos`, contato);
  }

  getContatos(pagina: number = 0, tamanho: number = 10): Observable<PageResponse<Contato>> {
    return this.http.get<PageResponse<Contato>>(`${environment.apiUrl}/contatos/listar?page=${pagina}&size=${tamanho}`);
  }

  updateContato(id: string, status: boolean): Observable<any> {
    return this.http.put(`${environment.apiUrl}/contatos/status/${id}`, status);
  }

  updateStatusContato(id: string, lido: Boolean): Observable<any> {
    return this.http.put(`${environment.apiUrl}/contatos/status/${id}`, lido);
  }
}
