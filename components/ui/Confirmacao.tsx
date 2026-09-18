import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Botao } from './Botao';
import { Cores, Espaco, Fonte, Raio } from '@/constants/theme';

type Props = {
  visivel: boolean;
  titulo: string;
  mensagem: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  /** Deixa o botão de confirmar vermelho, para ações como sair da conta. */
  destrutivo?: boolean;
  aoConfirmar: () => void;
  aoCancelar: () => void;
};

/**
 * Diálogo de confirmação do app.
 * Feito com Modal em vez de Alert.alert porque o Alert não existe
 * na versão web do React Native.
 */
export function Confirmacao({
  visivel,
  titulo,
  mensagem,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  destrutivo,
  aoConfirmar,
  aoCancelar,
}: Props) {
  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      onRequestClose={aoCancelar}
      statusBarTranslucent
    >
      <Pressable style={estilos.fundo} onPress={aoCancelar}>
        <Pressable style={estilos.caixa} onPress={(e) => e.stopPropagation()}>
          <Text style={estilos.titulo}>{titulo}</Text>
          <Text style={estilos.mensagem}>{mensagem}</Text>

          <Botao
            titulo={textoConfirmar}
            aoPressionar={aoConfirmar}
            cor={destrutivo ? Cores.erro : undefined}
            estilo={estilos.botao}
          />
          <Botao
            titulo={textoCancelar}
            variante="texto"
            aoPressionar={aoCancelar}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: 'rgba(18, 26, 44, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Espaco.xl,
  },
  caixa: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: Cores.fundo,
    borderRadius: Raio.xl,
    padding: Espaco.xl,
  },
  titulo: {
    fontSize: Fonte.grande - 1,
    fontWeight: '700',
    color: Cores.texto,
  },
  mensagem: {
    fontSize: Fonte.corpo,
    color: Cores.textoSecundario,
    lineHeight: 21,
    marginTop: Espaco.sm + 2,
    marginBottom: Espaco.xl,
  },
  botao: {
    marginBottom: Espaco.xs,
  },
});
