/** Tipos compartilhados entre a API e as telas. */

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  documento: string;
  emailAdicional?: string | null;
  foto?: string | null;
  nomeCertificado?: string | null;
  /** ISO. Serve para travar a troca do nome do certificado por 6 meses. */
  certificadoAlteradoEm?: string | null;
};

export type Assinatura = {
  ativa: boolean;
  plano: 'Essencial' | 'Profissional' | 'Completo' | null;
  /** ISO */
  validaAte?: string | null;
};

export type Sessao = {
  token: string;
  usuario: Usuario;
  assinatura: Assinatura;
};

/** Erro devolvido pela API, já tratado para a tela mostrar. */
export type ErroApi = {
  mensagem: string;
  /** Quando o erro é de um campo específico: 'identificador' | 'senha' | ... */
  campo?: string;
};

/** Campos que o perfil pode alterar. E-mail principal e documento ficam de fora. */
export type DadosPerfil = {
  nome?: string;
  emailAdicional?: string | null;
  nomeCertificado?: string;
};

/* ------------------------------------------------------------------
   Cursos
   ------------------------------------------------------------------ */

export type StatusAula = 'nao-assistido' | 'em-andamento' | 'assistido';

export type Aula = {
  id: string;
  titulo: string;
  /** Etiqueta do assunto, tipo "Emitir boleto" ou "Reembolso". */
  assunto: string;
  duracaoMin: number;
  /** Ramo do conteúdo: Saúde, Odonto, Vida, Viagem. */
  ramo: string;
  status: StatusAula;
  /** Quanto do vídeo já foi assistido, de 0 a 100. */
  progresso: number;
  /** Identificador do vídeo no player (Panda Vídeo, Mux, etc). */
  videoId?: string | null;
};

/** Versão resumida usada nas listagens. */
export type CursoResumo = {
  id: string;
  nome: string;
  /** Duas letras mostradas sobre a capa colorida. */
  sigla: string;
  cor: string;
  categoria: string;
  totalAulas: number;
  duracaoMin: number;
  aulasConcluidas: number;
  emAlta: boolean;
  favorito: boolean;
};

export type CursoDetalhe = CursoResumo & {
  aulas: Aula[];
};

/** Um bloco da tela de Início: "Em alta", "Operadoras", etc. */
export type GrupoCatalogo = {
  id: string;
  titulo: string;
  cursos: CursoResumo[];
};

/* ------------------------------------------------------------------
   Biblioteca
   ------------------------------------------------------------------ */

export type OperadoraBiblioteca = {
  id: string;
  nome: string;
  cor: string;
  totalTemas: number;
  totalMateriais: number;
};

export type PastaBiblioteca = {
  id: string;
  nome: string;
  totalMateriais: number;
};

export type TipoArquivo = 'PDF' | 'DOC' | 'XLS' | 'PPT' | 'IMG' | 'ZIP';

export type ArquivoBiblioteca = {
  id: string;
  nome: string;
  tipo: TipoArquivo;
  /** ISO */
  data: string;
  ano: number;
  /** Link para abrir ou baixar. Vem da API. */
  url?: string | null;
};

/* ------------------------------------------------------------------
   Institucional
   ------------------------------------------------------------------ */

export type Plano = {
  id: string;
  nome: string;
  descricao: string;
  precoMensal: number;
  /** Recursos inclusos, na ordem em que aparecem na tela. */
  recursos: string[];
  destaque?: boolean;
};

export type PerguntaFaq = {
  id: string;
  pergunta: string;
  resposta: string;
};

export type CategoriaFaq = {
  id: string;
  titulo: string;
  perguntas: PerguntaFaq[];
};

export type CanalContato = {
  id: string;
  tipo: 'email' | 'telefone' | 'whatsapp' | 'site';
  rotulo: string;
  valor: string;
  detalhe?: string;
  /** Link que o botão abre: mailto:, tel:, https://wa.me/... */
  url: string;
};
