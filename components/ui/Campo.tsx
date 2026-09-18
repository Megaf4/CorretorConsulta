import { forwardRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { Cores, Espaco, Fonte, Raio } from '@/constants/theme';

type Props = TextInputProps & {
  rotulo: string;
  erro?: string | null;
  dica?: string;
  /** Mostra o olho para revelar a senha. */
  senha?: boolean;
  /** Cadeado e fundo cinza, para campos que não podem ser editados. */
  bloqueado?: boolean;
};

/**
 * Campo de formulário padrão do app: rótulo, caixa, erro e dica.
 * Usado no login e reaproveitado no cadastro e no perfil.
 */
export const Campo = forwardRef<TextInput, Props>(function Campo(
  { rotulo, erro, dica, senha, bloqueado, style, ...props },
  ref
) {
  const [visivel, definirVisivel] = useState(false);
  const [focado, definirFocado] = useState(false);

  return (
    <View style={estilos.container}>
      <Text style={estilos.rotulo}>{rotulo}</Text>

      <View
        style={[
          estilos.caixa,
          focado && estilos.caixaFocada,
          !!erro && estilos.caixaErro,
          bloqueado && estilos.caixaBloqueada,
        ]}
      >
        <TextInput
          ref={ref}
          style={[estilos.entrada, bloqueado && estilos.entradaBloqueada, style]}
          placeholderTextColor={Cores.placeholder}
          secureTextEntry={senha && !visivel}
          editable={!bloqueado}
          onFocus={(e) => {
            definirFocado(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            definirFocado(false);
            props.onBlur?.(e);
          }}
          {...props}
        />

        {senha ? (
          <Pressable
            onPress={() => definirVisivel((v) => !v)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={visivel ? 'Ocultar senha' : 'Mostrar senha'}
          >
            <Olho aberto={visivel} />
          </Pressable>
        ) : null}

        {bloqueado ? <Cadeado /> : null}
      </View>

      {erro ? <Text style={estilos.erro}>{erro}</Text> : null}
      {dica && !erro ? <Text style={estilos.dica}>{dica}</Text> : null}
    </View>
  );
});

/* Ícones desenhados com View para não depender de biblioteca de SVG. */

function Olho({ aberto }: { aberto: boolean }) {
  return (
    <View style={estilos.icone}>
      <View style={estilos.olhoFora}>
        <View style={estilos.olhoDentro} />
      </View>
      {!aberto ? <View style={estilos.olhoRiscado} /> : null}
    </View>
  );
}

function Cadeado() {
  return (
    <View style={estilos.icone}>
      <View style={estilos.cadeadoArco} />
      <View style={estilos.cadeadoCorpo} />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    marginBottom: Espaco.lg,
  },
  rotulo: {
    fontSize: Fonte.pequena,
    color: Cores.textoSecundario,
    marginBottom: Espaco.sm - 2,
    fontWeight: '500',
  },
  caixa: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: Espaco.lg - 2,
    borderWidth: 1,
    borderColor: Cores.borda,
    borderRadius: Raio.md,
    backgroundColor: Cores.fundo,
    gap: Espaco.sm,
  },
  caixaFocada: {
    borderColor: Cores.marinho,
  },
  caixaErro: {
    borderColor: Cores.erro,
  },
  caixaBloqueada: {
    backgroundColor: Cores.fundoSuave,
    borderColor: Cores.bordaSuave,
  },
  entrada: {
    flex: 1,
    fontSize: Fonte.medio,
    color: Cores.texto,
    padding: 0,
  },
  entradaBloqueada: {
    color: Cores.textoApagado,
  },
  erro: {
    marginTop: Espaco.sm - 2,
    fontSize: Fonte.pequena,
    color: Cores.erro,
    fontWeight: '500',
  },
  dica: {
    marginTop: Espaco.sm - 2,
    fontSize: Fonte.minuscula,
    color: Cores.placeholder,
  },

  icone: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  olhoFora: {
    width: 20,
    height: 13,
    borderWidth: 1.6,
    borderColor: Cores.placeholder,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  olhoDentro: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Cores.placeholder,
  },
  olhoRiscado: {
    position: 'absolute',
    width: 24,
    height: 1.6,
    backgroundColor: Cores.placeholder,
    transform: [{ rotate: '-45deg' }],
  },
  cadeadoArco: {
    width: 10,
    height: 7,
    borderWidth: 1.6,
    borderBottomWidth: 0,
    borderColor: Cores.placeholder,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginBottom: -1,
  },
  cadeadoCorpo: {
    width: 15,
    height: 10,
    borderWidth: 1.6,
    borderColor: Cores.placeholder,
    borderRadius: 2.5,
  },
});
