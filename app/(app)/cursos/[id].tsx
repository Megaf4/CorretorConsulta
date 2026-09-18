import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { CartaoAula } from '@/components/curso/CartaoAula';
import { Aviso } from '@/components/ui/Aviso';
import { BarraProgresso } from '@/components/ui/BarraProgresso';
import { Botao } from '@/components/ui/Botao';
import { BotaoPerfil } from '@/components/ui/BotaoPerfil';
import { Cabecalho } from '@/components/ui/Cabecalho';
import { Rodape } from '@/components/ui/Rodape';
import { Cores, Espaco, Fonte, Raio } from '@/constants/theme';
import { api, FalhaApi } from '@/lib/api';
import { useSessao } from '@/lib/sessao';
import type { Aula, CursoDetalhe } from '@/lib/tipos';

export default function TelaCurso() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useSessao();

  const [curso, definirCurso] = useState<CursoDetalhe | null>(null);
  const [erro, definirErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    if (!token || !id) return;
    try {
      definirErro(null);
      definirCurso(await api.curso(token, id));
    } catch (e) {
      definirErro(e instanceof FalhaApi ? e.mensagem : 'Não foi possível carregar o curso.');
    }
  }, [token, id]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  function abrirAula(aula: Aula) {
    router.push(`/cursos/${id}/aula/${aula.id}` as never);
  }

  if (erro) {
    return (
      <SafeAreaView style={estilos.tela} edges={['bottom']}>
        <Cabecalho titulo="Curso" voltar destinoVoltar="/" />
        <View style={estilos.padding}>
          <Aviso texto={erro} tom="erro" />
          <Botao titulo="Voltar para os cursos" aoPressionar={() => router.replace('/')} />
        </View>
      </SafeAreaView>
    );
  }

  if (!curso) {
    return (
      <SafeAreaView style={estilos.tela} edges={['bottom']}>
        <StatusBar style="light" />
        <Cabecalho titulo="Curso" voltar destinoVoltar="/" />
        <View style={estilos.carregando}>
          <ActivityIndicator color={Cores.petroleo} />
        </View>
      </SafeAreaView>
    );
  }

  const percentual = curso.totalAulas
    ? Math.round((curso.aulasConcluidas / curso.totalAulas) * 100)
    : 0;
  const concluido = percentual === 100;

  return (
    <SafeAreaView style={estilos.tela} edges={['bottom']}>
      <StatusBar style="light" />
      <Cabecalho titulo={curso.nome} voltar destinoVoltar="/" direita={<BotaoPerfil />} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Resumo do curso */}
        <View style={estilos.resumo}>
          <View style={estilos.resumoTopo}>
            <View style={[estilos.sigla, { backgroundColor: curso.cor }]}>
              <Text style={estilos.siglaTexto}>{curso.sigla}</Text>
            </View>
            <View style={estilos.resumoTexto}>
              <Text style={estilos.nome}>{curso.nome}</Text>
              <Text style={estilos.meta}>
                {curso.categoria} · {curso.totalAulas}{' '}
                {curso.totalAulas === 1 ? 'aula' : 'aulas'} · {curso.duracaoMin} min no total
              </Text>
            </View>
          </View>

          <View style={estilos.barra}>
            <BarraProgresso valor={percentual} cor={curso.cor} altura={6} />
          </View>
          <Text style={estilos.meta}>
            {curso.aulasConcluidas} de {curso.totalAulas}{' '}
            {curso.totalAulas === 1 ? 'aula concluída' : 'aulas concluídas'}
            {concluido ? ' · certificado liberado' : ''}
          </Text>
        </View>

        {/* Aulas */}
        <View style={estilos.padding}>
          {curso.aulas.map((aula) => (
            <CartaoAula key={aula.id} aula={aula} cor={curso.cor} aoAssistir={abrirAula} />
          ))}
        </View>

        <Rodape />
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: Cores.fundo },
  padding: { paddingHorizontal: Espaco.lg, paddingTop: Espaco.lg },
  carregando: { paddingVertical: Espaco.xxxl },
  resumo: {
    paddingHorizontal: Espaco.lg,
    paddingTop: Espaco.lg + 2,
    paddingBottom: Espaco.lg,
    borderBottomWidth: 1,
    borderBottomColor: Cores.bordaSuave,
  },
  resumoTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.md,
  },
  sigla: {
    width: 46,
    height: 46,
    borderRadius: Raio.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  siglaTexto: {
    color: Cores.textoInverso,
    fontWeight: '700',
    fontSize: Fonte.medio,
  },
  resumoTexto: { flex: 1 },
  nome: {
    fontSize: Fonte.grande + 1,
    fontWeight: '700',
    color: Cores.texto,
  },
  meta: {
    fontSize: Fonte.pequena,
    color: Cores.textoApagado,
    marginTop: 3,
  },
  barra: {
    marginTop: Espaco.lg - 2,
    marginBottom: Espaco.sm,
  },
});
