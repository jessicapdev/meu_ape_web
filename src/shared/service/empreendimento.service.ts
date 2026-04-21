import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmpreendimentoFiltro } from '../models/empreendimento-filtro.model';
import { PageResponse } from '../models/page-response.model';
import { DetalheEmpreendimento, EmpreendimentoHome, EmpreendimentoPerfil, Imagem } from '../../app/pages/empreendimento/models/detalhe-empreendimento.model';
import { Observable } from 'rxjs';
import { Empreendimento } from '../models/empreendimento.model';

@Injectable({
  providedIn: 'root'
})
export class EmpreendimentoService {
  private apiUrl = 'http://localhost:8080/api/empreendimentos';

  constructor(private http: HttpClient) {}

  // Busca paginada com filtros
  // buscarComFiltros(filtro: EmpreendimentoFiltro): Observable<PageResponse<DetalheEmpreendimento>> {
  //   return this.http.post<PageResponse<DetalheEmpreendimento>>(`${this.apiUrl}/buscar`, filtro);
  // }

  getListaEmpreendimentos(): Observable<EmpreendimentoHome[]> {
    return this.http.get<EmpreendimentoHome[]>(`${this.apiUrl}/home`);
  }

  getDetalhe(id: string): Observable<DetalheEmpreendimento> {
    return this.http.get<DetalheEmpreendimento>(`${this.apiUrl}/${id}/detalhe`);
  }

  getTiposImoveis(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/opcoes/tipos-imoveis`);
  }

  getTiposStatus(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/opcoes/tipos-status`);
  }

  getConstrutoras(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/opcoes/construtoras`);
  }

  getDiferenciais(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/opcoes/diferenciais`);
  }

  getQuartos(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/opcoes/quartos`);
  }

  criar(empreendimento: DetalheEmpreendimento): Observable<DetalheEmpreendimento> {
    return this.http.post<DetalheEmpreendimento>(this.apiUrl, empreendimento);
  }

  atualizar(id: string, empreendimento: DetalheEmpreendimento): Observable<DetalheEmpreendimento> {
    return this.http.put<DetalheEmpreendimento>(`${this.apiUrl}/${id}`, empreendimento);
  }

  listar(pagina: number = 0, tamanho: number = 10): Observable<PageResponse<EmpreendimentoPerfil>> {
    return this.http.get<PageResponse<EmpreendimentoPerfil>>(`${this.apiUrl}/perfil?page=${pagina}&size=${tamanho}`);
  }

  deletar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  atualizarImagem(id: string, imagens: Imagem): Observable<Imagem> {
    return this.http.put<Imagem>(`${this.apiUrl}/${id}/imagens`, imagens);
  }

  getImagensByEmpreendimento(id: string): Observable<any> {
    return this.http.get<Imagem>(`${this.apiUrl}/${id}/imagens`);
  }

  getDadosByEmpreendimento(id: string): Observable<any> {
    return this.http.get<Imagem>(`${this.apiUrl}/${id}/dados`);
  }
}
