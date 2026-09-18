import { StyleSheet, Text, View } from 'react-native';

import { Cores, Espaco, Fonte, Raio } from '@/constants/theme';

type Props = {
  texto: string;
  tom?: 'sucesso' | 'neutro';
};

/** Etiqueta pequena, tipo "Assinatura ativa". */
export function Selo({ texto, tom = 'neutro' }: Props) {
  const sucesso = tom === 'sucesso';
  return (
    <View
      style={[
        estilos.base,
        { backgroundColor: sucesso ? Cores.sucessoFundo : Cores.fundoSuave },
      ]}
    >
      <Text
        style={[
          estilos.texto,
          { color: sucesso ? Cores.sucesso : Cores.textoApagado },
        ]}
      >
        {texto}
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    paddingVertical: Espaco.xs + 1,
    paddingHorizontal: Espaco.sm + 1,
    borderRadius: Raio.sm,
  },
  texto: {
    fontSize: Fonte.minuscula - 0.5,
    fontWeight: '700',
  },
});
