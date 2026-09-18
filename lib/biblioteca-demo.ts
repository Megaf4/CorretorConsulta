import type { ArquivoBiblioteca, OperadoraBiblioteca, PastaBiblioteca, TipoArquivo } from './tipos';

/**
 * Biblioteca de demonstração.
 * Some quando EXPO_PUBLIC_API_URL for configurada.
 */

export const OPERADORAS_BIBLIOTECA: OperadoraBiblioteca[] = [
  { id: 'alice-saude', nome: 'Alice Saúde', cor: '#E8368F', totalTemas: 10, totalMateriais: 135 },
  { id: 'amil-dental', nome: 'Amil Dental', cor: '#1E4C9A', totalTemas: 10, totalMateriais: 135 },
  { id: 'bradesco-saude', nome: 'Bradesco Saúde', cor: '#C8102E', totalTemas: 10, totalMateriais: 137 },
  { id: 'care-plus', nome: 'Care Plus Saúde', cor: '#2B5CE6', totalTemas: 10, totalMateriais: 135 },
  { id: 'categorias-reajuste', nome: 'Categorias e reajuste', cor: '#5A6880', totalTemas: 10, totalMateriais: 135 },
  { id: 'central-nacional-unimed', nome: 'Central Nacional Unimed', cor: '#00995D', totalTemas: 10, totalMateriais: 135 },
  { id: 'hapvida-saude', nome: 'Hapvida Saúde', cor: '#F07C22', totalTemas: 10, totalMateriais: 135 },
  { id: 'medsenior', nome: 'MedSênior', cor: '#C4870F', totalTemas: 10, totalMateriais: 135 },
  { id: 'notredame', nome: 'NotreDame', cor: '#F07C22', totalTemas: 10, totalMateriais: 135 },
  { id: 'omint-saude', nome: 'Omint Saúde', cor: '#1B4F9C', totalTemas: 10, totalMateriais: 135 },
  { id: 'prevent-senior', nome: 'Prevent Sênior', cor: '#C8102E', totalTemas: 10, totalMateriais: 137 },
  { id: 'sami-saude', nome: 'Sami Saúde', cor: '#00995D', totalTemas: 10, totalMateriais: 137 },
  { id: 'sao-cristovao', nome: 'São Cristóvão', cor: '#C8102E', totalTemas: 10, totalMateriais: 135 },
  { id: 'seguros-unimed', nome: 'Seguros Unimed', cor: '#00995D', totalTemas: 10, totalMateriais: 137 },
  { id: 'select', nome: 'Select', cor: '#F07C22', totalTemas: 10, totalMateriais: 137 },
  { id: 'sulamerica-saude', nome: 'SulAmérica Saúde', cor: '#EE7203', totalTemas: 10, totalMateriais: 133 },
  { id: 'transmontano', nome: 'Transmontano', cor: '#2E4756', totalTemas: 10, totalMateriais: 133 },
  { id: 'unica-saude', nome: 'Única Saúde', cor: '#E8368F', totalTemas: 10, totalMateriais: 135 },
  { id: 'unimed-nacional', nome: 'Unimed Nacional', cor: '#00995D', totalTemas: 10, totalMateriais: 135 },
];

export const PASTAS_BIBLIOTECA: PastaBiblioteca[] = [
  { id: 'apresentacao', nome: 'Apresentação', totalMateriais: 14 },
  { id: 'regras', nome: 'Regras', totalMateriais: 12 },
  { id: 'rede-atendimento', nome: 'Rede de Atendimento', totalMateriais: 14 },
  { id: 'condicoes-gerais', nome: 'Condições Gerais', totalMateriais: 14 },
  { id: 'materiais-venda', nome: 'Materiais de Venda', totalMateriais: 15 },
  { id: 'tabela-precos', nome: 'Tabela de Preços', totalMateriais: 13 },
  { id: 'tabela-coparticipacao', nome: 'Tabela de Coparticipação', totalMateriais: 13 },
  { id: 'comunicados', nome: 'Comunicados', totalMateriais: 15 },
  { id: 'formularios', nome: 'Formulários', totalMateriais: 15 },
  { id: 'outros', nome: 'Outros', totalMateriais: 12 },
];

export const ANOS_BIBLIOTECA = [2026, 2025, 2024, 2023];

const MODELOS: Record<string, [nome: string, tipo: TipoArquivo][]> = {
  apresentacao: [
    ['Apresentação institucional', 'PPT'],
    ['Deck comercial', 'PPT'],
    ['Pitch da operadora', 'DOC'],
    ['Comparativo de categorias', 'PDF'],
    ['Tabela resumo de rede', 'XLS'],
  ],
  regras: [
    ['Regras de aceitação', 'PDF'],
    ['Regras de carência e CPT', 'PDF'],
    ['Manual de movimentação', 'DOC'],
  ],
  'rede-atendimento': [
    ['Rede credenciada por estado', 'XLS'],
    ['Hospitais de referência', 'PDF'],
    ['Laboratórios conveniados', 'XLS'],
  ],
  'condicoes-gerais': [
    ['Condições gerais do contrato', 'PDF'],
    ['Aditivo de coparticipação', 'PDF'],
  ],
  'materiais-venda': [
    ['Folder de vendas', 'PDF'],
    ['Post para redes sociais', 'IMG'],
    ['Kit de materiais', 'ZIP'],
  ],
  'tabela-precos': [
    ['Tabela de preços PME', 'XLS'],
    ['Tabela de preços adesão', 'XLS'],
  ],
  'tabela-coparticipacao': [['Tabela de coparticipação', 'XLS']],
  comunicados: [
    ['Comunicado de reajuste', 'PDF'],
    ['Aviso de mudança de rede', 'PDF'],
  ],
  formularios: [
    ['Proposta de adesão', 'PDF'],
    ['Formulário de inclusão de dependente', 'PDF'],
    ['Declaração de saúde', 'DOC'],
  ],
  outros: [['Perguntas frequentes da operadora', 'PDF']],
};

/** Gera a lista de arquivos de uma pasta num ano. */
export function arquivosDemo(
  operadoraId: string,
  pastaId: string,
  ano: number
): ArquivoBiblioteca[] {
  const modelos = MODELOS[pastaId] ?? MODELOS.outros;

  return modelos.map(([nome, tipo], i) => {
    const mes = String(2 + i * 2).padStart(2, '0');
    const dia = String(2 + i * 7).padStart(2, '0');
    return {
      id: `${operadoraId}-${pastaId}-${ano}-${i + 1}`,
      nome: `${nome} ${ano}`,
      tipo,
      data: `${ano}-${mes}-${dia}`,
      ano,
      url: null,
    };
  });
}
