import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmpreendimentoFiltro } from '../models/empreendimento-filtro.model';
import { PageResponse } from '../models/page-response.model';
import { DetalheEmpreendimento, EmpreendimentoHome, EmpreendimentoPerfil, Imagem } from '../../app/pages/empreendimento/models/detalhe-empreendimento.model';
import { Observable } from 'rxjs';
import { Empreendimento } from '../models/empreendimento.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpreendimentoService {
  private readonly API_URL = `${environment.apiUrl}/api/empreendimentos`;

  constructor(private http: HttpClient) {}

  // Busca paginada com filtros
  // buscarComFiltros(filtro: EmpreendimentoFiltro): Observable<PageResponse<DetalheEmpreendimento>> {
  //   return this.http.post<PageResponse<DetalheEmpreendimento>>(`${this.API_URL}/buscar`, filtro);
  // }

  getListaEmpreendimentos(filtro: EmpreendimentoFiltro): Observable<EmpreendimentoHome[]> {
    return this.http.post<EmpreendimentoHome[]>(`${this.API_URL}/buscar`, filtro);
  }

  getDetalhe(id: string): Observable<DetalheEmpreendimento> {
    return this.http.get<DetalheEmpreendimento>(`${this.API_URL}/${id}/detalhe`);
  }

  getTiposImoveis(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/opcoes/tipos-imoveis`);
  }

  getTiposStatus(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/opcoes/tipos-status`);
  }

  getConstrutoras(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/opcoes/construtoras`);
  }

  getDiferenciais(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/opcoes/diferenciais`);
  }

  getQuartos(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/opcoes/quartos`);
  }

  criar(empreendimento: DetalheEmpreendimento): Observable<DetalheEmpreendimento> {
    return this.http.post<DetalheEmpreendimento>(this.API_URL, empreendimento);
  }

  atualizar(id: string, empreendimento: DetalheEmpreendimento): Observable<DetalheEmpreendimento> {
    return this.http.put<DetalheEmpreendimento>(`${this.API_URL}/${id}`, empreendimento);
  }

  listar(pagina: number = 0, tamanho: number = 10): Observable<PageResponse<EmpreendimentoPerfil>> {
    return this.http.get<PageResponse<EmpreendimentoPerfil>>(`${this.API_URL}/perfil?page=${pagina}&size=${tamanho}`);
  }

  deletar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  atualizarImagem(id: string, imagens: FormData): Observable<Imagem> {
    return this.http.put<Imagem>(`${this.API_URL}/${id}/imagens`, imagens);
  }

  getImagensByEmpreendimento(id: string): Observable<any> {
    return this.http.get<Imagem>(`${this.API_URL}/${id}/imagens`);
  }

  getDadosByEmpreendimento(id: string): Observable<any> {
    return this.http.get<Imagem>(`${this.API_URL}/${id}/dados`);
  }

  getApartamentosByEmpreendimento(id: string): Observable<any> {
    return this.http.get<Imagem>(`${this.API_URL}/${id}/apartamento`);
  }

  salvarApartamentos(id: string, apartamentos: any): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}/apartamento`, apartamentos);
  }

  deletarApartamento(idEmpreendimento: string, idApartamento: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${idEmpreendimento}/apartamento/${idApartamento}`);
  }
}
