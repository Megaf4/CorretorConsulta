import { StyleSheet, View } from 'react-native';

import { Cores } from '@/constants/theme';

type Props = {
  /** 0 a 100 */
  valor: number;
  cor?: string;
  altura?: number;
};

export function BarraProgresso({ valor, cor = Cores.petroleo, altura = 5 }: Props) {
  const largura = `${Math.max(0, Math.min(100, valor))}%` as const;

  return (
    <View
      style={[estilos.trilho, { height: altura, borderRadius: altura }]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(valor) }}
    >
      <View style={{ width: largura, height: '100%', borderRadius: altura, backgroundColor: cor }} />
    </View>
  );
}

const estilos = StyleSheet.create({
  trilho: {
    width: '100%',
    backgroundColor: '#EDF0F5',
    overflow: 'hidden',
  },
});
