import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { Aviso } from '@/components/ui/Aviso';
import { BarraProgresso } from '@/components/ui/BarraProgresso';
import { Botao } from '@/components/ui/Botao';
import { BotaoPerfil } from '@/components/ui/BotaoPerfil';
import { Cabecalho } from '@/components/ui/Cabecalho';
import { CirculoPlay, Relogio, Seta } from '@/components/ui/Icones';
import { Rodape } from '@/components/ui/Rodape';
import { Cores, Espaco, Fonte, Raio } from '@/constants/theme';
import { api, FalhaApi } from '@/lib/api';
import { useSessao } from '@/lib/sessao';
import type { CursoDetalhe } from '@/lib/tipos';

export default function TelaAula() {
  const { id, aulaId } = useLocalSearchParams<{ id: string; aulaId: string }>();
  const { token } = useSessao();

  const [curso, definirCurso] = useState<CursoDetalhe | null>(null);
  const [erro, definirErro] = useState<string | null>(null);
  const [recado, definirRecado] = useState<string | null>(null);
  const [salvando, definirSalvando] = useState(false);

  const carregar = useCallback(async () => {
    if (!token || !id) return;
    try {
      definirErro(null);
      definirCurso(await api.curso(token, id));
    } catch (e) {
      definirErro(e instanceof FalhaApi ? e.mensagem : 'Não foi possível carregar a aula.');
    }
  }, [token, id]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const aula = curso?.aulas.find((a) => a.id === aulaId) ?? null;
  const indice = curso?.aulas.findIndex((a) => a.id === aulaId) ?? -1;
  const proxima = curso && indice >= 0 ? curso.aulas[indice + 1] : undefined;
  const concluida = aula?.status === 'assistido';

  /**
   * Grava o quanto foi assistido.
   * Quando o player real entrar, é esta função que ele chama
   * a cada intervalo de reprodução.
   */
  async function gravarProgresso(valor: number) {
    if (!token || !curso || !aula) return;
    definirSalvando(true);
    definirRecado(null);
    try {
      definirCurso(await api.salvarProgresso(token, curso.id, aula.id, valor));
      definirRecado(
        valor >= 100 ? 'Aula marcada como concluída.' : 'Aula marcada como não assistida.'
      );
    } catch (e) {
      definirRecado(
        e instanceof FalhaApi ? e.mensagem : 'Não foi possível salvar o progresso.'
      );
    } finally {
      definirSalvando(false);
    }
  }

  if (erro || (curso && !aula)) {
    return (
      <SafeAreaView style={estilos.tela} edges={['bottom']}>
        <Cabecalho titulo="Aula" voltar />
        <View style={estilos.padding}>
          <Aviso texto={erro ?? 'Aula não encontrada.'} tom="erro" />
          <Botao
            titulo="Voltar para o curso"
            aoPressionar={() => router.replace(`/cursos/${id}` as never)}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (!curso || !aula) {
    return (
      <SafeAreaView style={estilos.tela} edges={['bottom']}>
        <StatusBar style="light" />
        <Cabecalho titulo="Aula" voltar />
        <View style={estilos.carregando}>
          <ActivityIndicator color={Cores.petroleo} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={estilos.tela} edges={['bottom']}>
      <StatusBar style="light" />
      <Cabecalho
          titulo={curso.nome}
          voltar
          destinoVoltar={`/cursos/${curso.id}`}
          direita={<BotaoPerfil />}
        />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Área do vídeo.
            O embed do player (Panda Vídeo, Mux, Cloudflare Stream) entra aqui,
            usando aula.videoId. O restante da tela não muda. */}
        <View style={[estilos.player, { backgroundColor: curso.cor }]}>
          <CirculoPlay tamanho={58} />
          <View style={estilos.playerBarra}>
            <BarraProgresso valor={aula.progresso} cor={Cores.textoInverso} altura={3} />
          </View>
        </View>

        <View style={estilos.padding}>
          <Text style={estilos.posicao}>
            Aula {indice + 1} de {curso.totalAulas} · {aula.assunto}
          </Text>
          <Text style={estilos.titulo}>{aula.titulo}</Text>

          <View style={estilos.linha}>
            <Relogio />
            <Text style={estilos.duracao}>{aula.duracaoMin} min</Text>
            <View style={estilos.ramo}>
              <Text style={estilos.ramoTexto}>{aula.ramo}</Text>
            </View>
          </View>

          <View style={estilos.progresso}>
            <BarraProgresso valor={aula.progresso} cor={curso.cor} altura={5} />
            <Text style={estilos.progressoTexto}>
              {aula.progresso >= 100
                ? 'Você concluiu esta aula.'
                : aula.progresso > 0
                  ? `Você parou em ${aula.progresso}%.`
                  : 'Você ainda não assistiu esta aula.'}
            </Text>
          </View>

          {recado ? (
            <View style={estilos.recado}>
              <Aviso texto={recado} tom="sucesso" />
            </View>
          ) : null}

          <Botao
            titulo={concluida ? 'Marcar como não assistida' : 'Marcar aula como concluída'}
            variante={concluida ? 'secundario' : 'primario'}
            cor={concluida ? undefined : curso.cor}
            carregando={salvando}
            aoPressionar={() => gravarProgresso(concluida ? 0 : 100)}
          />

          {/* Próxima aula */}
          {proxima ? (
            <Pressable
              onPress={() =>
                router.replace(`/cursos/${curso.id}/aula/${proxima.id}` as never)
              }
              accessibilityRole="button"
              style={({ pressed }) => [estilos.proxima, pressed && estilos.proximaPress]}
            >
              <View style={estilos.proximaTexto}>
                <Text style={estilos.proximaRotulo}>PRÓXIMA AULA</Text>
                <Text style={estilos.proximaTitulo} numberOfLines={2}>
                  {proxima.titulo}
                </Text>
                <Text style={estilos.duracao}>{proxima.duracaoMin} min</Text>
              </View>
              <Seta cor={Cores.textoApagado} tamanho={16} />
            </Pressable>
          ) : (
            <View style={estilos.fim}>
              <Aviso
                tom={curso.aulasConcluidas === curso.totalAulas ? 'sucesso' : 'neutro'}
                texto={
                  curso.aulasConcluidas === curso.totalAulas
                    ? 'Curso concluído. Seu certificado já pode ser emitido.'
                    : 'Esta é a última aula do curso.'
                }
              />
            </View>
          )}
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
  player: {
    width: '100%',
    aspectRatio: 16 / 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerBarra: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.85,
  },
  posicao: {
    fontSize: Fonte.pequena - 0.5,
    color: Cores.textoApagado,
    fontWeight: '600',
  },
  titulo: {
    fontSize: Fonte.grande,
    fontWeight: '700',
    color: Cores.texto,
    marginTop: Espaco.xs + 2,
    lineHeight: 25,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.sm - 2,
    marginTop: Espaco.md,
  },
  duracao: {
    fontSize: Fonte.pequena - 0.5,
    color: Cores.textoApagado,
  },
  ramo: {
    marginLeft: 'auto',
    backgroundColor: '#EEF3F8',
    paddingVertical: Espaco.xs,
    paddingHorizontal: Espaco.sm + 1,
    borderRadius: Raio.sm,
  },
  ramoTexto: {
    fontSize: Fonte.minuscula - 0.5,
    fontWeight: '700',
    color: Cores.petroleo,
  },
  progresso: {
    marginTop: Espaco.xl,
    marginBottom: Espaco.xl,
  },
  progressoTexto: {
    fontSize: Fonte.pequena,
    color: Cores.textoApagado,
    marginTop: Espaco.sm,
  },
  recado: { marginBottom: Espaco.xs },
  proxima: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.md,
    marginTop: Espaco.xl,
    padding: Espaco.md + 2,
    borderWidth: 1,
    borderColor: Cores.bordaSuave,
    borderRadius: Raio.lg,
  },
  proximaPress: { backgroundColor: Cores.fundoSuave },
  proximaTexto: { flex: 1 },
  proximaRotulo: {
    fontSize: Fonte.minuscula - 1,
    letterSpacing: 1,
    fontWeight: '700',
    color: Cores.textoApagado,
  },
  proximaTitulo: {
    fontSize: Fonte.corpo,
    fontWeight: '700',
    color: Cores.texto,
    marginTop: 4,
    lineHeight: 18,
  },
  fim: { marginTop: Espaco.xl },
});
