import { Apartamento } from "./apartamento.model";
import { Area } from "./area.model";
import { Diferencial } from "./diferencial.model";
import { Timeline } from "./timeline.model";

export interface Imagem {
  banner: ImagemItem;
  map: ImagemItem;
  plantas: ImagemItem[];
  galeria: ImagemItem[];
}

export interface ImagemItem {
  fileId: string;
  titulo: string;
  descricao: string;
}

export interface DetalheEmpreendimento {
  id?: string;
  titulo: string;
  status: string;
  construtora: string;
  endereco: string;
  descricao: string;
  cidade: string;
  bairro: string;
  areaMin: string;
  areaMax: string;
  banheiros: number[];
  quartos: number[];
  vagas: number[];
  precoMin: number;
  precoMax: number;
  imagens: Imagem;
  timeline: Timeline[];
  apartamentos: Apartamento[];
  diferenciais: String[];
  tiposImoveis: string[];
}

export interface EmpreendimentoHome {
  id?: string;
  titulo: string;
  status: string;
  construtora: string;
  cidade: string;
  bairro: string;
  areaMin: string;
  areaMax: string;
  banheiros: number[];
  quartos: number[];
  vagas: number[];
  precoMin: number;
  imagens: { banner: ImagemItem };
}


export interface EmpreendimentoPerfil {
  id?: string;
  titulo: string;
  status: string;
  construtora: string;
  cidade: string;
  imagens: Imagem;
}