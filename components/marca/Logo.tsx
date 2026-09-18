import { Image, type ImageStyle, type StyleProp } from 'react-native';

/**
 * Logo oficial do Corretor Consulta (marca + assinatura).
 * O arquivo fica em assets/images/logo.png, com fundo transparente.
 * Trocar a marca é trocar esse PNG, nada mais.
 */

// Proporção do arquivo: 900 x 1149
const PROPORCAO = 900 / 1149;

type Props = {
  /** Largura em pontos. A altura é calculada pela proporção. */
  largura?: number;
  estilo?: StyleProp<ImageStyle>;
};

export function Logo({ largura = 170, estilo }: Props) {
  return (
    <Image
      source={require('@/assets/images/logo.png')}
      style={[{ width: largura, height: largura / PROPORCAO }, estilo]}
      resizeMode="contain"
      accessibilityRole="image"
      accessibilityLabel="Corretor Consulta, seu guia pós-venda"
    />
  );
}
