import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { CirculoPlay } from '@/components/ui/Icones';
import { Cores, Espaco, Fonte, Raio } from '@/constants/theme';

type Props = {
  cor: string;
  sigla?: string;
  tamanho?: number;
  /** Usa a proporção de vídeo em vez de quadrado. */
  larga?: boolean;
  estilo?: StyleProp<ViewStyle>;
};

/**
 * Bloco colorido que faz as vezes da capa do curso.
 * Quando houver thumbnail de verdade vinda do player, é só trocar
 * o fundo por um <Image /> aqui dentro.
 */
export function CapaCurso({ cor, sigla, tamanho = 104, larga, estilo }: Props) {
  return (
    <View
      style={[
        estilos.capa,
        larga
          ? { width: '100%', aspectRatio: 16 / 9 }
          : { width: tamanho, height: tamanho },
        { backgroundColor: cor },
        estilo,
      ]}
    >
      <CirculoPlay tamanho={larga ? 52 : 34} />
      {sigla ? <Text style={estilos.sigla}>{sigla}</Text> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  capa: {
    borderRadius: Raio.lg - 3,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  sigla: {
    position: 'absolute',
    left: Espaco.sm + 1,
    bottom: Espaco.sm,
    color: Cores.textoInverso,
    fontSize: Fonte.minuscula + 0.5,
    fontWeight: '700',
    letterSpacing: 0.4,
    opacity: 0.92,
  },
});
