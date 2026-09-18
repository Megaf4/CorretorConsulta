import { StyleSheet, Text, View } from 'react-native';

import { Cores, Espaco, Fonte } from '@/constants/theme';

/** Título de seção em caixa alta, como nas telas de perfil e biblioteca. */
export function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <View style={estilos.bloco}>
      <Text style={estilos.titulo}>{titulo}</Text>
      {children}
    </View>
  );
}

const estilos = StyleSheet.create({
  bloco: {
    marginTop: Espaco.xl,
  },
  titulo: {
    fontSize: Fonte.minuscula - 0.5,
    letterSpacing: 1.2,
    fontWeight: '700',
    color: Cores.textoApagado,
    marginBottom: Espaco.md,
  },
});
