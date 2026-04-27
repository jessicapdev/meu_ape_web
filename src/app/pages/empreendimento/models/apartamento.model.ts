export interface Apartamento {
  id: string;
  tipo: string;
  area: string;
  quartos: string;
  suites: string;
  banheiros: number;
  vagas: string;
  preco: number | null;
}