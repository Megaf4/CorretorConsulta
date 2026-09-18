import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Cores, Espaco, Fonte } from '@/constants/theme';

export default function TelaNaoEncontrada() {
  return (
    <>
      <Stack.Screen options={{ title: 'Ops!' }} />
      <View style={estilos.container}>
        <Text style={estilos.titulo}>Esta tela não existe.</Text>
        <Link href="/" style={estilos.link}>
          <Text style={estilos.linkTexto}>Voltar para o início</Text>
        </Link>
      </View>
    </>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Espaco.xl,
    backgroundColor: Cores.fundo,
  },
  titulo: { fontSize: Fonte.grande, fontWeight: '700', color: Cores.texto },
  link: { marginTop: Espaco.lg, paddingVertical: Espaco.lg },
  linkTexto: { fontSize: Fonte.corpo, color: Cores.petroleo, fontWeight: '600' },
});
