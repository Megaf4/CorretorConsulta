import {
  ANOS_BIBLIOTECA,
  OPERADORAS_BIBLIOTECA,
  PASTAS_BIBLIOTECA,
  arquivosDemo,
} from './biblioteca-demo';
import { CURSOS_DEMO, GRUPOS_DEMO, GRUPO_DO_CURSO } from './catalogo-demo';
import { CONTATOS_DEMO, FAQ_DEMO, PLANOS_DEMO } from './institucional-demo';
import type {
  ArquivoBiblioteca,
  CanalContato,
  CategoriaFaq,
  CursoDetalhe,
  CursoResumo,
  DadosPerfil,
  ErroApi,
  GrupoCatalogo,
  OperadoraBiblioteca,
  PastaBiblioteca,
  Plano,
  Sessao,
  Usuario,
} from './tipos';

/**
 * Camada única de comunicação com o back-end.
 * Nenhuma tela deve chamar fetch direto: tudo passa por aqui.
 *
 * Para apontar para a API de verdade, crie um arquivo .env na raiz com:
 *   EXPO_PUBLIC_API_URL=https://api.corretorconsulta.com.br
 *
 * Enquanto essa variável não existir, o app roda em MODO SIMULADO:
 * o login funciona localmente para dar para testar as telas sem back-end.
 */

export const URL_BASE = process.env.EXPO_PUBLIC_API_URL ?? '';
export const MODO_SIMULADO = !URL_BASE;

const TEMPO_LIMITE = 15000;

export class FalhaApi extends Error implements ErroApi {
  mensagem: string;
  campo?: string;
  status?: number;

  constructor(mensagem: string, campo?: string, status?: number) {
    super(mensagem);
    this.name = 'FalhaApi';
    this.mensagem = mensagem;
    this.campo = campo;
    this.status = status;
  }
}

type Opcoes = {
  metodo?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  corpo?: unknown;
  token?: string | null;
};

async function requisicao<T>(caminho: string, opcoes: Opcoes = {}): Promise<T> {
  const { metodo = 'GET', corpo, token } = opcoes;
  const controle = new AbortController();
  const relogio = setTimeout(() => controle.abort(), TEMPO_LIMITE);

  try {
    const resposta = await fetch(`${URL_BASE}${caminho}`, {
      method: metodo,
      headers: {
        Accept: 'application/json',
        ...(corpo ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: corpo ? JSON.stringify(corpo) : undefined,
      signal: controle.signal,
    });

    const texto = await resposta.text();
    const dados = texto ? JSON.parse(texto) : null;

    if (!resposta.ok) {
      throw new FalhaApi(
        dados?.mensagem ?? dados?.message ?? 'Não foi possível completar a operação.',
        dados?.campo,
        resposta.status
      );
    }

    return dados as T;
  } catch (erro) {
    if (erro instanceof FalhaApi) throw erro;
    if (erro instanceof Error && erro.name === 'AbortError') {
      throw new FalhaApi('A conexão demorou demais. Tente de novo.');
    }
    throw new FalhaApi('Sem conexão com o servidor. Verifique sua internet.');
  } finally {
    clearTimeout(relogio);
  }
}

/* ------------------------------------------------------------------
   Modo simulado: some assim que EXPO_PUBLIC_API_URL for configurada.
   ------------------------------------------------------------------ */

const CONTAS_DEMO: Record<string, { senha: string; sessao: Sessao }> = {
  'christian.ricarth@gmail.com': {
    senha: 'corretor2026',
    sessao: {
      token: 'token-demo-assinante',
      usuario: {
        id: '1',
        nome: 'Christian Ricarth',
        email: 'christian.ricarth@gmail.com',
        documento: '529.982.247-25',
        nomeCertificado: 'Christian Ricarth',
        certificadoAlteradoEm: null,
      },
      assinatura: { ativa: true, plano: 'Completo', validaAte: null },
    },
  },
};

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

function contaDoToken(token: string) {
  return Object.values(CONTAS_DEMO).find((c) => c.sessao.token === token);
}

function resumir(curso: CursoDetalhe): CursoResumo {
  const { aulas: _aulas, ...resumo } = curso;
  return {
    ...resumo,
    aulasConcluidas: curso.aulas.filter((a) => a.status === 'assistido').length,
  };
}

function catalogoSimulado(): GrupoCatalogo[] {
  const grupos: GrupoCatalogo[] = [];

  const emAlta = CURSOS_DEMO.filter((c) => c.emAlta).map(resumir);
  if (emAlta.length) grupos.push({ id: 'em-alta', titulo: 'EM ALTA', cursos: emAlta });

  const favoritos = CURSOS_DEMO.filter((c) => c.favorito).map(resumir);
  if (favoritos.length) {
    grupos.push({ id: 'favoritos', titulo: 'SEUS FAVORITOS', cursos: favoritos });
  }

  for (const grupo of GRUPOS_DEMO) {
    const cursos = CURSOS_DEMO.filter((c) => GRUPO_DO_CURSO[c.id] === grupo.id).map(resumir);
    if (cursos.length) grupos.push({ id: grupo.id, titulo: grupo.titulo, cursos });
  }

  return grupos;
}

async function entrarSimulado(identificador: string, senha: string): Promise<Sessao> {
  await esperar(600);

  const conta =
    CONTAS_DEMO[identificador] ??
    Object.values(CONTAS_DEMO).find(
      (c) => c.sessao.usuario.documento.replace(/\D/g, '') === identificador
    );

  if (!conta) {
    throw new FalhaApi(
      'Não encontramos essa conta. Confira o e-mail ou o CPF/CNPJ.',
      'identificador'
    );
  }
  if (conta.senha !== senha) {
    throw new FalhaApi('Senha incorreta.', 'senha');
  }
  return conta.sessao;
}

/* ------------------------------------------------------------------
   Funções que as telas usam
   ------------------------------------------------------------------ */

export const api = {
  /** Login por e-mail ou CPF/CNPJ. */
  async entrar(identificador: string, senha: string): Promise<Sessao> {
    if (MODO_SIMULADO) return entrarSimulado(identificador, senha);
    return requisicao<Sessao>('/auth/entrar', {
      metodo: 'POST',
      corpo: { identificador, senha },
    });
  },

  /** Revalida o token guardado e devolve a sessão atualizada. */
  async sessaoAtual(token: string): Promise<Sessao> {
    if (MODO_SIMULADO) {
      await esperar(200);
      const conta = Object.values(CONTAS_DEMO).find((c) => c.sessao.token === token);
      if (!conta) throw new FalhaApi('Sessão expirada.', undefined, 401);
      return conta.sessao;
    }
    return requisicao<Sessao>('/auth/eu', { token });
  },

  /** Encerra a sessão no servidor. Falhar aqui não impede o logout local. */
  async sair(token: string): Promise<void> {
    if (MODO_SIMULADO) return;
    await requisicao<void>('/auth/sair', { metodo: 'POST', token });
  },

  /** Dispara o e-mail de redefinição de senha (tela de login, sem token). */
  async recuperarSenha(identificador: string): Promise<void> {
    if (MODO_SIMULADO) {
      await esperar(500);
      return;
    }
    await requisicao<void>('/auth/recuperar-senha', {
      metodo: 'POST',
      corpo: { identificador },
    });
  },

  /** Dispara o e-mail de troca de senha para quem já está logado. */
  async solicitarTrocaSenha(token: string): Promise<void> {
    if (MODO_SIMULADO) {
      await esperar(600);
      return;
    }
    await requisicao<void>('/perfil/trocar-senha', { metodo: 'POST', token });
  },

  /** Salva os campos editáveis do perfil e devolve o usuário atualizado. */
  async atualizarPerfil(token: string, dados: DadosPerfil): Promise<Usuario> {
    if (MODO_SIMULADO) {
      await esperar(700);
      const conta = contaDoToken(token);
      if (!conta) throw new FalhaApi('Sessão expirada.', undefined, 401);

      const usuario = conta.sessao.usuario;
      if (dados.nome !== undefined) usuario.nome = dados.nome;
      if (dados.emailAdicional !== undefined) usuario.emailAdicional = dados.emailAdicional;

      if (
        dados.nomeCertificado !== undefined &&
        dados.nomeCertificado !== usuario.nomeCertificado
      ) {
        usuario.nomeCertificado = dados.nomeCertificado;
        usuario.certificadoAlteradoEm = new Date().toISOString();
      }
      return { ...usuario };
    }

    return requisicao<Usuario>('/perfil', { metodo: 'PUT', corpo: dados, token });
  },

  /**
   * Envia a nova foto de perfil.
   * Vai como multipart/form-data, então não passa pelo helper de JSON.
   */
  async enviarFoto(token: string, uri: string): Promise<Usuario> {
    if (MODO_SIMULADO) {
      await esperar(600);
      const conta = contaDoToken(token);
      if (!conta) throw new FalhaApi('Sessão expirada.', undefined, 401);
      conta.sessao.usuario.foto = uri;
      return { ...conta.sessao.usuario };
    }

    const nome = uri.split('/').pop() ?? 'foto.jpg';
    const extensao = nome.split('.').pop()?.toLowerCase() ?? 'jpg';
    const formulario = new FormData();
    formulario.append('foto', {
      uri,
      name: nome,
      type: `image/${extensao === 'jpg' ? 'jpeg' : extensao}`,
    } as unknown as Blob);

    const resposta = await fetch(`${URL_BASE}/perfil/foto`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formulario,
    });

    const texto = await resposta.text();
    const dados = texto ? JSON.parse(texto) : null;
    if (!resposta.ok) {
      throw new FalhaApi(
        dados?.mensagem ?? 'Não foi possível enviar a foto.',
        undefined,
        resposta.status
      );
    }
    return dados as Usuario;
  },

  /* ----------------------------------------------------------------
     Cursos
     ---------------------------------------------------------------- */

  /** Catálogo da tela de Início, já dividido em blocos. */
  async catalogo(token: string): Promise<GrupoCatalogo[]> {
    if (MODO_SIMULADO) {
      await esperar(400);
      return catalogoSimulado();
    }
    return requisicao<GrupoCatalogo[]>('/cursos', { token });
  },

  /** Um curso com a lista de aulas. */
  async curso(token: string, cursoId: string): Promise<CursoDetalhe> {
    if (MODO_SIMULADO) {
      await esperar(300);
      const curso = CURSOS_DEMO.find((c) => c.id === cursoId);
      if (!curso) throw new FalhaApi('Curso não encontrado.', undefined, 404);
      return JSON.parse(JSON.stringify(curso)) as CursoDetalhe;
    }
    return requisicao<CursoDetalhe>(`/cursos/${cursoId}`, { token });
  },

  /**
   * Salva o quanto da aula já foi assistido.
   * Mandar progresso 100 marca a aula como concluída.
   */
  async salvarProgresso(
    token: string,
    cursoId: string,
    aulaId: string,
    progresso: number
  ): Promise<CursoDetalhe> {
    const valor = Math.max(0, Math.min(100, Math.round(progresso)));

    if (MODO_SIMULADO) {
      await esperar(250);
      const curso = CURSOS_DEMO.find((c) => c.id === cursoId);
      const aula = curso?.aulas.find((a) => a.id === aulaId);
      if (!curso || !aula) throw new FalhaApi('Aula não encontrada.', undefined, 404);

      aula.progresso = valor;
      aula.status = valor >= 100 ? 'assistido' : valor > 0 ? 'em-andamento' : 'nao-assistido';
      curso.aulasConcluidas = curso.aulas.filter((a) => a.status === 'assistido').length;
      return JSON.parse(JSON.stringify(curso)) as CursoDetalhe;
    }

    return requisicao<CursoDetalhe>(`/cursos/${cursoId}/aulas/${aulaId}/progresso`, {
      metodo: 'POST',
      corpo: { progresso: valor },
      token,
    });
  },

  /** Liga e desliga o curso dos favoritos. */
  async alternarFavorito(token: string, cursoId: string): Promise<CursoDetalhe> {
    if (MODO_SIMULADO) {
      await esperar(200);
      const curso = CURSOS_DEMO.find((c) => c.id === cursoId);
      if (!curso) throw new FalhaApi('Curso não encontrado.', undefined, 404);
      curso.favorito = !curso.favorito;
      return JSON.parse(JSON.stringify(curso)) as CursoDetalhe;
    }
    return requisicao<CursoDetalhe>(`/cursos/${cursoId}/favorito`, {
      metodo: 'POST',
      token,
    });
  },

  /** Cursos que a pessoa começou e ainda não terminou. */
  async meusCursos(token: string): Promise<CursoDetalhe[]> {
    if (MODO_SIMULADO) {
      await esperar(350);
      const emAndamento = CURSOS_DEMO.filter((curso) => {
        const feitas = curso.aulas.filter((a) => a.status === 'assistido').length;
        const comecou = curso.aulas.some((a) => a.progresso > 0);
        return comecou && feitas < curso.totalAulas;
      });
      return JSON.parse(JSON.stringify(emAndamento)) as CursoDetalhe[];
    }
    return requisicao<CursoDetalhe[]>('/cursos/meus', { token });
  },

  /* ----------------------------------------------------------------
     Biblioteca
     ---------------------------------------------------------------- */

  /** Operadoras que têm material na biblioteca. */
  async biblioteca(token: string): Promise<OperadoraBiblioteca[]> {
    if (MODO_SIMULADO) {
      await esperar(350);
      return OPERADORAS_BIBLIOTECA;
    }
    return requisicao<OperadoraBiblioteca[]>('/biblioteca', { token });
  },

  /** Pastas por tema de uma operadora. */
  async pastasBiblioteca(
    token: string,
    operadoraId: string
  ): Promise<{ operadora: OperadoraBiblioteca; pastas: PastaBiblioteca[] }> {
    if (MODO_SIMULADO) {
      await esperar(300);
      const operadora = OPERADORAS_BIBLIOTECA.find((o) => o.id === operadoraId);
      if (!operadora) throw new FalhaApi('Operadora não encontrada.', undefined, 404);
      return { operadora, pastas: PASTAS_BIBLIOTECA };
    }
    return requisicao(`/biblioteca/${operadoraId}`, { token });
  },

  /** Arquivos de uma pasta, filtrados por ano. */
  async arquivosBiblioteca(
    token: string,
    operadoraId: string,
    pastaId: string,
    ano: number
  ): Promise<{
    operadora: OperadoraBiblioteca;
    pasta: PastaBiblioteca;
    anos: number[];
    arquivos: ArquivoBiblioteca[];
  }> {
    if (MODO_SIMULADO) {
      await esperar(300);
      const operadora = OPERADORAS_BIBLIOTECA.find((o) => o.id === operadoraId);
      const pasta = PASTAS_BIBLIOTECA.find((p) => p.id === pastaId);
      if (!operadora || !pasta) throw new FalhaApi('Pasta não encontrada.', undefined, 404);
      return {
        operadora,
        pasta,
        anos: ANOS_BIBLIOTECA,
        arquivos: arquivosDemo(operadoraId, pastaId, ano),
      };
    }
    return requisicao(`/biblioteca/${operadoraId}/${pastaId}?ano=${ano}`, { token });
  },

  /* ----------------------------------------------------------------
     Institucional
     ---------------------------------------------------------------- */

  async planos(token: string): Promise<Plano[]> {
    if (MODO_SIMULADO) {
      await esperar(250);
      return PLANOS_DEMO;
    }
    return requisicao<Plano[]>('/planos', { token });
  },

  async faq(token: string): Promise<CategoriaFaq[]> {
    if (MODO_SIMULADO) {
      await esperar(250);
      return FAQ_DEMO;
    }
    return requisicao<CategoriaFaq[]>('/faq', { token });
  },

  async contatos(token: string): Promise<CanalContato[]> {
    if (MODO_SIMULADO) {
      await esperar(200);
      return CONTATOS_DEMO;
    }
    return requisicao<CanalContato[]>('/contato', { token });
  },
};

/** Exportado para as próximas telas (cursos, biblioteca, perfil) reusarem. */
export { requisicao };
