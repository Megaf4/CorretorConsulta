import type { CanalContato, CategoriaFaq, Plano } from './tipos';

/** Conteúdo institucional de demonstração. */

export const PLANOS_DEMO: Plano[] = [
  {
    id: 'essencial',
    nome: 'Essencial',
    descricao: 'Ideal para o corretor solo começando.',
    precoMensal: 49,
    recursos: ['Vídeos tutoriais', 'Biblioteca', 'Materiais de venda'],
  },
  {
    id: 'profissional',
    nome: 'Profissional',
    descricao: 'Para corretoras em crescimento.',
    precoMensal: 149,
    recursos: [
      'Vídeos tutoriais',
      'Biblioteca',
      'Materiais de venda',
      'CRM',
      'Gestor financeiro',
    ],
    destaque: true,
  },
  {
    id: 'completo',
    nome: 'Completo',
    descricao: 'Todos os recursos, sem limites.',
    precoMensal: 249,
    recursos: [
      'Vídeos tutoriais',
      'Biblioteca',
      'Materiais de venda',
      'CRM',
      'Gestor financeiro',
      'Cotador',
    ],
  },
];

/** Lista completa de recursos, para montar os itens riscados de cada plano. */
export const RECURSOS_PLANOS = [
  'Vídeos tutoriais',
  'Biblioteca',
  'Materiais de venda',
  'CRM',
  'Gestor financeiro',
  'Cotador',
];

export const FAQ_DEMO: CategoriaFaq[] = [
  {
    id: 'operacional',
    titulo: 'Operacional',
    perguntas: [
      {
        id: 'op-1',
        pergunta: 'Como faço para solicitar segunda via do carnê do cliente?',
        resposta:
          'Entre no portal da operadora, abra o contrato do cliente e procure a área financeira. Na maioria delas a segunda via sai na hora; no Bradesco e na SulAmérica é preciso abrir protocolo. O passo a passo de cada uma está nos vídeos da operadora.',
      },
      {
        id: 'op-2',
        pergunta: 'Como funciona a portabilidade de operadora?',
        resposta:
          'O cliente precisa cumprir a permanência mínima no plano atual, estar em dia com as mensalidades e escolher um plano compatível em faixa de preço. A janela de portabilidade é de 120 dias a partir do aniversário do contrato.',
      },
      {
        id: 'op-3',
        pergunta: 'Como acesso o histórico de atendimentos de um cliente?',
        resposta:
          'Pelo portal da operadora, na ficha do beneficiário. Algumas exigem procuração digital do titular para liberar o histórico ao corretor.',
      },
      {
        id: 'op-4',
        pergunta: 'Como funciona o cancelamento de contrato por parte do cliente?',
        resposta:
          'O pedido tem que ser formalizado por protocolo, com data de vigência. Vale conferir se existe multa por fidelidade e se as mensalidades estão quitadas, senão a operadora recusa a baixa.',
      },
    ],
  },
  {
    id: 'comercial',
    titulo: 'Comercial',
    perguntas: [
      {
        id: 'com-1',
        pergunta: 'Qual é o prazo de carência para planos de saúde PME?',
        resposta:
          'Em contratos com 30 vidas ou mais, a operadora costuma isentar a carência. Abaixo disso valem os prazos da ANS: 24 horas para urgência, 180 dias para procedimentos em geral e 300 dias para parto.',
      },
      {
        id: 'com-2',
        pergunta: 'Onde encontro as tabelas de preços atualizadas?',
        resposta:
          'Na Biblioteca, dentro da operadora, na pasta Tabela de Preços. Os arquivos ficam separados por ano.',
      },
    ],
  },
  {
    id: 'documentacao',
    titulo: 'Documentação',
    perguntas: [
      {
        id: 'doc-1',
        pergunta: 'Quais documentos são necessários para incluir um dependente?',
        resposta:
          'Documento de identidade, CPF e o comprovante do vínculo: certidão de nascimento para filhos, certidão de casamento ou declaração de união estável para cônjuge. Algumas operadoras pedem também a declaração de saúde do novo dependente.',
      },
    ],
  },
  {
    id: 'treinamentos',
    titulo: 'Treinamentos',
    perguntas: [
      {
        id: 'tre-1',
        pergunta: 'Existe algum treinamento obrigatório para renovação da certificação?',
        resposta:
          'Depende da operadora. Várias exigem reciclagem anual no portal delas para manter o código de corretor ativo. Os avisos aparecem na aba Comunicados da Biblioteca.',
      },
    ],
  },
];

export const CONTATOS_DEMO: CanalContato[] = [
  {
    id: 'email',
    tipo: 'email',
    rotulo: 'E-MAIL',
    valor: 'contato@corretorconsulta.com.br',
    detalhe: 'Resposta em até 1 dia útil',
    url: 'mailto:contato@corretorconsulta.com.br',
  },
  {
    id: 'telefone',
    tipo: 'telefone',
    rotulo: 'TELEFONE',
    valor: '(11) 99999-9999',
    detalhe: 'Seg. a sex., 9h às 18h',
    url: 'tel:+5511999999999',
  },
  {
    id: 'whatsapp',
    tipo: 'whatsapp',
    rotulo: 'WHATSAPP',
    valor: 'Falar agora',
    detalhe: 'O canal mais rápido',
    url: 'https://wa.me/5511999999999',
  },
  {
    id: 'site',
    tipo: 'site',
    rotulo: 'SITE',
    valor: 'corretorconsulta.com.br',
    detalhe: 'Planos e biblioteca completa',
    url: 'https://corretorconsulta.com.br',
  },
];
