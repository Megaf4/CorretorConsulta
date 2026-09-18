import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { BarraProgresso } from '@/components/ui/BarraProgresso';
import { BotaoPerfil } from '@/components/ui/BotaoPerfil';
import { MenuLateral } from '@/components/MenuLateral';
import { Cabecalho } from '@/components/ui/Cabecalho';
import { Carregando, ErroDaTela, Vazio } from '@/components/ui/Estado';
import { Play, Seta } from '@/components/ui/Icones';
import { Rodape } from '@/components/ui/Rodape';
import { Cores, Espaco, Fonte, Raio } from '@/constants/theme';
import { api, FalhaApi } from '@/lib/api';
import { useSessao } from '@/lib/sessao';
import type { Aula, CursoDetalhe } from '@/lib/tipos';

export default function TelaMeusCursos() {
  const { token } = useSessao();

  const [cursos, definirCursos] = useState<CursoDetalhe[] | null>(null);
  const [erro, definirErro] = useState<string | null>(null);
  const [menuAberto, definirMenuAberto] = useState(false);
  const [atualizando, definirAtualizando] = useState(false);

  const carregar = useCallback(async () => {
    if (!token) return;
    try {
      definirErro(null);
      definirCursos(await api.meusCursos(token));
    } catch (e) {
      definirErro(e instanceof FalhaApi ? e.mensagem : 'Não foi possível carregar seus cursos.');
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      void carregar();
    }, [carregar])
  );

  async function puxarParaAtualizar() {
    definirAtualizando(true);
    await carregar();
    definirAtualizando(false);
  }

  /** Aulas que faltam, na ordem: a que está em andamento vem primeiro. */
  function pendentes(curso: CursoDetalhe): Aula[] {
    return curso.aulas.filter((a) => a.status !== 'assistido');
  }

  /** Para onde o botão "Continuar de onde parou" leva. */
  function aulaParaRetomar(curso: CursoDetalhe): Aula | undefined {
    return (
      curso.aulas.find((a) => a.status === 'em-andamento') ??
      curso.aulas.find((a) => a.status === 'nao-assistido')
    );
  }

  const totais = cursos
    ? {
        cursos: cursos.length,
        aulas: cursos.reduce((soma, c) => soma + pendentes(c).length, 0),
        minutos: cursos.reduce(
          (soma, c) => soma + pendentes(c).reduce((s, a) => s + a.duracaoMin, 0),
          0
        ),
      }
    : null;

  return (
    <SafeAreaView style={estilos.tela} edges={['bottom']}>
      <StatusBar style="light" />
      <Cabecalho
        titulo="Meus cursos"
        aoAbrirMenu={() => definirMenuAberto(true)}
        direita={<BotaoPerfil />}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={atualizando} onRefresh={puxarParaAtualizar} />
        }
      >
        {erro ? <ErroDaTela texto={erro} aoTentar={carregar} /> : null}
        {!cursos && !erro ? <Carregando /> : null}

        {totais && totais.cursos > 0 ? (
          <View style={estilos.resumo}>
            <Numero valor={String(totais.cursos)} rotulo="em andamento" />
            <View style={estilos.divisor} />
            <Numero valor={String(totais.aulas)} rotulo="aulas restantes" />
            <View style={estilos.divisor} />
            <Numero valor={`${totais.minutos} min`} rotulo="para concluir" />
          </View>
        ) : null}

        {cursos && cursos.length === 0 ? (
          <Vazio
            titulo="Você ainda não começou nenhum curso"
            texto="Assim que você assistir a primeira aula, o curso aparece aqui com o ponto onde parou."
          />
        ) : null}

        {cursos?.map((curso) => {
          const percentual = Math.round((curso.aulasConcluidas / curso.totalAulas) * 100);
          const faltam = pendentes(curso);
          const retomar = aulaParaRetomar(curso);

          return (
            <View key={curso.id} style={estilos.curso}>
              {/* Cabeçalho do curso */}
              <Pressable
                style={estilos.cursoTopo}
                accessibilityRole="button"
                onPress={() => router.push(`/cursos/${curso.id}` as never)}
              >
                <View style={[estilos.sigla, { backgroundColor: curso.cor }]}>
                  <Text style={estilos.siglaTexto}>{curso.sigla}</Text>
                </View>
                <View style={estilos.cursoTexto}>
                  <Text style={estilos.cursoNome}>{curso.nome}</Text>
                  <Text style={estilos.meta}>
                    {curso.aulasConcluidas} de {curso.totalAulas} aulas concluídas
                  </Text>
                </View>
                <Text style={[estilos.percentual, { color: curso.cor }]}>{percentual}%</Text>
              </Pressable>

              <BarraProgresso valor={percentual} cor={curso.cor} altura={6} />

              <Text style={estilos.faltam}>
                {faltam.length === 1 ? 'FALTA 1 AULA' : `FALTAM ${faltam.length} AULAS`}
              </Text>

              {faltam.map((aula) => (
                <Pressable
                  key={aula.id}
                  style={estilos.aula}
                  accessibilityRole="button"
                  onPress={() =>
                    router.push(`/cursos/${curso.id}/aula/${aula.id}` as never)
                  }
                >
                  <View style={estilos.aulaIcone}>
                    <Play tamanho={12} cor={Cores.textoSecundario} />
                  </View>
                  <View style={estilos.aulaTexto}>
                    <Text style={estilos.aulaTitulo}>{aula.titulo}</Text>
                    <Text style={estilos.aulaMeta}>
                      {aula.duracaoMin} min
                      {aula.progresso > 0 ? ` · você parou em ${aula.progresso}%` : ''}
                    </Text>
                    {aula.progresso > 0 ? (
                      <View style={estilos.aulaBarra}>
                        <BarraProgresso valor={aula.progresso} cor={curso.cor} altura={3} />
                      </View>
                    ) : null}
                  </View>
                </Pressable>
              ))}

              {retomar ? (
                <Pressable
                  style={[estilos.continuar, { backgroundColor: curso.cor }]}
                  accessibilityRole="button"
                  onPress={() =>
                    router.push(`/cursos/${curso.id}/aula/${retomar.id}` as never)
                  }
                >
                  <Text style={estilos.continuarTexto}>Continuar de onde parou</Text>
                  <Seta tamanho={14} />
                </Pressable>
              ) : null}
            </View>
          );
        })}

        <Rodape />
      </ScrollView>

      <MenuLateral
        visivel={menuAberto}
        aoFechar={() => definirMenuAberto(false)}
        atual="/meus-cursos"
      />
    </SafeAreaView>
  );
}

function Numero({ valor, rotulo }: { valor: string; rotulo: string }) {
  return (
    <View>
      <Text style={estilos.numero}>{valor}</Text>
      <Text style={estilos.numeroRotulo}>{rotulo}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: Cores.fundo },
  resumo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.lg,
    margin: Espaco.lg,
    marginBottom: 0,
    padding: Espaco.lg - 2,
    borderRadius: Raio.lg,
    backgroundColor: Cores.fundoSuave,
  },
  divisor: { width: 1, height: 34, backgroundColor: '#DDE3EC' },
  numero: { fontSize: Fonte.titulo, fontWeight: '700', color: Cores.texto },
  numeroRotulo: { fontSize: Fonte.minuscula, color: Cores.textoApagado, marginTop: 4 },
  curso: {
    marginHorizontal: Espaco.lg,
    marginTop: Espaco.lg,
    borderWidth: 1,
    borderColor: Cores.bordaSuave,
    borderRadius: Raio.lg,
    overflow: 'hidden',
    paddingBottom: Espaco.md,
  },
  cursoTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.md,
    padding: Espaco.md + 1,
  },
  sigla: {
    width: 52,
    height: 52,
    borderRadius: Raio.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  siglaTexto: { color: Cores.textoInverso, fontWeight: '700', fontSize: Fonte.pequena + 1 },
  cursoTexto: { flex: 1 },
  cursoNome: { fontSize: Fonte.medio + 0.5, fontWeight: '700', color: Cores.texto },
  meta: { fontSize: Fonte.pequena - 0.5, color: Cores.textoApagado, marginTop: 3 },
  percentual: { fontSize: Fonte.grande - 2, fontWeight: '700' },
  faltam: {
    fontSize: Fonte.minuscula,
    fontWeight: '700',
    color: Cores.textoSecundario,
    letterSpacing: 0.4,
    paddingHorizontal: Espaco.md + 1,
    paddingTop: Espaco.md + 1,
    paddingBottom: Espaco.xs + 2,
  },
  aula: {
    flexDirection: 'row',
    gap: Espaco.md - 1,
    paddingHorizontal: Espaco.md + 1,
    paddingVertical: Espaco.sm + 1,
  },
  aulaIcone: {
    width: 34,
    height: 34,
    borderRadius: Raio.sm + 2,
    backgroundColor: '#F1F4F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aulaTexto: { flex: 1 },
  aulaTitulo: {
    fontSize: Fonte.pequena + 1,
    fontWeight: '600',
    color: Cores.texto,
    lineHeight: 18,
  },
  aulaMeta: { fontSize: Fonte.minuscula, color: Cores.textoApagado, marginTop: 2 },
  aulaBarra: { marginTop: Espaco.sm - 2 },
  continuar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Espaco.sm,
    height: 44,
    borderRadius: Raio.md,
    marginHorizontal: Espaco.md + 1,
    marginTop: Espaco.md,
  },
  continuarTexto: {
    color: Cores.textoInverso,
    fontSize: Fonte.corpo - 0.5,
    fontWeight: '700',
  },
});
