import { StyleSheet, Text, View } from 'react-native';

import { Cores } from '@/constants/theme';

/**
 * Ícones desenhados com View e borda.
 * Evita depender de react-native-svg ou de pacote de ícones só por causa
 * de meia dúzia de formas simples.
 */

type IconeProps = { tamanho?: number; cor?: string };

export function Play({ tamanho = 14, cor = Cores.textoInverso }: IconeProps) {
  return (
    <View
      style={{
        width: 0,
        height: 0,
        marginLeft: tamanho * 0.18,
        borderTopWidth: tamanho * 0.5,
        borderBottomWidth: tamanho * 0.5,
        borderLeftWidth: tamanho * 0.8,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: cor,
      }}
    />
  );
}

export function CirculoPlay({ tamanho = 34, cor = Cores.textoInverso }: IconeProps) {
  return (
    <View
      style={[
        estilos.centro,
        {
          width: tamanho,
          height: tamanho,
          borderRadius: tamanho / 2,
          borderWidth: 2,
          borderColor: cor,
        },
      ]}
    >
      <Play tamanho={tamanho * 0.4} cor={cor} />
    </View>
  );
}

export function Seta({
  tamanho = 14,
  cor = Cores.textoInverso,
  direcao = 'direita',
}: IconeProps & { direcao?: 'direita' | 'esquerda' }) {
  const sinal = direcao === 'direita' ? 1 : -1;
  const traco = {
    position: 'absolute' as const,
    width: tamanho * 0.62,
    height: 2.2,
    borderRadius: 2,
    backgroundColor: cor,
  };
  return (
    <View style={{ width: tamanho, height: tamanho, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={[
          traco,
          { transform: [{ translateY: -tamanho * 0.19 }, { rotate: `${sinal * 45}deg` }] },
        ]}
      />
      <View
        style={[
          traco,
          { transform: [{ translateY: tamanho * 0.19 }, { rotate: `${-sinal * 45}deg` }] },
        ]}
      />
    </View>
  );
}

export function Lupa({ tamanho = 17, cor = Cores.placeholder }: IconeProps) {
  return (
    <View style={{ width: tamanho, height: tamanho }}>
      <View
        style={{
          width: tamanho * 0.72,
          height: tamanho * 0.72,
          borderRadius: tamanho,
          borderWidth: 1.8,
          borderColor: cor,
        }}
      />
      <View
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: tamanho * 0.36,
          height: 1.8,
          borderRadius: 2,
          backgroundColor: cor,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </View>
  );
}

export function Relogio({ tamanho = 13, cor = Cores.textoApagado }: IconeProps) {
  return (
    <View
      style={[
        estilos.centro,
        { width: tamanho, height: tamanho, borderRadius: tamanho / 2, borderWidth: 1.5, borderColor: cor },
      ]}
    >
      <View
        style={{
          position: 'absolute',
          width: 1.4,
          height: tamanho * 0.28,
          backgroundColor: cor,
          top: tamanho * 0.18,
          left: tamanho / 2 - 0.9,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: tamanho * 0.24,
          height: 1.4,
          backgroundColor: cor,
          top: tamanho / 2 - 0.9,
          left: tamanho / 2 - 0.7,
        }}
      />
    </View>
  );
}

export function Estrela({ tamanho = 11, cor = Cores.textoInverso }: IconeProps) {
  return <Text style={{ fontSize: tamanho, color: cor, lineHeight: tamanho * 1.2 }}>★</Text>;
}

export function Hamburguer({ cor = Cores.textoInverso }: { cor?: string }) {
  return (
    <View style={{ width: 20, gap: 4 }}>
      <View style={[estilos.tracoMenu, { backgroundColor: cor }]} />
      <View style={[estilos.tracoMenu, { backgroundColor: cor, width: 14 }]} />
      <View style={[estilos.tracoMenu, { backgroundColor: cor }]} />
    </View>
  );
}

const estilos = StyleSheet.create({
  centro: { alignItems: 'center', justifyContent: 'center' },
  tracoMenu: { height: 2, borderRadius: 2, width: 20 },
});

export function Pasta({ tamanho = 26, cor = Cores.petroleo }: IconeProps) {
  return (
    <View style={{ width: tamanho, height: tamanho * 0.8 }}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: tamanho * 0.45,
          height: tamanho * 0.22,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          borderWidth: 1.7,
          borderBottomWidth: 0,
          borderColor: cor,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: tamanho,
          height: tamanho * 0.66,
          borderRadius: 4,
          borderWidth: 1.7,
          borderColor: cor,
        }}
      />
    </View>
  );
}

export function Arquivo({ tamanho = 17, cor = Cores.petroleo }: IconeProps) {
  return (
    <View
      style={{
        width: tamanho * 0.78,
        height: tamanho,
        borderWidth: 1.6,
        borderColor: cor,
        borderRadius: 2.5,
      }}
    >
      <View
        style={{
          position: 'absolute',
          top: -1.6,
          right: -1.6,
          width: tamanho * 0.3,
          height: tamanho * 0.3,
          backgroundColor: Cores.fundo,
          borderLeftWidth: 1.6,
          borderBottomWidth: 1.6,
          borderColor: cor,
        }}
      />
    </View>
  );
}

export function Baixar({ tamanho = 18, cor = Cores.textoSecundario }: IconeProps) {
  return (
    <View style={{ width: tamanho, height: tamanho, alignItems: 'center' }}>
      <View
        style={{
          width: 1.8,
          height: tamanho * 0.5,
          backgroundColor: cor,
          borderRadius: 2,
          marginTop: 1,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: tamanho * 0.34,
          width: tamanho * 0.42,
          height: tamanho * 0.42,
          borderRightWidth: 1.8,
          borderBottomWidth: 1.8,
          borderColor: cor,
          transform: [{ rotate: '45deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: tamanho * 0.86,
          height: 1.8,
          backgroundColor: cor,
          borderRadius: 2,
        }}
      />
    </View>
  );
}

export function AbrirFora({ tamanho = 18, cor = Cores.textoSecundario }: IconeProps) {
  return (
    <View style={{ width: tamanho, height: tamanho }}>
      <View
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: tamanho * 0.74,
          height: tamanho * 0.74,
          borderWidth: 1.8,
          borderColor: cor,
          borderRadius: 3,
        }}
      />
      <View
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: tamanho * 0.5,
          height: tamanho * 0.5,
          borderTopWidth: 1.8,
          borderRightWidth: 1.8,
          borderColor: cor,
          backgroundColor: Cores.fundo,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: tamanho * 0.22,
          right: tamanho * 0.16,
          width: tamanho * 0.5,
          height: 1.8,
          backgroundColor: cor,
          transform: [{ rotate: '-45deg' }],
        }}
      />
    </View>
  );
}
