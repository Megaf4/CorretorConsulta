/**
 * Design tokens do Corretor Consulta.
 * Todas as telas devem puxar cor, espaçamento e tipografia daqui,
 * para o app inteiro mudar de uma vez se a marca mudar.
 */

export const Cores = {
  // Marca
  marinho: '#1E2B46',
  marinhoEscuro: '#16223A',
  petroleo: '#1B6A93',
  petroleoClaro: '#2592FB',
  aco: '#959EB1',

  // Superfícies
  fundo: '#FFFFFF',
  fundoSuave: '#F4F7FA',
  borda: '#D5DBE5',
  bordaSuave: '#E2E7EF',

  // Texto
  texto: '#1E2B46',
  textoSecundario: '#5A6880',
  textoApagado: '#8A94A6',
  placeholder: '#A8B0BF',
  textoInverso: '#FFFFFF',

  // Estado
  sucesso: '#12784D',
  sucessoFundo: '#DFF3E8',
  erro: '#C0392B',
  erroFundo: '#FBEAED',
  alerta: '#B8860B',
  alertaFundo: '#FCF6E6',
} as const;

export const Espaco = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const Raio = {
  sm: 6,
  md: 9,
  lg: 14,
  xl: 22,
  redondo: 999,
} as const;

export const Fonte = {
  minuscula: 11,
  pequena: 12,
  corpo: 14,
  medio: 15,
  grande: 18,
  titulo: 22,
  destaque: 30,
} as const;

/** Cores de cada operadora, usadas nos cards de curso e na biblioteca. */
export const CoresOperadora: Record<string, string> = {
  amil: '#1E4C9A',
  'amil-dental': '#6B3FA0',
  alice: '#E8368F',
  'bradesco-saude': '#C8102E',
  'bradesco-vida': '#C8102E',
  sulamerica: '#EE7203',
  'porto-saude': '#2B5CE6',
  'porto-seguro': '#C4870F',
  hapvida: '#F07C22',
  notredame: '#F07C22',
  unimed: '#00995D',
  omint: '#1B4F9C',
  medsenior: '#C4870F',
  'dona-saude': '#E8368F',
  odontoprev: '#1B4F9C',
  corpe: '#2E4756',
  qualicorp: '#00A0AE',
  supermed: '#1B7A3E',
  gta: '#1B3A8C',
  metlife: '#1B6FB5',
  prudential: '#1B4F9C',
  icatu: '#1B6A93',
  'assist-card': '#1B6FB5',
  affinity: '#C8102E',
  coris: '#2B5CE6',
  padrao: '#1E2B46',
};

export const corDaOperadora = (id?: string) =>
  (id && CoresOperadora[id]) || CoresOperadora.padrao;
