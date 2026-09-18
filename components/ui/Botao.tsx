import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Cores, Espaco, Fonte, Raio } from '@/constants/theme';

type Props = {
  titulo: string;
  aoPressionar: () => void;
  variante?: 'primario' | 'secundario' | 'texto';
  carregando?: boolean;
  desabilitado?: boolean;
  /** Sobrescreve a cor de fundo: usado nos cards de curso, na cor da operadora. */
  cor?: string;
  estilo?: StyleProp<ViewStyle>;
};

export function Botao({
  titulo,
  aoPressionar,
  variante = 'primario',
  carregando,
  desabilitado,
  cor,
  estilo,
}: Props) {
  const inativo = desabilitado || carregando;
  const primario = variante === 'primario';

  return (
    <Pressable
      onPress={aoPressionar}
      disabled={inativo}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inativo, busy: !!carregando }}
      style={({ pressed }) => [
        estilos.base,
        variante === 'primario' && estilos.primario,
        variante === 'secundario' && estilos.secundario,
        variante === 'texto' && estilos.texto,
        cor && primario ? { backgroundColor: cor } : null,
        pressed && !inativo && estilos.pressionado,
        inativo && estilos.inativo,
        estilo,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={primario ? Cores.textoInverso : Cores.marinho} />
      ) : (
        <Text
          style={[
            estilos.rotulo,
            variante === 'primario' && estilos.rotuloPrimario,
            variante === 'secundario' && estilos.rotuloSecundario,
            variante === 'texto' && estilos.rotuloTexto,
          ]}
        >
          {titulo}
        </Text>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: Raio.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Espaco.lg,
  },
  primario: {
    backgroundColor: Cores.marinho,
  },
  secundario: {
    backgroundColor: Cores.fundo,
    borderWidth: 1,
    borderColor: Cores.borda,
  },
  texto: {
    height: 44,
    backgroundColor: 'transparent',
  },
  pressionado: {
    opacity: 0.82,
  },
  inativo: {
    opacity: 0.5,
  },
  rotulo: {
    fontSize: Fonte.medio,
    fontWeight: '600',
  },
  rotuloPrimario: {
    color: Cores.textoInverso,
  },
  rotuloSecundario: {
    color: Cores.marinho,
  },
  rotuloTexto: {
    color: Cores.petroleo,
    fontWeight: '500',
  },
});
