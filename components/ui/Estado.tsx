import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Aviso } from './Aviso';
import { Cores, Espaco, Fonte } from '@/constants/theme';

/** Spinner centralizado enquanto a tela carrega. */
export function Carregando() {
  return (
    <View style={estilos.carregando}>
      <ActivityIndicator color={Cores.petroleo} />
    </View>
  );
}

/** Mensagem de erro com a opção de tentar de novo. */
export function ErroDaTela({ texto, aoTentar }: { texto: string; aoTentar?: () => void }) {
  return (
    <View style={estilos.erro}>
      <Aviso texto={texto} tom="erro" />
      {aoTentar ? (
        <Pressable onPress={aoTentar} accessibilityRole="button">
          <Text style={estilos.tentar}>Tentar de novo</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/** Estado vazio: sem favoritos, sem cursos em andamento, busca sem resultado. */
export function Vazio({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <View style={estilos.vazio}>
      <Text style={estilos.vazioTitulo}>{titulo}</Text>
      <Text style={estilos.vazioTexto}>{texto}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  carregando: { paddingVertical: Espaco.xxxl },
  erro: { paddingHorizontal: Espaco.lg, paddingTop: Espaco.lg },
  tentar: { fontSize: Fonte.corpo, fontWeight: '700', color: Cores.petroleo },
  vazio: {
    alignItems: 'center',
    paddingHorizontal: Espaco.xl,
    paddingVertical: Espaco.xxl,
  },
  vazioTitulo: {
    fontSize: Fonte.medio,
    fontWeight: '700',
    color: Cores.texto,
    textAlign: 'center',
  },
  vazioTexto: {
    fontSize: Fonte.corpo - 0.5,
    color: Cores.textoApagado,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: Espaco.sm,
  },
});
