import { StyleSheet, TextInput, View } from 'react-native';

import { Lupa } from './Icones';
import { Cores, Espaco, Fonte, Raio } from '@/constants/theme';

type Props = {
  valor: string;
  aoMudar: (texto: string) => void;
  dica?: string;
};

export function Busca({ valor, aoMudar, dica = 'Pesquisar cursos e aulas' }: Props) {
  return (
    <View style={estilos.caixa}>
      <Lupa />
      <TextInput
        style={estilos.entrada}
        value={valor}
        onChangeText={aoMudar}
        placeholder={dica}
        placeholderTextColor={Cores.placeholder}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="while-editing"
        accessibilityLabel={dica}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.md - 2,
    height: 48,
    paddingHorizontal: Espaco.lg - 2,
    borderWidth: 1,
    borderColor: Cores.borda,
    borderRadius: Raio.md + 1,
    backgroundColor: Cores.fundo,
  },
  entrada: {
    flex: 1,
    fontSize: Fonte.corpo,
    color: Cores.texto,
    padding: 0,
  },
});
