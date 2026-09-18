import { SplashScreen } from 'expo-router';

import { useSessao } from '@/lib/sessao';

SplashScreen.preventAutoHideAsync();

/**
 * Segura a splash nativa até sabermos se a pessoa já está logada.
 * Evita a piscada da tela de login para quem já tem sessão salva.
 */
export function ControladorSplash() {
  const { carregando } = useSessao();

  if (!carregando) {
    SplashScreen.hide();
  }

  return null;
}
