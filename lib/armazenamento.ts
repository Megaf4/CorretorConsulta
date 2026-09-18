import { useCallback, useEffect, useReducer } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Guarda valores pequenos e sensíveis (token de sessão).
 * No celular usa o cofre do sistema (SecureStore);
 * na web cai para o localStorage, porque SecureStore não existe lá.
 *
 * Baseado no guia oficial de autenticação do Expo Router.
 */

type EstadoHook<T> = [[boolean, T | null], (valor: T | null) => void];

function useEstadoAssincrono<T>(
  inicial: [boolean, T | null] = [true, null]
): EstadoHook<T> {
  return useReducer(
    (_estado: [boolean, T | null], acao: T | null = null): [boolean, T | null] => [
      false,
      acao,
    ],
    inicial
  ) as EstadoHook<T>;
}

export async function gravarItem(chave: string, valor: string | null) {
  if (Platform.OS === 'web') {
    try {
      if (valor === null) localStorage.removeItem(chave);
      else localStorage.setItem(chave, valor);
    } catch (erro) {
      console.error('Armazenamento local indisponível:', erro);
    }
    return;
  }

  if (valor === null) await SecureStore.deleteItemAsync(chave);
  else await SecureStore.setItemAsync(chave, valor);
}

export async function lerItem(chave: string) {
  if (Platform.OS === 'web') {
    try {
      return typeof localStorage !== 'undefined' ? localStorage.getItem(chave) : null;
    } catch {
      return null;
    }
  }
  return SecureStore.getItemAsync(chave);
}

/** [[carregando, valor], definirValor] */
export function useItemArmazenado(chave: string): EstadoHook<string> {
  const [estado, definirEstado] = useEstadoAssincrono<string>();

  useEffect(() => {
    lerItem(chave)
      .then((valor) => definirEstado(valor))
      .catch(() => definirEstado(null));
  }, [chave]);

  const definirValor = useCallback(
    (valor: string | null) => {
      definirEstado(valor);
      void gravarItem(chave, valor);
    },
    [chave]
  );

  return [estado, definirValor];
}
