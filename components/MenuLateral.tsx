import { router } from 'expo-router';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FotoPerfil } from './ui/FotoPerfil';
import { Seta } from './ui/Icones';
import { Cores, Espaco, Fonte, Raio } from '@/constants/theme';
import { useSessao } from '@/lib/sessao';

type Item = {
  rotulo: string;
  destino: string;
};

const EXPLORAR: Item[] = [
  { rotulo: 'Início', destino: '/' },
  { rotulo: 'Meus cursos', destino: '/meus-cursos' },
  { rotulo: 'Biblioteca', destino: '/biblioteca' },
];

const INSTITUCIONAL: Item[] = [
  { rotulo: 'Planos', destino: '/planos' },
  { rotulo: 'FAQ e suporte', destino: '/faq' },
  { rotulo: 'Contato', destino: '/contato' },
];

type Props = {
  visivel: boolean;
  aoFechar: () => void;
  /** Rota da tela atual, para marcar o item selecionado. */
  atual?: string;
};

/**
 * Menu que abre por cima do conteúdo.
 * Feito como Modal em vez de rota própria para a tela de trás continuar ali,
 * igual ao desenho aprovado.
 */
export function MenuLateral({ visivel, aoFechar, atual = '/' }: Props) {
  const { sessao, assinante } = useSessao();
  const { top, bottom } = useSafeAreaInsets();

  function ir(item: Item) {
    aoFechar();
    if (item.destino === atual) return;
    router.replace(item.destino as never);
  }

  function renderGrupo(titulo: string, itens: Item[]) {
    return (
      <View style={estilos.grupo}>
        <Text style={estilos.grupoTitulo}>{titulo}</Text>
        {itens.map((item) => {
          const selecionado = item.destino === atual;
          return (
            <Pressable
              key={item.rotulo}
              onPress={() => ir(item)}
              accessibilityRole="button"
              accessibilityState={{ selected: selecionado }}
              style={[estilos.item, selecionado && estilos.itemSelecionado]}
            >
              <Text
                style={[estilos.itemTexto, selecionado && estilos.itemTextoSelecionado]}
              >
                {item.rotulo}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      onRequestClose={aoFechar}
      statusBarTranslucent
    >
      <Pressable style={estilos.fundo} onPress={aoFechar}>
        <Pressable style={estilos.gaveta} onPress={(e) => e.stopPropagation()}>
          {/* Conta */}
          <Pressable
            style={[estilos.conta, { paddingTop: top + Espaco.xl }]}
            accessibilityRole="button"
            onPress={() => {
              aoFechar();
              router.push('/perfil');
            }}
          >
            <FotoPerfil nome={sessao?.usuario.nome} foto={sessao?.usuario.foto} tamanho={42} />
            <View style={estilos.contaTexto}>
              <Text style={estilos.contaNome} numberOfLines={1}>
                {sessao?.usuario.nome}
              </Text>
              <Text style={estilos.contaStatus}>
                {assinante ? 'Assinatura ativa' : 'Modo visualização'}
              </Text>
            </View>
            <Seta tamanho={14} cor="#9FB0CC" />
          </Pressable>

          <ScrollView showsVerticalScrollIndicator={false}>
            {renderGrupo('EXPLORAR', EXPLORAR)}
            <View style={estilos.divisor} />
            {renderGrupo('INSTITUCIONAL', INSTITUCIONAL)}
          </ScrollView>

          <View style={[estilos.rodape, { paddingBottom: bottom + Espaco.lg }]}>
            <Pressable
              style={estilos.item}
              accessibilityRole="button"
              onPress={() => {
                aoFechar();
                router.push('/perfil');
              }}
            >
              <Text style={estilos.itemTexto}>Minha conta</Text>
            </Pressable>
            <Text style={estilos.copyright}>
              Corretor Consulta © 2026 Todos os direitos reservados.
            </Text>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: 'rgba(18, 26, 44, 0.55)',
    flexDirection: 'row',
  },
  gaveta: {
    width: '80%',
    maxWidth: 320,
    backgroundColor: Cores.fundo,
  },
  conta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.md,
    paddingHorizontal: Espaco.lg + 2,
    paddingBottom: Espaco.xl,
    backgroundColor: Cores.marinho,
  },
  contaTexto: { flex: 1 },
  contaNome: {
    color: Cores.textoInverso,
    fontSize: Fonte.corpo + 0.5,
    fontWeight: '700',
  },
  contaStatus: {
    color: '#9FB0CC',
    fontSize: Fonte.minuscula + 0.5,
    marginTop: 2,
  },
  grupo: {
    paddingHorizontal: Espaco.md + 2,
    paddingTop: Espaco.lg + 2,
  },
  grupoTitulo: {
    fontSize: Fonte.minuscula - 0.5,
    letterSpacing: 1.2,
    fontWeight: '700',
    color: Cores.textoApagado,
    paddingHorizontal: Espaco.md,
    marginBottom: Espaco.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: Espaco.md,
    borderRadius: Raio.md,
  },
  itemSelecionado: {
    backgroundColor: Cores.marinho,
  },
  itemTexto: {
    fontSize: Fonte.corpo,
    fontWeight: '600',
    color: '#2C3A52',
  },
  itemTextoSelecionado: {
    color: Cores.textoInverso,
    fontWeight: '700',
  },
  divisor: {
    height: 1,
    backgroundColor: Cores.bordaSuave,
    marginHorizontal: Espaco.xl,
    marginTop: Espaco.lg,
  },
  rodape: {
    borderTopWidth: 1,
    borderTopColor: Cores.bordaSuave,
    paddingHorizontal: Espaco.md + 2,
    paddingTop: Espaco.md,
  },
  copyright: {
    fontSize: Fonte.minuscula - 1.5,
    color: Cores.placeholder,
    textAlign: 'center',
    marginTop: Espaco.md,
  },
});
