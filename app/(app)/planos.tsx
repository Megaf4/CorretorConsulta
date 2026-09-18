import { useCallback, useEffect, useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { Aviso } from '@/components/ui/Aviso';
import { Botao } from '@/components/ui/Botao';
import { BotaoPerfil } from '@/components/ui/BotaoPerfil';
import { MenuLateral } from '@/components/MenuLateral';
import { Cabecalho } from '@/components/ui/Cabecalho';
import { Carregando, ErroDaTela } from '@/components/ui/Estado';
import { Rodape } from '@/components/ui/Rodape';
import { Cores, Espaco, Fonte, Raio } from '@/constants/theme';
import { api, FalhaApi } from '@/lib/api';
import { RECURSOS_PLANOS } from '@/lib/institucional-demo';
import { useSessao } from '@/lib/sessao';
import type { Plano } from '@/lib/tipos';

/** Onde a contratação acontece. O pagamento não roda dentro do app. */
const URL_CONTRATACAO = 'https://corretorconsulta.com.br/planos';

export default function TelaPlanos() {
  const { token, sessao, assinante } = useSessao();

  const [planos, definirPlanos] = useState<Plano[] | null>(null);
  const [erro, definirErro] = useState<string | null>(null);
  const [menuAberto, definirMenuAberto] = useState(false);
  const [recado, definirRecado] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    if (!token) return;
    try {
      definirErro(null);
      definirPlanos(await api.planos(token));
    } catch (e) {
      definirErro(e instanceof FalhaApi ? e.mensagem : 'Não foi possível carregar os planos.');
    }
  }, [token]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  async function contratar(plano: Plano) {
    const url = `${URL_CONTRATACAO}?plano=${plano.id}`;
    const pode = await Linking.canOpenURL(url);
    if (pode) await Linking.openURL(url);
    else definirRecado('Não foi possível abrir o site da contratação.');
  }

  return (
    <SafeAreaView style={estilos.tela} edges={['bottom']}>
      <StatusBar style="light" />
      <Cabecalho titulo="Planos" aoAbrirMenu={() => definirMenuAberto(true)}
        direita={<BotaoPerfil />} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={estilos.topo}>
          <Text style={estilos.titulo}>Planos Corretor Consulta</Text>
          <Text style={estilos.subtitulo}>
            Escolha o plano que melhor se encaixa na sua operação. Você pode fazer upgrade a
            qualquer momento.
          </Text>
        </View>

        {erro ? <ErroDaTela texto={erro} aoTentar={carregar} /> : null}
        {!planos && !erro ? <Carregando /> : null}

        {assinante && sessao?.assinatura.plano ? (
          <View style={estilos.atual}>
            <Aviso tom="sucesso" texto={`Seu plano atual é o ${sessao.assinatura.plano}.`} />
          </View>
        ) : null}

        {recado ? (
          <View style={estilos.atual}>
            <Aviso texto={recado} tom="erro" />
          </View>
        ) : null}

        {planos?.map((plano) => {
          const inclusos = new Set(plano.recursos);
          const atual = sessao?.assinatura.plano === plano.nome;

          return (
            <View
              key={plano.id}
              style={[estilos.cartao, plano.destaque && estilos.cartaoDestaque]}
            >
              {plano.destaque ? (
                <View style={estilos.fita}>
                  <Text style={estilos.fitaTexto}>MAIS ESCOLHIDO</Text>
                </View>
              ) : null}

              <Text style={estilos.nome}>{plano.nome}</Text>
              <Text style={estilos.descricao}>{plano.descricao}</Text>

              <View style={estilos.preco}>
                <Text style={estilos.precoValor}>
                  R$ {plano.precoMensal.toLocaleString('pt-BR')}
                </Text>
                <Text style={estilos.precoPeriodo}>/mês</Text>
              </View>

              <View style={estilos.recursos}>
                {RECURSOS_PLANOS.map((recurso) => {
                  const tem = inclusos.has(recurso);
                  return (
                    <View key={recurso} style={estilos.recurso}>
                      {tem ? <Certo /> : <Traco />}
                      <Text style={[estilos.recursoTexto, !tem && estilos.recursoFora]}>
                        {recurso}
                      </Text>
                    </View>
                  );
                })}
              </View>

              <Botao
                titulo={atual ? 'Seu plano atual' : 'Contratar'}
                variante={plano.destaque ? 'primario' : atual ? 'secundario' : 'primario'}
                cor={plano.destaque ? Cores.petroleo : undefined}
                desabilitado={atual}
                aoPressionar={() => contratar(plano)}
                estilo={estilos.botao}
              />
            </View>
          );
        })}

        <Text style={estilos.nota}>
          A contratação é feita no site, fora do aplicativo. Pagamento seguro e nota fiscal
          emitida a cada cobrança.
        </Text>

        <Rodape />
      </ScrollView>

      <MenuLateral
        visivel={menuAberto}
        aoFechar={() => definirMenuAberto(false)}
        atual="/planos"
      />
    </SafeAreaView>
  );
}

function Certo() {
  return (
    <View style={estilos.marca}>
      <View style={estilos.certo} />
    </View>
  );
}

function Traco() {
  return (
    <View style={estilos.marca}>
      <View style={estilos.traco} />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: Cores.fundo },
  topo: { paddingHorizontal: Espaco.lg, paddingTop: Espaco.lg + 2, alignItems: 'center' },
  titulo: {
    fontSize: Fonte.titulo,
    fontWeight: '700',
    color: Cores.texto,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: Fonte.pequena + 0.5,
    color: Cores.textoApagado,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: Espaco.sm,
  },
  atual: { paddingHorizontal: Espaco.lg, paddingTop: Espaco.lg },
  cartao: {
    marginHorizontal: Espaco.lg,
    marginTop: Espaco.lg,
    padding: Espaco.lg + 2,
    borderWidth: 1,
    borderColor: Cores.bordaSuave,
    borderRadius: Raio.lg,
  },
  cartaoDestaque: {
    borderWidth: 2,
    borderColor: Cores.petroleo,
  },
  fita: {
    position: 'absolute',
    top: -10,
    left: Espaco.lg,
    backgroundColor: Cores.petroleo,
    paddingVertical: Espaco.xs,
    paddingHorizontal: Espaco.sm + 1,
    borderRadius: Raio.sm - 1,
  },
  fitaTexto: {
    color: Cores.textoInverso,
    fontSize: Fonte.minuscula - 1.5,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  nome: { fontSize: Fonte.grande, fontWeight: '700', color: Cores.texto },
  descricao: { fontSize: Fonte.pequena, color: Cores.textoApagado, marginTop: Espaco.xs },
  preco: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Espaco.xs,
    marginTop: Espaco.md + 2,
  },
  precoValor: { fontSize: Fonte.destaque, fontWeight: '700', color: Cores.texto },
  precoPeriodo: { fontSize: Fonte.pequena + 1, color: Cores.textoApagado },
  recursos: { marginTop: Espaco.md + 3, gap: Espaco.sm + 1 },
  recurso: { flexDirection: 'row', alignItems: 'center', gap: Espaco.sm + 1 },
  recursoTexto: { fontSize: Fonte.corpo - 0.5, fontWeight: '600', color: Cores.texto },
  recursoFora: {
    color: '#B4BDCB',
    fontWeight: '400',
    textDecorationLine: 'line-through',
  },
  marca: { width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  certo: {
    width: 10,
    height: 5,
    borderLeftWidth: 2.4,
    borderBottomWidth: 2.4,
    borderColor: Cores.sucesso,
    transform: [{ rotate: '-45deg' }, { translateY: -1 }],
  },
  traco: { width: 11, height: 2.2, borderRadius: 2, backgroundColor: '#C8D0DC' },
  botao: { marginTop: Espaco.lg + 2 },
  nota: {
    fontSize: Fonte.minuscula,
    color: Cores.placeholder,
    textAlign: 'center',
    lineHeight: 17,
    paddingHorizontal: Espaco.xxl,
    marginTop: Espaco.lg + 2,
  },
});
