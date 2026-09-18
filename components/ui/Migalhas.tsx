import { StyleSheet, Text } from 'react-native';

import { Cores, Fonte } from '@/constants/theme';

/** Caminho de navegação: Biblioteca › Bradesco Saúde › Apresentação. */
export function Migalhas({ itens }: { itens: string[] }) {
  return (
    <Text style={estilos.linha} numberOfLines={1}>
      {itens.map((item, i) => (
        <Text key={item} style={i === itens.length - 1 ? estilos.atual : undefined}>
          {i > 0 ? ' › ' : ''}
          {item}
        </Text>
      ))}
    </Text>
  );
}

const estilos = StyleSheet.create({
  linha: {
    fontSize: Fonte.pequena - 0.5,
    color: Cores.placeholder,
  },
  atual: {
    color: Cores.texto,
    fontWeight: '700',
  },
});
