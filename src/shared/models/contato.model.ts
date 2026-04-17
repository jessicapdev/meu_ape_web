export interface Contato {
  id?: string;
  nome: string;
  email: string;
  telefone: string;
  assunto: string;
  mensagem: string;
  dataRecebimento?: string;
  lido?: boolean;
}