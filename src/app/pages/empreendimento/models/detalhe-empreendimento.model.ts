import { Apartamento } from "./apartamento.model";
import { Area } from "./area.model";
import { Diferencial } from "./diferencial.model";

export interface Imagem {
  banner: string;
  map: string;
  plantas?: string[];
  galeria?: string[];
}


export interface DetalheEmpreendimento {
  id?: string;
  titulo: string;
  status: string;
  cidade: string;
  bairro: string;
  areaMin: string;
  areaMax: string;
  banheiros: number;
  quartos: string;
  vagas: number;
  precoMin: string;
  imagens: Imagem;
}

export interface ListaEmpreendimento {
  id?: string;
  titulo: string;
  status: string;
  cidade: string;
}