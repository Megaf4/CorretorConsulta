import { StyleSheet, Text, View } from 'react-native';

import { Cores, Espaco, Fonte } from '@/constants/theme';

/** Aviso de copyright que aparece no fim de todas as telas. */
export function Rodape() {
  return (
    <View style={estilos.container}>
      <Text style={estilos.texto}>
        Corretor Consulta © 2026 Todos os direitos reservados.
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    paddingTop: Espaco.xl,
    paddingBottom: Espaco.lg,
    alignItems: 'center',
  },
  texto: {
    fontSize: Fonte.minuscula - 1,
    color: Cores.placeholder,
    textAlign: 'center',
  },
});
