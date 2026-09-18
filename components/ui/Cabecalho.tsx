import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Hamburguer, Seta } from './Icones';
import { Cores, Espaco, Fonte } from '@/constants/theme';

type Props = {
  /** Texto do título. Ignorado quando marca é true. */
  titulo?: string;
  /** Mostra "corretor consulta" no lugar do título. */
  marca?: boolean;
  /** Mostra a seta de voltar. */
  voltar?: boolean;
  /** Para onde voltar. Sem isso, volta uma tela na pilha. */
  destinoVoltar?: string;
  /** Mostra o botão de menu no lugar da seta. */
  aoAbrirMenu?: () => void;
  /** Conteúdo encostado na direita, tipo o avatar da conta. */
  direita?: React.ReactNode;
};

/** Faixa azul-marinho do topo, usada em todas as telas internas. */
export function Cabecalho({
  titulo,
  marca,
  voltar,
  destinoVoltar,
  aoAbrirMenu,
  direita,
}: Props) {
  const { top } = useSafeAreaInsets();

  function aoVoltar() {
    if (destinoVoltar) router.replace(destinoVoltar as never);
    else if (router.canGoBack()) router.back();
  }

  return (
    <View style={[estilos.faixa, { paddingTop: top + Espaco.md }]}>
      {aoAbrirMenu ? (
        <Pressable
          onPress={aoAbrirMenu}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Abrir menu"
        >
          <Hamburguer />
        </Pressable>
      ) : null}

      {voltar && !aoAbrirMenu ? (
        <Pressable
          onPress={aoVoltar}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Seta direcao="esquerda" tamanho={16} />
        </Pressable>
      ) : null}

      {marca ? (
        <Text style={estilos.marca}>
          corretor<Text style={estilos.marcaLeve}> consulta</Text>
        </Text>
      ) : (
        <Text style={estilos.titulo} numberOfLines={1}>
          {titulo}
        </Text>
      )}

      <View style={estilos.espaco} />
      {direita}
    </View>
  );
}

const estilos = StyleSheet.create({
  faixa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.md,
    paddingHorizontal: Espaco.lg + 2,
    paddingBottom: Espaco.lg,
    backgroundColor: Cores.marinho,
  },
  titulo: {
    fontSize: Fonte.grande - 2,
    fontWeight: '700',
    color: Cores.textoInverso,
    flexShrink: 1,
  },
  marca: {
    fontSize: Fonte.grande - 2,
    fontWeight: '700',
    color: Cores.textoInverso,
    letterSpacing: -0.3,
  },
  marcaLeve: {
    fontWeight: '400',
    color: '#8FC3E4',
  },
  espaco: {
    flex: 1,
  },
});
