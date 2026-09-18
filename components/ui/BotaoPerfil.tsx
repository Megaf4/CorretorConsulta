import { router } from 'expo-router';
import { Pressable } from 'react-native';

import { FotoPerfil } from './FotoPerfil';
import { useSessao } from '@/lib/sessao';

/** Avatar do canto direito do cabeçalho. Leva para o perfil. */
export function BotaoPerfil({ tamanho = 36 }: { tamanho?: number }) {
  const { sessao } = useSessao();

  return (
    <Pressable
      onPress={() => router.push('/perfil')}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Meu perfil"
    >
      <FotoPerfil nome={sessao?.usuario.nome} foto={sessao?.usuario.foto} tamanho={tamanho} />
    </Pressable>
  );
}
