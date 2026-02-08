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
  titulo: string;
  status: string;
  cidade: string;
  bairro: string;
  metragem: string;
  banheiros: number;
  quartos: string;
  vagas: number;
  valorInicial: string;
  imagens: Imagem;
  apartamentos: Apartamento[];
  diferenciais: Diferencial[];
  areasLazer: Area[];
  descricao: string,
  views: number,
  dias: number,
}