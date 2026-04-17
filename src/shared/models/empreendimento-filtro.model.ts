export interface EmpreendimentoFiltro {
  page?: number;
  size?: number;
  quartos?: string;
  precoMin?: number;
  precoMax?: number;
  status?: string;
  areaMin?: number;
  areaMax?: number;
  banheiros?: number;
  vagas?: number;
  tiposImoveis?: string[];
  diferenciais?: string[];
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}