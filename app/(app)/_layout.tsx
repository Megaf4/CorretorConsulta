import { Stack } from 'expo-router';

/**
 * Pilha das telas que exigem login.
 * As próximas telas do app entram aqui:
 *   inicio.tsx, cursos/[operadora].tsx, meus-cursos.tsx,
 *   biblioteca/…, perfil.tsx, planos.tsx, faq.tsx, contato.tsx
 */
export default function LayoutApp() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
