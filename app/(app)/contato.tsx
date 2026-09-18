import { useCallback, useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { Aviso } from '@/components/ui/Aviso';
import { BotaoPerfil } from '@/components/ui/BotaoPerfil';
import { MenuLateral } from '@/components/MenuLateral';
import { Cabecalho } from '@/components/ui/Cabecalho';
import { Carregando, ErroDaTela } from '@/components/ui/Estado';
import { Relogio, Seta } from '@/components/ui/Icones';
import { Rodape } from '@/components/ui/Rodape';
import { Cores, Espaco, Fonte, Raio } from '@/constants/theme';
import { api, FalhaApi } from '@/lib/api';
import { useSessao } from '@/lib/sessao';
import type { CanalContato } from '@/lib/tipos';

export default function TelaContato() {
  const { token } = useSessao();

  const [canais, definirCanais] = useState<CanalContato[] | null>(null);
  const [erro, definirErro] = useState<string | null>(null);
  const [menuAberto, definirMenuAberto] = useState(false);
  const [recado, definirRecado] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    if (!token) return;
    try {
      definirErro(null);
      definirCanais(await api.contatos(token));
    } catch (e) {
      definirErro(e instanceof FalhaApi ? e.mensagem : 'Não foi possível carregar os contatos.');
    }
  }, [token]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  async function abrir(canal: CanalContato) {
    definirRecado(null);
    try {
      const pode = await Linking.canOpenURL(canal.url);
      if (pode) await Linking.openURL(canal.url);
      else definirRecado('Seu aparelho não tem um aplicativo para abrir esse canal.');
    } catch {
      definirRecado('Não foi possível abrir esse canal agora.');
    }
  }

  return (
    <SafeAreaView style={estilos.tela} edges={['bottom']}>
      <StatusBar style="light" />
      <Cabecalho titulo="Contato" aoAbrirMenu={() => definirMenuAberto(true)}
        direita={<BotaoPerfil />} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={estilos.topo}>
          <Text style={estilos.titulo}>Entre em contato</Text>
          <Text style={estilos.subtitulo}>
            Escolha o canal que preferir. Nosso time responde em horário comercial.
          </Text>
        </View>

        {erro ? <ErroDaTela texto={erro} aoTentar={carregar} /> : null}
        {!canais && !erro ? <Carregando /> : null}

        {recado ? (
          <View style={estilos.recado}>
            <Aviso texto={recado} tom="erro" />
          </View>
        ) : null}

        <View style={estilos.lista}>
          {canais?.map((canal) => (
            <Pressable
              key={canal.id}
              onPress={() => abrir(canal)}
              accessibilityRole="button"
              accessibilityLabel={`${canal.rotulo}: ${canal.valor}`}
              style={({ pressed }) => [estilos.cartao, pressed && estilos.pressionado]}
            >
              <View style={estilos.icone}>
                <IconeCanal tipo={canal.tipo} />
              </View>

              <View style={estilos.cartaoTexto}>
                <Text style={estilos.rotulo}>{canal.rotulo}</Text>
                <Text
                  style={[estilos.valor, canal.tipo === 'email' && estilos.valorLongo]}
                  numberOfLines={2}
                >
                  {canal.valor}
                </Text>
                {canal.detalhe ? <Text style={estilos.detalhe}>{canal.detalhe}</Text> : null}
              </View>

              <Seta cor="#B4BDCB" tamanho={16} />
            </Pressable>
          ))}
        </View>

        <View style={estilos.horario}>
          <Relogio tamanho={17} cor={Cores.textoSecundario} />
          <View style={estilos.horarioTexto}>
            <Text style={estilos.horarioTitulo}>Horário de atendimento</Text>
            <Text style={estilos.horarioDetalhe}>
              Segunda a sexta, das 9h às 18h. Fora desse horário, deixe a mensagem que
              respondemos no próximo dia útil.
            </Text>
          </View>
        </View>

        <Rodape />
      </ScrollView>

      <MenuLateral
        visivel={menuAberto}
        aoFechar={() => definirMenuAberto(false)}
        atual="/contato"
      />
    </SafeAreaView>
  );
}

/** Marca simples para cada canal, desenhada com View. */
function IconeCanal({ tipo }: { tipo: CanalContato['tipo'] }) {
  if (tipo === 'email') {
    return (
      <View style={estilos.envelope}>
        <View style={estilos.envelopeAba} />
      </View>
    );
  }
  if (tipo === 'telefone') {
    return (
      <View style={estilos.telefone}>
        <View style={estilos.telefoneBotao} />
      </View>
    );
  }
  if (tipo === 'whatsapp') {
    return (
      <View style={estilos.balao}>
        <View style={estilos.balaoBico} />
      </View>
    );
  }
  return (
    <View style={estilos.globo}>
      <View style={estilos.globoMeridiano} />
      <View style={estilos.globoEquador} />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: Cores.fundo },
  topo: { paddingHorizontal: Espaco.lg, paddingTop: Espaco.lg + 4 },
  titulo: { fontSize: Fonte.titulo + 1, fontWeight: '700', color: Cores.texto },
  subtitulo: {
    fontSize: Fonte.pequena + 0.5,
    color: Cores.textoApagado,
    marginTop: Espaco.sm - 1,
    lineHeight: 19,
  },
  recado: { paddingHorizontal: Espaco.lg, paddingTop: Espaco.lg },
  lista: { paddingHorizontal: Espaco.lg, paddingTop: Espaco.lg, gap: Espaco.md },
  cartao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.lg - 2,
    padding: Espaco.lg,
    borderWidth: 1,
    borderColor: Cores.bordaSuave,
    borderRadius: Raio.lg - 1,
  },
  pressionado: { backgroundColor: Cores.fundoSuave },
  icone: {
    width: 46,
    height: 46,
    borderRadius: Raio.md + 3,
    backgroundColor: '#EEF3F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartaoTexto: { flex: 1 },
  rotulo: {
    fontSize: Fonte.minuscula - 0.5,
    letterSpacing: 1,
    fontWeight: '700',
    color: Cores.textoApagado,
  },
  valor: {
    fontSize: Fonte.medio,
    fontWeight: '700',
    color: Cores.texto,
    marginTop: Espaco.xs,
    lineHeight: 20,
  },
  valorLongo: { fontSize: Fonte.corpo - 0.5, lineHeight: 18 },
  detalhe: { fontSize: Fonte.minuscula + 0.5, color: Cores.placeholder, marginTop: 3 },
  horario: {
    flexDirection: 'row',
    gap: Espaco.md - 1,
    marginHorizontal: Espaco.lg,
    marginTop: Espaco.xl,
    padding: Espaco.lg - 2,
    borderRadius: Raio.lg - 2,
    backgroundColor: Cores.fundoSuave,
  },
  horarioTexto: { flex: 1 },
  horarioTitulo: { fontSize: Fonte.pequena + 1, fontWeight: '700', color: Cores.texto },
  horarioDetalhe: {
    fontSize: Fonte.pequena,
    color: Cores.textoApagado,
    lineHeight: 18,
    marginTop: Espaco.xs,
  },

  envelope: {
    width: 22,
    height: 16,
    borderWidth: 1.8,
    borderColor: Cores.petroleo,
    borderRadius: 3,
    overflow: 'hidden',
    alignItems: 'center',
  },
  envelopeAba: {
    width: 14,
    height: 14,
    borderRightWidth: 1.8,
    borderBottomWidth: 1.8,
    borderColor: Cores.petroleo,
    transform: [{ rotate: '45deg' }, { translateY: -8 }],
  },
  telefone: {
    width: 15,
    height: 22,
    borderWidth: 1.8,
    borderColor: Cores.petroleo,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 2,
  },
  telefoneBotao: {
    width: 6,
    height: 1.6,
    borderRadius: 2,
    backgroundColor: Cores.petroleo,
  },
  balao: {
    width: 21,
    height: 17,
    borderWidth: 1.8,
    borderColor: Cores.petroleo,
    borderRadius: 8,
  },
  balaoBico: {
    position: 'absolute',
    bottom: -5,
    left: 3,
    width: 6,
    height: 6,
    borderLeftWidth: 1.8,
    borderBottomWidth: 1.8,
    borderColor: Cores.petroleo,
    transform: [{ rotate: '-45deg' }],
  },
  globo: {
    width: 21,
    height: 21,
    borderWidth: 1.8,
    borderColor: Cores.petroleo,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  globoMeridiano: {
    position: 'absolute',
    width: 9,
    height: 17.4,
    borderWidth: 1.4,
    borderColor: Cores.petroleo,
    borderRadius: 5,
  },
  globoEquador: {
    position: 'absolute',
    width: 17.4,
    height: 1.4,
    backgroundColor: Cores.petroleo,
  },
});
