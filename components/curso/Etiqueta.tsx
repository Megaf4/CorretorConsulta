import { StyleSheet, Text, View } from 'react-native';

import { Estrela } from '@/components/ui/Icones';
import { Cores, Espaco, Fonte, Raio } from '@/constants/theme';

type Props = {
  texto: string;
  tipo?: 'alta' | 'favorito';
};

/** Selo que sobra um pouco para fora do topo do card. */
export function Etiqueta({ texto, tipo = 'alta' }: Props) {
  const favorito = tipo === 'favorito';

  return (
    <View
      style={[
        estilos.base,
        { backgroundColor: favorito ? Cores.marinho : Cores.petroleo },
      ]}
    >
      {favorito ? <Estrela tamanho={10} /> : null}
      <Text style={estilos.texto}>{texto}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  base: {
    position: 'absolute',
    top: -9,
    left: Espaco.lg - 2,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.xs + 1,
    paddingVertical: Espaco.xs,
    paddingHorizontal: Espaco.sm + 1,
    borderRadius: Raio.sm - 1,
  },
  texto: {
    color: Cores.textoInverso,
    fontSize: Fonte.minuscula - 1.5,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
});
