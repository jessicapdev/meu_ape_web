import { Apartamento } from "../../app/pages/empreendimento/models/apartamento.model";

export interface Empreendimento {
  id: string;
  titulo: string;
  status: string;
  cidade: string;
  bairro: string;
  areaMin: number;
  areaMax: number;
  banheiros: number[];
  quartos: string[];
  vagas: number[];
  precoMin: number;
  precoMax: number;
  imagens: Imagens;
  apartamentos: Apartamento[];
  tipoImovel: string;
  diferenciais: string[];
}

export interface Imagens {
  banner: string;
  map: string;
  plantas: string[];
  galeria: string[];
}