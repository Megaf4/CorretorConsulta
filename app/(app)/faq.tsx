import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { Botao } from '@/components/ui/Botao';
import { BotaoPerfil } from '@/components/ui/BotaoPerfil';
import { Busca } from '@/components/ui/Busca';
import { MenuLateral } from '@/components/MenuLateral';
import { Cabecalho } from '@/components/ui/Cabecalho';
import { Carregando, ErroDaTela, Vazio } from '@/components/ui/Estado';
import { Rodape } from '@/components/ui/Rodape';
import { Cores, Espaco, Fonte, Raio } from '@/constants/theme';
import { api, FalhaApi } from '@/lib/api';
import { useSessao } from '@/lib/sessao';
import type { CategoriaFaq } from '@/lib/tipos';

export default function TelaFaq() {
  const { token } = useSessao();

  const [categorias, definirCategorias] = useState<CategoriaFaq[] | null>(null);
  const [erro, definirErro] = useState<string | null>(null);
  const [menuAberto, definirMenuAberto] = useState(false);
  const [busca, definirBusca] = useState('');
  const [aberta, definirAberta] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    if (!token) return;
    try {
      definirErro(null);
      definirCategorias(await api.faq(token));
    } catch (e) {
      definirErro(e instanceof FalhaApi ? e.mensagem : 'Não foi possível carregar as perguntas.');
    }
  }, [token]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  /** Com busca, filtra pergunta e resposta e some com as categorias vazias. */
  const lista = useMemo(() => {
    if (!categorias) return null;
    const termo = busca.trim().toLowerCase();
    if (!termo) return categorias;

    return categorias
      .map((categoria) => ({
        ...categoria,
        perguntas: categoria.perguntas.filter((p) =>
          `${p.pergunta} ${p.resposta}`.toLowerCase().includes(termo)
        ),
      }))
      .filter((categoria) => categoria.perguntas.length > 0);
  }, [categorias, busca]);

  const nenhum = lista && lista.length === 0;

  return (
    <SafeAreaView style={estilos.tela} edges={['bottom']}>
      <StatusBar style="light" />
      <Cabecalho titulo="FAQ e suporte" aoAbrirMenu={() => definirMenuAberto(true)}
        direita={<BotaoPerfil />} />

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={estilos.topo}>
          <Text style={estilos.titulo}>Perguntas frequentes</Text>
          <Text style={estilos.subtitulo}>
            Respostas rápidas para as dúvidas que mais aparecem no dia a dia.
          </Text>
        </View>

        <View style={estilos.busca}>
          <Busca valor={busca} aoMudar={definirBusca} dica="Buscar nas perguntas" />
        </View>

        {erro ? <ErroDaTela texto={erro} aoTentar={carregar} /> : null}
        {!categorias && !erro ? <Carregando /> : null}

        {nenhum ? (
          <Vazio
            titulo="Nenhuma pergunta encontrada"
            texto={`Nada sobre "${busca.trim()}" por aqui. Fale com o suporte que a gente responde.`}
          />
        ) : null}

        {lista?.map((categoria) => (
          <View key={categoria.id}>
            <View style={estilos.categoria}>
              <Text style={estilos.categoriaTitulo}>{categoria.titulo}</Text>
              <Text style={estilos.categoriaContagem}>
                {categoria.perguntas.length}{' '}
                {categoria.perguntas.length === 1 ? 'pergunta' : 'perguntas'}
              </Text>
            </View>

            {categoria.perguntas.map((item) => {
              const abertaAgora = aberta === item.id;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => definirAberta(abertaAgora ? null : item.id)}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: abertaAgora }}
                  style={estilos.pergunta}
                >
                  <View style={estilos.perguntaLinha}>
                    <Text style={estilos.perguntaTexto}>{item.pergunta}</Text>
                    <Mais aberto={abertaAgora} />
                  </View>
                  {abertaAgora ? (
                    <Text style={estilos.resposta}>{item.resposta}</Text>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        ))}

        {/* Suporte */}
        <View style={estilos.suporte}>
          <Text style={estilos.suporteTitulo}>Não achou o que procurava?</Text>
          <Text style={estilos.suporteTexto}>
            Fale com o nosso time. Respondemos de segunda a sexta, das 9h às 18h.
          </Text>
          <Botao
            titulo="Falar com o suporte"
            aoPressionar={() => router.push('/contato')}
            estilo={estilos.suporteBotao}
          />
        </View>

        <Rodape />
      </ScrollView>

      <MenuLateral
        visivel={menuAberto}
        aoFechar={() => definirMenuAberto(false)}
        atual="/faq"
      />
    </SafeAreaView>
  );
}

/** Sinal de mais que vira X quando a pergunta abre. */
function Mais({ aberto }: { aberto: boolean }) {
  return (
    <View style={estilos.mais}>
      <View style={estilos.maisTraco} />
      <View
        style={[
          estilos.maisTraco,
          { transform: [{ rotate: aberto ? '0deg' : '90deg' }] },
        ]}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: Cores.fundo },
  topo: { paddingHorizontal: Espaco.lg, paddingTop: Espaco.lg + 2 },
  titulo: { fontSize: Fonte.titulo, fontWeight: '700', color: Cores.texto },
  subtitulo: {
    fontSize: Fonte.pequena + 0.5,
    color: Cores.textoApagado,
    marginTop: Espaco.xs + 2,
    lineHeight: 18,
  },
  busca: { paddingHorizontal: Espaco.lg, paddingTop: Espaco.lg },
  categoria: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Espaco.lg,
    marginTop: Espaco.lg,
    padding: Espaco.md,
    borderRadius: Raio.md + 1,
    backgroundColor: Cores.fundoSuave,
  },
  categoriaTitulo: { fontSize: Fonte.pequena + 1.5, fontWeight: '700', color: Cores.texto },
  categoriaContagem: {
    marginLeft: 'auto',
    fontSize: Fonte.pequena - 0.5,
    color: Cores.textoApagado,
  },
  pergunta: {
    marginHorizontal: Espaco.lg,
    paddingVertical: Espaco.lg - 2,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1F6',
  },
  perguntaLinha: { flexDirection: 'row', alignItems: 'flex-start', gap: Espaco.md },
  perguntaTexto: {
    flex: 1,
    fontSize: Fonte.corpo - 0.5,
    fontWeight: '600',
    color: Cores.texto,
    lineHeight: 19,
  },
  resposta: {
    fontSize: Fonte.pequena + 0.5,
    color: Cores.textoSecundario,
    lineHeight: 20,
    marginTop: Espaco.sm + 1,
  },
  mais: { width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  maisTraco: {
    position: 'absolute',
    width: 13,
    height: 2.2,
    borderRadius: 2,
    backgroundColor: Cores.petroleo,
  },
  suporte: {
    marginHorizontal: Espaco.lg,
    marginTop: Espaco.xl,
    padding: Espaco.lg,
    borderWidth: 1,
    borderColor: Cores.bordaSuave,
    borderRadius: Raio.lg - 1,
    alignItems: 'center',
  },
  suporteTitulo: { fontSize: Fonte.medio, fontWeight: '700', color: Cores.texto },
  suporteTexto: {
    fontSize: Fonte.pequena + 0.5,
    color: Cores.textoApagado,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: Espaco.sm - 2,
  },
  suporteBotao: { marginTop: Espaco.md + 2, width: '100%', height: 46 },
});
