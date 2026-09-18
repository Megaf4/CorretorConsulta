import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { BotaoPerfil } from '@/components/ui/BotaoPerfil';
import { Cabecalho } from '@/components/ui/Cabecalho';
import { Carregando, ErroDaTela } from '@/components/ui/Estado';
import { Migalhas } from '@/components/ui/Migalhas';
import { Pasta } from '@/components/ui/Icones';
import { Rodape } from '@/components/ui/Rodape';
import { Cores, Espaco, Fonte, Raio } from '@/constants/theme';
import { api, FalhaApi } from '@/lib/api';
import { useSessao } from '@/lib/sessao';
import type { OperadoraBiblioteca, PastaBiblioteca } from '@/lib/tipos';

export default function TelaPastas() {
  const { operadora: operadoraId } = useLocalSearchParams<{ operadora: string }>();
  const { token } = useSessao();

  const [dados, definirDados] = useState<{
    operadora: OperadoraBiblioteca;
    pastas: PastaBiblioteca[];
  } | null>(null);
  const [erro, definirErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    if (!token || !operadoraId) return;
    try {
      definirErro(null);
      definirDados(await api.pastasBiblioteca(token, operadoraId));
    } catch (e) {
      definirErro(e instanceof FalhaApi ? e.mensagem : 'Não foi possível carregar os temas.');
    }
  }, [token, operadoraId]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  return (
    <SafeAreaView style={estilos.tela} edges={['bottom']}>
      <StatusBar style="light" />
      <Cabecalho
        titulo={dados?.operadora.nome ?? 'Biblioteca'}
        voltar
        destinoVoltar="/biblioteca"
        direita={<BotaoPerfil />}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {erro ? <ErroDaTela texto={erro} aoTentar={carregar} /> : null}
        {!dados && !erro ? <Carregando /> : null}

        {dados ? (
          <>
            <View style={estilos.topo}>
              <Migalhas itens={['Biblioteca', dados.operadora.nome]} />
              <View style={estilos.tituloLinha}>
                <View style={[estilos.ponto, { backgroundColor: dados.operadora.cor }]} />
                <Text style={estilos.titulo}>{dados.operadora.nome}</Text>
              </View>
              <Text style={estilos.meta}>
                {dados.operadora.totalTemas} temas · {dados.operadora.totalMateriais} materiais
              </Text>
            </View>

            <View style={estilos.grade}>
              {dados.pastas.map((pasta) => (
                <Pressable
                  key={pasta.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Abrir ${pasta.nome}`}
                  onPress={() =>
                    router.push(`/biblioteca/${dados.operadora.id}/${pasta.id}` as never)
                  }
                  style={({ pressed }) => [
                    estilos.pasta,
                    { borderLeftColor: dados.operadora.cor },
                    pressed && estilos.pressionado,
                  ]}
                >
                  <Pasta cor={dados.operadora.cor} />
                  <Text style={estilos.pastaNome}>{pasta.nome}</Text>
                  <Text style={estilos.pastaMeta}>{pasta.totalMateriais} materiais</Text>
                </Pressable>
              ))}
            </View>
          </>
        ) : null}

        <Rodape />
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: Cores.fundo },
  topo: { paddingHorizontal: Espaco.lg, paddingTop: Espaco.lg - 2 },
  tituloLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.sm + 2,
    marginTop: Espaco.sm,
  },
  ponto: { width: 9, height: 9, borderRadius: 5 },
  titulo: { fontSize: Fonte.titulo - 1, fontWeight: '700', color: Cores.texto },
  meta: { fontSize: Fonte.pequena, color: Cores.textoApagado, marginTop: Espaco.xs + 1 },
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Espaco.sm + 2,
    paddingHorizontal: Espaco.lg,
    paddingTop: Espaco.lg,
  },
  pasta: {
    width: '48%',
    flexGrow: 1,
    padding: Espaco.md + 2,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: Cores.bordaSuave,
    borderRadius: Raio.lg - 2,
    backgroundColor: Cores.fundo,
  },
  pressionado: { backgroundColor: Cores.fundoSuave },
  pastaNome: {
    fontSize: Fonte.pequena + 1.5,
    fontWeight: '700',
    color: Cores.texto,
    marginTop: Espaco.md - 1,
    lineHeight: 17,
  },
  pastaMeta: { fontSize: Fonte.minuscula, color: Cores.textoApagado, marginTop: Espaco.xs },
});
