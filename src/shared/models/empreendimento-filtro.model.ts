export interface EmpreendimentoFiltro {
  search?: string;
  quartos?: number[];
  precoMin?: number;
  precoMax?: number;
  status?: string[];
  areaMin?: number;
  areaMax?: number;
  banheiros?: number[];
  vagas?: number[];
  tiposImoveis?: string[];
  diferenciais?: string[];
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}