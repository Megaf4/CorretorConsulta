import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { BotaoPerfil } from '@/components/ui/BotaoPerfil';
import { Busca } from '@/components/ui/Busca';
import { MenuLateral } from '@/components/MenuLateral';
import { Cabecalho } from '@/components/ui/Cabecalho';
import { Carregando, ErroDaTela, Vazio } from '@/components/ui/Estado';
import { Seta } from '@/components/ui/Icones';
import { Rodape } from '@/components/ui/Rodape';
import { Cores, Espaco, Fonte, Raio } from '@/constants/theme';
import { api, FalhaApi } from '@/lib/api';
import { useSessao } from '@/lib/sessao';
import type { OperadoraBiblioteca } from '@/lib/tipos';

export default function TelaBiblioteca() {
  const { token } = useSessao();

  const [operadoras, definirOperadoras] = useState<OperadoraBiblioteca[] | null>(null);
  const [erro, definirErro] = useState<string | null>(null);
  const [menuAberto, definirMenuAberto] = useState(false);
  const [busca, definirBusca] = useState('');

  const carregar = useCallback(async () => {
    if (!token) return;
    try {
      definirErro(null);
      definirOperadoras(await api.biblioteca(token));
    } catch (e) {
      definirErro(e instanceof FalhaApi ? e.mensagem : 'Não foi possível carregar a biblioteca.');
    }
  }, [token]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const lista = useMemo(() => {
    if (!operadoras) return null;
    const termo = busca.trim().toLowerCase();
    if (!termo) return operadoras;
    return operadoras.filter((o) => o.nome.toLowerCase().includes(termo));
  }, [operadoras, busca]);

  return (
    <SafeAreaView style={estilos.tela} edges={['bottom']}>
      <StatusBar style="light" />
      <Cabecalho titulo="Biblioteca" aoAbrirMenu={() => definirMenuAberto(true)}
        direita={<BotaoPerfil />} />

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={estilos.topo}>
          <Text style={estilos.titulo}>Biblioteca</Text>
          <Text style={estilos.subtitulo}>
            Selecione uma operadora para ver os materiais por tema e ano.
          </Text>
        </View>

        <View style={estilos.busca}>
          <Busca valor={busca} aoMudar={definirBusca} dica="Buscar operadora" />
        </View>

        {erro ? <ErroDaTela texto={erro} aoTentar={carregar} /> : null}
        {!operadoras && !erro ? <Carregando /> : null}

        {lista && lista.length === 0 ? (
          <Vazio
            titulo="Nada encontrado"
            texto={`Nenhuma operadora com "${busca.trim()}" no nome.`}
          />
        ) : null}

        <View style={estilos.lista}>
          {lista?.map((operadora) => (
            <Pressable
              key={operadora.id}
              accessibilityRole="button"
              accessibilityLabel={`Abrir materiais de ${operadora.nome}`}
              onPress={() => router.push(`/biblioteca/${operadora.id}` as never)}
              style={({ pressed }) => [
                estilos.item,
                { borderLeftColor: operadora.cor },
                pressed && estilos.pressionado,
              ]}
            >
              <View style={[estilos.icone, { backgroundColor: `${operadora.cor}1A` }]}>
                <Predio cor={operadora.cor} />
              </View>

              <View style={estilos.itemTexto}>
                <Text style={estilos.nome}>{operadora.nome}</Text>
                <Text style={estilos.meta}>
                  {operadora.totalTemas} temas · {operadora.totalMateriais} materiais
                </Text>
              </View>

              <Seta cor="#B4BDCB" tamanho={16} />
            </Pressable>
          ))}
        </View>

        <Rodape />
      </ScrollView>

      <MenuLateral
        visivel={menuAberto}
        aoFechar={() => definirMenuAberto(false)}
        atual="/biblioteca"
      />
    </SafeAreaView>
  );
}

/** Prediozinho simples, feito com View para não precisar de SVG. */
function Predio({ cor }: { cor: string }) {
  return (
    <View style={estilos.predio}>
      <View style={[estilos.predioCorpo, { borderColor: cor }]}>
        <View style={[estilos.janela, { backgroundColor: cor }]} />
        <View style={[estilos.janela, { backgroundColor: cor }]} />
        <View style={[estilos.janela, { backgroundColor: cor }]} />
      </View>
      <View style={[estilos.predioAnexo, { borderColor: cor }]} />
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
    marginTop: Espaco.xs + 1,
    lineHeight: 18,
  },
  busca: { paddingHorizontal: Espaco.lg, paddingTop: Espaco.lg },
  lista: { paddingHorizontal: Espaco.lg, paddingTop: Espaco.lg, gap: Espaco.sm + 1 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.md,
    padding: Espaco.md,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: Cores.bordaSuave,
    borderRadius: Raio.md + 2,
    backgroundColor: Cores.fundo,
  },
  pressionado: { backgroundColor: Cores.fundoSuave },
  icone: {
    width: 38,
    height: 38,
    borderRadius: Raio.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTexto: { flex: 1 },
  nome: { fontSize: Fonte.corpo, fontWeight: '700', color: Cores.texto },
  meta: { fontSize: Fonte.pequena - 0.5, color: Cores.textoApagado, marginTop: 3 },

  predio: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  predioCorpo: {
    width: 12,
    height: 18,
    borderWidth: 1.4,
    borderRadius: 2,
    paddingTop: 2,
    alignItems: 'center',
    gap: 2,
  },
  janela: { width: 5, height: 2 },
  predioAnexo: {
    width: 7,
    height: 12,
    borderWidth: 1.4,
    borderRadius: 2,
  },
});
