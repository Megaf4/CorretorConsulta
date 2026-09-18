import type { Aula, CursoDetalhe, StatusAula } from './tipos';

/**
 * Catálogo de demonstração.
 * Usado só enquanto EXPO_PUBLIC_API_URL não estiver configurada.
 * Quando a API entrar, este arquivo pode ser apagado: a tela não depende dele,
 * quem consome é o modo simulado do lib/api.ts.
 */

type Semente = {
  id: string;
  nome: string;
  sigla: string;
  cor: string;
  categoria: string;
  grupo: string;
  emAlta?: boolean;
  favorito?: boolean;
  aulas: [titulo: string, assunto: string, minutos: number, status: StatusAula, progresso: number][];
};

const R = {
  saude: 'Saúde',
  odonto: 'Odonto',
  vida: 'Vida',
  viagem: 'Viagem',
  plataforma: 'Plataforma',
};

const SEMENTES: Semente[] = [
  {
    id: 'amil', nome: 'Amil', sigla: 'AM', cor: '#1E4C9A',
    categoria: 'saúde', grupo: 'operadoras', emAlta: true,
    aulas: [
      ['Como emitir 2ª via de boleto no portal Amil', '2ª via de boleto', 6, 'assistido', 100],
      ['Inclusão de dependente no contrato Amil PME', 'Inclusão de dependente', 8, 'em-andamento', 40],
      ['Emissão de contrato Amil PME do zero', 'Emitir contrato', 14, 'nao-assistido', 0],
      ['Cotação rápida Amil no portal do corretor', 'Cotação', 7, 'nao-assistido', 0],
    ],
  },
  {
    id: 'bradesco-saude', nome: 'Bradesco Saúde', sigla: 'BS', cor: '#C8102E',
    categoria: 'saúde', grupo: 'seguradoras', emAlta: true,
    aulas: [
      ['Bradesco Saúde: como emitir boleto mensal', 'Emitir boleto', 5, 'nao-assistido', 0],
      ['Inclusão de dependente Bradesco Saúde', 'Inclusão de dependente', 9, 'assistido', 100],
      ['Reembolso Bradesco Saúde: como solicitar pelo app', 'Reembolso', 8, 'nao-assistido', 0],
    ],
  },
  {
    id: 'sulamerica', nome: 'SulAmérica', sigla: 'SA', cor: '#EE7203',
    categoria: 'saúde', grupo: 'seguradoras', emAlta: true,
    aulas: [
      ['SulAmérica: emissão de contrato adesão', 'Emitir contrato', 11, 'nao-assistido', 0],
      ['2ª via de boleto SulAmérica em 3 cliques', '2ª via de boleto', 4, 'assistido', 100],
      ['Portabilidade SulAmérica: regras e prazos', 'Portabilidade', 12, 'nao-assistido', 0],
    ],
  },
  {
    id: 'unimed', nome: 'Unimed', sigla: 'UN', cor: '#00995D',
    categoria: 'saúde', grupo: 'operadoras', favorito: true,
    aulas: [
      ['Unimed: como emitir 2ª via no portal', '2ª via de boleto', 5, 'assistido', 100],
      ['Reajuste anual Unimed: como explicar ao cliente', 'Reajuste', 12, 'nao-assistido', 0],
    ],
  },
  {
    id: 'odontoprev', nome: 'Odontoprev', sigla: 'OP', cor: '#1B4F9C',
    categoria: 'odonto', grupo: 'operadoras', favorito: true,
    aulas: [
      ['Odontoprev: emissão de boleto e baixa', 'Emitir boleto', 5, 'nao-assistido', 0],
      ['Inclusão de dependente Odontoprev', 'Inclusão de dependente', 6, 'assistido', 100],
      ['Cancelamento Odontoprev: passo a passo', 'Cancelamento', 7, 'nao-assistido', 0],
    ],
  },
  {
    id: 'porto-saude', nome: 'Porto Saúde', sigla: 'PS', cor: '#2B5CE6',
    categoria: 'saúde', grupo: 'seguradoras',
    aulas: [['Porto Saúde: emissão de contrato individual', 'Emitir contrato', 10, 'nao-assistido', 0]],
  },
  {
    id: 'alice', nome: 'Alice', sigla: 'AL', cor: '#E8368F',
    categoria: 'saúde', grupo: 'operadoras',
    aulas: [
      ['Alice: adesão e onboarding do beneficiário', 'Adesão', 8, 'nao-assistido', 0],
      ['Alice: como funciona o time de saúde', 'Atendimento', 6, 'nao-assistido', 0],
    ],
  },
  {
    id: 'hapvida', nome: 'Hapvida NotreDame', sigla: 'HN', cor: '#F07C22',
    categoria: 'saúde', grupo: 'operadoras',
    aulas: [
      ['Hapvida: emissão de boleto e envio por e-mail', 'Emitir boleto', 5, 'nao-assistido', 0],
      ['Cancelamento de contrato Hapvida sem retenção', 'Cancelamento', 9, 'em-andamento', 55],
      ['NotreDame: cotação PME passo a passo', 'Cotação', 8, 'nao-assistido', 0],
      ['Adesão NotreDame: checklist do corretor', 'Adesão', 10, 'nao-assistido', 0],
    ],
  },
  {
    id: 'omint', nome: 'Omint', sigla: 'OM', cor: '#1B4F9C',
    categoria: 'saúde', grupo: 'operadoras',
    aulas: [
      ['Omint: rede internacional e reembolso', 'Reembolso', 9, 'nao-assistido', 0],
      ['Omint: emissão de contrato premium', 'Emitir contrato', 6, 'nao-assistido', 0],
    ],
  },
  {
    id: 'medsenior', nome: 'MedSênior', sigla: 'MS', cor: '#C4870F',
    categoria: 'saúde', grupo: 'operadoras',
    aulas: [
      ['MedSênior: regras de idade e carência', 'Carências', 7, 'nao-assistido', 0],
      ['MedSênior: emissão de proposta', 'Emitir contrato', 6, 'nao-assistido', 0],
    ],
  },
  {
    id: 'dona-saude', nome: 'Dona Saúde', sigla: 'DS', cor: '#E8368F',
    categoria: 'saúde', grupo: 'operadoras',
    aulas: [['Dona Saúde: cotação e envio de proposta', 'Cotação', 8, 'nao-assistido', 0]],
  },
  {
    id: 'corpe', nome: 'Corpe', sigla: 'CO', cor: '#2E4756',
    categoria: 'benefícios', grupo: 'administradoras',
    aulas: [
      ['Corpe: elegibilidade por entidade de classe', 'Adesão', 7, 'nao-assistido', 0],
      ['Corpe: documentos da proposta de adesão', 'Documentos', 5, 'nao-assistido', 0],
    ],
  },
  {
    id: 'qualicorp', nome: 'Qualicorp', sigla: 'QC', cor: '#00A0AE',
    categoria: 'benefícios', grupo: 'administradoras',
    aulas: [
      ['Qualicorp: portal do corretor na prática', 'Portal', 9, 'nao-assistido', 0],
      ['Qualicorp: 2ª via e negociação de atraso', '2ª via de boleto', 7, 'nao-assistido', 0],
    ],
  },
  {
    id: 'supermed', nome: 'Supermed', sigla: 'SM', cor: '#1B7A3E',
    categoria: 'benefícios', grupo: 'administradoras',
    aulas: [['Supermed: adesão e vigência', 'Adesão', 7, 'nao-assistido', 0]],
  },
  {
    id: 'gta', nome: 'GTA', sigla: 'GT', cor: '#1B3A8C',
    categoria: 'seguro viagem', grupo: 'viagem',
    aulas: [['GTA: 2ª via de voucher de viagem', '2ª via de boleto', 4, 'assistido', 100]],
  },
  {
    id: 'porto-viagem', nome: 'Porto', sigla: 'PO', cor: '#2B5CE6',
    categoria: 'seguro viagem', grupo: 'viagem',
    aulas: [
      ['Porto Viagem: cotação e emissão', 'Cotação', 7, 'nao-assistido', 0],
      ['Porto Viagem: acionamento de sinistro', 'Sinistro', 6, 'nao-assistido', 0],
    ],
  },
  {
    id: 'sulamerica-viagem', nome: 'SulAmérica', sigla: 'SV', cor: '#EE7203',
    categoria: 'seguro viagem', grupo: 'viagem',
    aulas: [
      ['SulAmérica Viagem: coberturas por destino', 'Cotação', 6, 'nao-assistido', 0],
      ['SulAmérica Viagem: emissão de voucher', 'Emitir contrato', 5, 'nao-assistido', 0],
    ],
  },
  {
    id: 'bradesco-viagem', nome: 'Bradesco', sigla: 'BV', cor: '#2C3A52',
    categoria: 'seguro viagem', grupo: 'viagem',
    aulas: [['Bradesco Viagem: emissão e cancelamento', 'Emitir contrato', 9, 'nao-assistido', 0]],
  },
  {
    id: 'porto-vida', nome: 'Porto', sigla: 'PV', cor: '#2B5CE6',
    categoria: 'seguro de vida', grupo: 'vida',
    aulas: [
      ['Porto Seguro Vida: cotação online', 'Cotação', 6, 'nao-assistido', 0],
      ['Porto Seguro: emissão de boleto', 'Emitir boleto', 5, 'assistido', 100],
    ],
  },
  {
    id: 'bradesco-vida', nome: 'Bradesco', sigla: 'BD', cor: '#C8102E',
    categoria: 'seguro de vida', grupo: 'vida',
    aulas: [
      ['Bradesco Vida: emissão de contrato individual', 'Emitir contrato', 11, 'em-andamento', 35],
      ['Bradesco Vida: cancelamento e devolução', 'Cancelamento', 8, 'nao-assistido', 0],
    ],
  },
  {
    id: 'sulamerica-vida', nome: 'SulAmérica', sigla: 'SS', cor: '#EE7203',
    categoria: 'seguro de vida', grupo: 'vida',
    aulas: [['SulAmérica Vida: capital segurado e carência', 'Carências', 8, 'nao-assistido', 0]],
  },
  {
    id: 'consultar-rede', nome: 'Como consultar rede', sigla: 'CR', cor: '#1E2B46',
    categoria: 'consulta', grupo: 'apoio',
    aulas: [
      ['Consulta de rede credenciada por estado', 'Consulta', 6, 'nao-assistido', 0],
      ['Checando hospital antes de fechar a venda', 'Consulta', 5, 'nao-assistido', 0],
    ],
  },
  {
    id: 'obter-contrato', nome: 'Como obter o contrato', sigla: 'CT', cor: '#1E2B46',
    categoria: 'documento', grupo: 'apoio',
    aulas: [['Onde baixar a via assinada do contrato', 'Documentos', 6, 'nao-assistido', 0]],
  },
  {
    id: 'simulador', nome: 'Simulador', sigla: 'SI', cor: '#1E2B46',
    categoria: 'ferramenta', grupo: 'apoio',
    aulas: [['Simulador de preços: como usar', 'Ferramenta', 5, 'nao-assistido', 0]],
  },
  {
    id: 'painel-corretor', nome: 'Painel do Corretor', sigla: 'PC', cor: '#1E2B46',
    categoria: 'portal', grupo: 'apoio',
    aulas: [
      ['Painel do Corretor: primeiro acesso', 'Portal', 6, 'nao-assistido', 0],
      ['Painel do Corretor: relatórios de comissão', 'Portal', 6, 'nao-assistido', 0],
    ],
  },
  {
    id: 'onboarding-cc', nome: 'Onboarding CC', sigla: 'ON', cor: '#1B6A93',
    categoria: 'tutorial', grupo: 'tutoriais',
    aulas: [
      ['Bem-vindo ao Corretor Consulta', 'Plataforma', 4, 'nao-assistido', 0],
      ['Como a biblioteca está organizada', 'Plataforma', 5, 'nao-assistido', 0],
      ['Emitindo o seu primeiro certificado', 'Plataforma', 5, 'nao-assistido', 0],
    ],
  },
  {
    id: 'como-navegar', nome: 'Como navegar', sigla: 'CN', cor: '#1B6A93',
    categoria: 'tutorial', grupo: 'tutoriais',
    aulas: [
      ['Busca e filtros do aplicativo', 'Plataforma', 4, 'nao-assistido', 0],
      ['Favoritos e continuar de onde parou', 'Plataforma', 5, 'nao-assistido', 0],
    ],
  },
  {
    id: 'trilhas-iniciais', nome: 'Trilhas iniciais', sigla: 'TI', cor: '#1B6A93',
    categoria: 'tutorial', grupo: 'tutoriais',
    aulas: [
      ['Trilha do corretor iniciante', 'Plataforma', 6, 'nao-assistido', 0],
      ['Trilha de pós-venda', 'Plataforma', 5, 'nao-assistido', 0],
      ['Trilha de saúde PME', 'Plataforma', 5, 'nao-assistido', 0],
      ['Trilha de odonto', 'Plataforma', 5, 'nao-assistido', 0],
    ],
  },
  {
    id: 'materiais-apoio', nome: 'Materiais de apoio', sigla: 'MA', cor: '#1B6A93',
    categoria: 'tutorial', grupo: 'tutoriais',
    aulas: [
      ['Como baixar tabelas e comparativos', 'Plataforma', 5, 'nao-assistido', 0],
      ['Usando os materiais de venda com o cliente', 'Plataforma', 5, 'nao-assistido', 0],
    ],
  },
  {
    id: 'tutoriais-destaque', nome: 'Tutoriais em destaque', sigla: 'TD', cor: '#1B6A93',
    categoria: 'tutorial', grupo: 'tutoriais',
    aulas: [
      ['Os 5 tutoriais mais assistidos do mês', 'Plataforma', 6, 'nao-assistido', 0],
      ['O que mudou nos portais neste trimestre', 'Plataforma', 5, 'nao-assistido', 0],
      ['Erros que mais travam a movimentação', 'Plataforma', 5, 'nao-assistido', 0],
    ],
  },
  {
    id: 'atualizacoes-recentes', nome: 'Atualizações recentes', sigla: 'AR', cor: '#1B6A93',
    categoria: 'novidade', grupo: 'tutoriais',
    aulas: [['Novidades da plataforma neste mês', 'Plataforma', 6, 'nao-assistido', 0]],
  },
];

const RAMO_POR_CATEGORIA: Record<string, string> = {
  'saúde': R.saude,
  odonto: R.odonto,
  'seguro de vida': R.vida,
  'seguro viagem': R.viagem,
  'benefícios': R.saude,
};

function montar(semente: Semente): CursoDetalhe {
  const ramo = RAMO_POR_CATEGORIA[semente.categoria] ?? R.plataforma;

  const aulas: Aula[] = semente.aulas.map(([titulo, assunto, minutos, status, progresso], i) => ({
    id: `${semente.id}-${i + 1}`,
    titulo,
    assunto,
    duracaoMin: minutos,
    ramo,
    status,
    progresso,
    videoId: null,
  }));

  return {
    id: semente.id,
    nome: semente.nome,
    sigla: semente.sigla,
    cor: semente.cor,
    categoria: semente.categoria,
    totalAulas: aulas.length,
    duracaoMin: aulas.reduce((soma, a) => soma + a.duracaoMin, 0),
    aulasConcluidas: aulas.filter((a) => a.status === 'assistido').length,
    emAlta: !!semente.emAlta,
    favorito: !!semente.favorito,
    aulas,
  };
}

/** Estado vivo do catálogo simulado: o progresso alterado fica guardado aqui. */
export const CURSOS_DEMO: CursoDetalhe[] = SEMENTES.map(montar);

export const GRUPOS_DEMO: { id: string; titulo: string }[] = [
  { id: 'seguradoras', titulo: 'SEGURADORAS' },
  { id: 'operadoras', titulo: 'OPERADORAS' },
  { id: 'administradoras', titulo: 'ADMINISTRADORAS DE BENEFÍCIOS' },
  { id: 'viagem', titulo: 'SEGURO VIAGEM' },
  { id: 'vida', titulo: 'SEGURO DE VIDA' },
  { id: 'apoio', titulo: 'DEMAIS ACESSOS' },
  { id: 'tutoriais', titulo: 'TUTORIAIS CORRETOR CONSULTA' },
];

export const GRUPO_DO_CURSO: Record<string, string> = Object.fromEntries(
  SEMENTES.map((s) => [s.id, s.grupo])
);
