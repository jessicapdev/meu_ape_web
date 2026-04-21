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
  imagens: { banner: string };
}


export interface EmpreendimentoPerfil {
  id?: string;
  titulo: string;
  status: string;
  construtora: string;
  cidade: string;
}