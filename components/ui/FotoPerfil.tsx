import { Image, StyleSheet, Text, View } from 'react-native';

import { Cores, Fonte } from '@/constants/theme';

/** Iniciais do nome, usadas quando a pessoa não tem foto. */
export function iniciais(nome?: string | null) {
  return (nome || 'CC')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase();
}

type Props = {
  nome?: string | null;
  foto?: string | null;
  tamanho?: number;
  raio?: number;
};

export function FotoPerfil({ nome, foto, tamanho = 42, raio }: Props) {
  const borda = raio ?? tamanho * 0.3;

  return (
    <View
      style={[
        estilos.base,
        { width: tamanho, height: tamanho, borderRadius: borda },
      ]}
    >
      {foto ? (
        <Image
          source={{ uri: foto }}
          style={{ width: tamanho, height: tamanho, borderRadius: borda }}
          resizeMode="cover"
        />
      ) : (
        <Text style={[estilos.iniciais, { fontSize: tamanho * 0.34 }]}>
          {iniciais(nome)}
        </Text>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  base: {
    backgroundColor: Cores.petroleo,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iniciais: {
    color: Cores.textoInverso,
    fontWeight: '700',
  },
});
