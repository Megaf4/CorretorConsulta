import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { MenuLateral } from '@/components/MenuLateral';
import { CartaoCurso } from '@/components/curso/CartaoCurso';
import { Aviso } from '@/components/ui/Aviso';
import { Busca } from '@/components/ui/Busca';
import { Cabecalho } from '@/components/ui/Cabecalho';
import { BotaoPerfil } from '@/components/ui/BotaoPerfil';
import { Rodape } from '@/components/ui/Rodape';
import { Cores, Espaco, Fonte } from '@/constants/theme';
import { api, FalhaApi } from '@/lib/api';
import { useSessao } from '@/lib/sessao';
import type { GrupoCatalogo } from '@/lib/tipos';

export default function TelaInicio() {
  const { token } = useSessao();

  const [grupos, definirGrupos] = useState<GrupoCatalogo[] | null>(null);
  const [erro, definirErro] = useState<string | null>(null);
  const [atualizando, definirAtualizando] = useState(false);
  const [busca, definirBusca] = useState('');
  const [menuAberto, definirMenuAberto] = useState(false);

  const carregar = useCallback(async () => {
    if (!token) return;
    try {
      definirErro(null);
      definirGrupos(await api.catalogo(token));
    } catch (e) {
      definirErro(e instanceof FalhaApi ? e.mensagem : 'Não foi possível carregar os cursos.');
    }
  }, [token]);

  // Recarrega ao voltar de uma tela de curso, para o progresso ficar em dia.
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

  /** Com busca preenchida, some a divisão em blocos e vira uma lista só. */
  const resultados = useMemo(() => {
    if (!grupos) return null;
    const termo = busca.trim().toLowerCase();
    if (!termo) return null;

    const vistos = new Set<string>();
    const achados = [];
    for (const grupo of grupos) {
      for (const curso of grupo.cursos) {
        if (vistos.has(curso.id)) continue;
        const alvo = `${curso.nome} ${curso.categoria}`.toLowerCase();
        if (alvo.includes(termo)) {
          vistos.add(curso.id);
          achados.push(curso);
        }
      }
    }
    return achados;
  }, [grupos, busca]);

  function abrirCurso(id: string) {
    router.push(`/cursos/${id}` as never);
  }

  return (
    <SafeAreaView style={estilos.tela} edges={['bottom']}>
      <StatusBar style="light" />

      <Cabecalho
        marca
        aoAbrirMenu={() => definirMenuAberto(true)}
        direita={<BotaoPerfil />}
      />

      <ScrollView
        contentContainerStyle={estilos.conteudo}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={atualizando} onRefresh={puxarParaAtualizar} />
        }
      >
        <View style={estilos.busca}>
          <Busca valor={busca} aoMudar={definirBusca} />
        </View>

        {erro ? (
          <View style={estilos.padding}>
            <Aviso texto={erro} tom="erro" />
            <Pressable onPress={carregar} accessibilityRole="button">
              <Text style={estilos.tentarDeNovo}>Tentar de novo</Text>
            </Pressable>
          </View>
        ) : null}

        {!grupos && !erro ? (
          <View style={estilos.carregando}>
            <ActivityIndicator color={Cores.petroleo} />
          </View>
        ) : null}

        {/* Resultado da busca */}
        {resultados ? (
          <View style={estilos.padding}>
            <Text style={estilos.tituloGrupo}>
              {resultados.length} {resultados.length === 1 ? 'RESULTADO' : 'RESULTADOS'}
            </Text>
            {resultados.length === 0 ? (
              <Aviso texto={`Nada encontrado para "${busca.trim()}".`} />
            ) : (
              resultados.map((curso) => (
                <CartaoCurso
                  key={curso.id}
                  curso={curso}
                  aoAbrir={(c) => abrirCurso(c.id)}
                />
              ))
            )}
          </View>
        ) : null}

        {/* Catálogo por blocos */}
        {!resultados &&
          grupos?.map((grupo) => (
            <View key={grupo.id} style={estilos.grupo}>
              <Text style={estilos.tituloGrupo}>{grupo.titulo}</Text>
              {grupo.cursos.map((curso) => (
                <CartaoCurso
                  key={`${grupo.id}-${curso.id}`}
                  curso={curso}
                  aoAbrir={(c) => abrirCurso(c.id)}
                  selo={
                    grupo.id === 'em-alta'
                      ? 'alta'
                      : grupo.id === 'favoritos'
                        ? 'favorito'
                        : undefined
                  }
                />
              ))}
            </View>
          ))}

        <Rodape />
      </ScrollView>

      <MenuLateral
        visivel={menuAberto}
        aoFechar={() => definirMenuAberto(false)}
        atual="/"
      />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: Cores.fundo },
  conteudo: { paddingBottom: Espaco.sm },
  padding: { paddingHorizontal: Espaco.lg },
  busca: {
    paddingHorizontal: Espaco.lg,
    paddingTop: Espaco.lg,
  },
  carregando: {
    paddingVertical: Espaco.xxxl,
  },
  grupo: {
    paddingHorizontal: Espaco.lg,
    marginTop: Espaco.xl,
  },
  tituloGrupo: {
    fontSize: Fonte.minuscula,
    letterSpacing: 1.2,
    fontWeight: '700',
    color: Cores.textoSecundario,
    marginBottom: Espaco.md,
  },
  tentarDeNovo: {
    fontSize: Fonte.corpo,
    fontWeight: '700',
    color: Cores.petroleo,
  },
});
