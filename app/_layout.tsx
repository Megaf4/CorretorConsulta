import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { ControladorSplash } from '@/components/ControladorSplash';
import { ProvedorSessao, useSessao } from '@/lib/sessao';

export {
  // Deixa o Expo Router capturar erros na árvore de navegação.
  ErrorBoundary,
} from 'expo-router';

export default function LayoutRaiz() {
  const [fontesCarregadas, erroFontes] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (erroFontes) throw erroFontes;
  }, [erroFontes]);

  if (!fontesCarregadas) return null;

  return (
    <ProvedorSessao>
      <ControladorSplash />
      <Navegacao />
    </ProvedorSessao>
  );
}

/**
 * Guarda de rotas.
 * Com sessão, só o grupo (app) existe. Sem sessão, só a tela de login.
 * Ninguém chega numa tela protegida por deep link.
 */
function Navegacao() {
  const { sessao } = useSessao();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!sessao}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>

      <Stack.Protected guard={!sessao}>
        <Stack.Screen name="entrar" />
      </Stack.Protected>
    </Stack>
  );
}
