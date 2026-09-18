import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';

import { api, FalhaApi } from './api';
import { useItemArmazenado } from './armazenamento';
import type { Sessao, Usuario } from './tipos';

/**
 * Contexto de sessão do app.
 * Qualquer tela pode chamar useSessao() para saber quem está logado
 * e se a assinatura está ativa.
 */

type ValorContexto = {
  /** true enquanto lemos o token guardado no aparelho. */
  carregando: boolean;
  sessao: Sessao | null;
  token: string | null;
  assinante: boolean;
  entrar: (identificador: string, senha: string) => Promise<void>;
  /** Troca o usuário da sessão sem ir ao servidor de novo. */
  aplicarUsuario: (usuario: Usuario) => void;
  sair: () => Promise<void>;
  atualizarSessao: () => Promise<void>;
};

const Contexto = createContext<ValorContexto | null>(null);

export function useSessao() {
  const valor = useContext(Contexto);
  if (!valor) throw new Error('useSessao precisa estar dentro de <ProvedorSessao />');
  return valor;
}

export function ProvedorSessao({ children }: PropsWithChildren) {
  const [[lendoToken, token], definirToken] = useItemArmazenado('cc_token');
  const [sessao, definirSessao] = useState<Sessao | null>(null);
  const [validandoToken, definirValidando] = useState(false);

  // Com um token guardado, buscamos a sessão atual para saber
  // se a assinatura continua ativa.
  useEffect(() => {
    if (lendoToken) return;

    if (!token) {
      definirSessao(null);
      return;
    }

    let cancelado = false;
    definirValidando(true);

    api
      .sessaoAtual(token)
      .then((nova) => {
        if (!cancelado) definirSessao(nova);
      })
      .catch(() => {
        // Token inválido ou expirado: derruba a sessão.
        if (!cancelado) {
          definirSessao(null);
          definirToken(null);
        }
      })
      .finally(() => {
        if (!cancelado) definirValidando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [lendoToken, token, definirToken]);

  const entrar = useCallback(
    async (identificador: string, senha: string) => {
      const nova = await api.entrar(identificador, senha);
      definirSessao(nova);
      definirToken(nova.token);
    },
    [definirToken]
  );

  const aplicarUsuario = useCallback((usuario: Usuario) => {
    definirSessao((atual) => (atual ? { ...atual, usuario } : atual));
  }, []);

  const sair = useCallback(async () => {
    if (token) {
      try {
        await api.sair(token);
      } catch {
        // Se o servidor não responder, o logout local acontece do mesmo jeito.
      }
    }
    definirSessao(null);
    definirToken(null);
  }, [token, definirToken]);

  const atualizarSessao = useCallback(async () => {
    if (!token) return;
    try {
      definirSessao(await api.sessaoAtual(token));
    } catch (erro) {
      if (erro instanceof FalhaApi && erro.status === 401) {
        definirSessao(null);
        definirToken(null);
      }
    }
  }, [token, definirToken]);

  const valor = useMemo<ValorContexto>(
    () => ({
      carregando: lendoToken || validandoToken,
      sessao,
      token: token ?? null,
      assinante: !!sessao?.assinatura.ativa,
      entrar,
      aplicarUsuario,
      sair,
      atualizarSessao,
    }),
    [
      lendoToken,
      validandoToken,
      sessao,
      token,
      entrar,
      aplicarUsuario,
      sair,
      atualizarSessao,
    ]
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}
