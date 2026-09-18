import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { Aviso } from '@/components/ui/Aviso';
import { BotaoPerfil } from '@/components/ui/BotaoPerfil';
import { Busca } from '@/components/ui/Busca';
import { Cabecalho } from '@/components/ui/Cabecalho';
import { Carregando, ErroDaTela, Vazio } from '@/components/ui/Estado';
import { AbrirFora, Arquivo, Baixar } from '@/components/ui/Icones';
import { Migalhas } from '@/components/ui/Migalhas';
import { Rodape } from '@/components/ui/Rodape';
import { Cores, Espaco, Fonte, Raio } from '@/constants/theme';
import { api, FalhaApi } from '@/lib/api';
import { formatarData } from '@/lib/certificado';
import { useSessao } from '@/lib/sessao';
import type {
  ArquivoBiblioteca,
  OperadoraBiblioteca,
  PastaBiblioteca,
  TipoArquivo,
} from '@/lib/tipos';

type Dados = {
  operadora: OperadoraBiblioteca;
  pasta: PastaBiblioteca;
  anos: number[];
  arquivos: ArquivoBiblioteca[];
};

export default function TelaArquivos() {
  const { operadora: operadoraId, pasta: pastaId } = useLocalSearchParams<{
    operadora: string;
    pasta: string;
  }>();
  const { token } = useSessao();

  const [ano, definirAno] = useState<number>(new Date().getFullYear());
  const [dados, definirDados] = useState<Dados | null>(null);
  const [erro, definirErro] = useState<string | null>(null);
  const [busca, definirBusca] = useState('');
  const [tipo, definirTipo] = useState<TipoArquivo | null>(null);
  const [recado, definirRecado] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    if (!token || !operadoraId || !pastaId) return;
    try {
      definirErro(null);
      definirDados(await api.arquivosBiblioteca(token, operadoraId, pastaId, ano));
    } catch (e) {
      definirErro(e instanceof FalhaApi ? e.mensagem : 'Não foi possível carregar os arquivos.');
    }
  }, [token, operadoraId, pastaId, ano]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  /** Tipos que realmente existem nesta pasta e ano, para não oferecer filtro vazio. */
  const tiposDisponiveis = useMemo(() => {
    if (!dados) return [];
    return [...new Set(dados.arquivos.map((a) => a.tipo))].sort();
  }, [dados]);

  const lista = useMemo(() => {
    if (!dados) return null;
    const termo = busca.trim().toLowerCase();
    return dados.arquivos.filter((a) => {
      const casaTermo = !termo || a.nome.toLowerCase().includes(termo);
      const casaTipo = !tipo || a.tipo === tipo;
      return casaTermo && casaTipo;
    });
  }, [dados, busca, tipo]);

  async function abrir(arquivo: ArquivoBiblioteca) {
    if (!arquivo.url) {
      definirRecado('O link deste arquivo virá da API. Por enquanto é só demonstração.');
      return;
    }
    const pode = await Linking.canOpenURL(arquivo.url);
    if (pode) await Linking.openURL(arquivo.url);
    else definirRecado('Não foi possível abrir este arquivo.');
  }

  return (
    <SafeAreaView style={estilos.tela} edges={['bottom']}>
      <StatusBar style="light" />
      <Cabecalho
        titulo={dados?.pasta.nome ?? 'Materiais'}
        voltar
        destinoVoltar={`/biblioteca/${operadoraId}`}
        direita={<BotaoPerfil />}
      />

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {erro ? <ErroDaTela texto={erro} aoTentar={carregar} /> : null}
        {!dados && !erro ? <Carregando /> : null}

        {dados ? (
          <>
            <View style={estilos.topo}>
              <Migalhas
                itens={['Biblioteca', dados.operadora.nome, dados.pasta.nome]}
              />
              <Text style={estilos.titulo}>{dados.pasta.nome}</Text>
              <Text style={estilos.meta}>
                {dados.operadora.nome} · {dados.pasta.totalMateriais} materiais
              </Text>
            </View>

            <View style={estilos.busca}>
              <Busca valor={busca} aoMudar={definirBusca} dica="Buscar arquivo" />
            </View>

            {/* Anos */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={estilos.anos}
            >
              {dados.anos.map((valor) => {
                const ativo = valor === ano;
                return (
                  <Pressable
                    key={valor}
                    onPress={() => {
                      definirAno(valor);
                      definirTipo(null);
                    }}
                    accessibilityRole="button"
                    accessibilityState={{ selected: ativo }}
                    style={[
                      estilos.ano,
                      ativo && { backgroundColor: dados.operadora.cor, borderColor: dados.operadora.cor },
                    ]}
                  >
                    <Text style={[estilos.anoTexto, ativo && estilos.anoTextoAtivo]}>
                      {valor}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Tipos de arquivo */}
            {tiposDisponiveis.length > 1 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={estilos.tipos}
              >
                {[null, ...tiposDisponiveis].map((valor) => {
                  const ativo = valor === tipo;
                  return (
                    <Pressable
                      key={valor ?? 'todos'}
                      onPress={() => definirTipo(valor)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: ativo }}
                      style={[estilos.filtroTipo, ativo && estilos.filtroTipoAtivo]}
                    >
                      <Text
                        style={[
                          estilos.filtroTipoTexto,
                          ativo && estilos.filtroTipoTextoAtivo,
                        ]}
                      >
                        {valor ?? 'Todos os tipos'}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            ) : null}

            {recado ? (
              <View style={estilos.recado}>
                <Aviso texto={recado} />
              </View>
            ) : null}

            {lista && lista.length === 0 ? (
              <Vazio
                titulo="Nenhum arquivo"
                texto={
                  busca.trim()
                    ? `Nada encontrado para "${busca.trim()}" em ${ano}.`
                    : tipo
                      ? `Esta pasta não tem arquivo ${tipo} em ${ano}.`
                      : `Esta pasta não tem materiais de ${ano}.`
                }
              />
            ) : null}

            {lista && lista.length > 0 ? (
              <View style={estilos.tabela}>
                {lista.map((arquivo, i) => (
                  <View
                    key={arquivo.id}
                    style={[estilos.linha, i === lista.length - 1 && estilos.ultimaLinha]}
                  >
                    <View style={[estilos.icone, { backgroundColor: `${dados.operadora.cor}14` }]}>
                      <Arquivo cor={dados.operadora.cor} />
                    </View>

                    <View style={estilos.linhaTexto}>
                      <Text style={estilos.nome}>{arquivo.nome}</Text>
                      <View style={estilos.linhaMeta}>
                        <View style={[estilos.tipo, { backgroundColor: `${dados.operadora.cor}14` }]}>
                          <Text style={[estilos.tipoTexto, { color: dados.operadora.cor }]}>
                            {arquivo.tipo}
                          </Text>
                        </View>
                        <Text style={estilos.data}>{formatarData(arquivo.data)}</Text>
                      </View>
                    </View>

                    <View style={estilos.acoes}>
                      <Pressable
                        onPress={() => abrir(arquivo)}
                        hitSlop={8}
                        accessibilityRole="button"
                        accessibilityLabel={`Abrir ${arquivo.nome}`}
                      >
                        <AbrirFora />
                      </Pressable>
                      <Pressable
                        onPress={() => abrir(arquivo)}
                        hitSlop={8}
                        accessibilityRole="button"
                        accessibilityLabel={`Baixar ${arquivo.nome}`}
                      >
                        <Baixar />
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            ) : null}
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
  titulo: {
    fontSize: Fonte.titulo - 1,
    fontWeight: '700',
    color: Cores.texto,
    marginTop: Espaco.sm,
  },
  meta: { fontSize: Fonte.pequena, color: Cores.textoApagado, marginTop: Espaco.xs },
  busca: { paddingHorizontal: Espaco.lg, paddingTop: Espaco.lg },
  anos: {
    gap: Espaco.sm,
    paddingHorizontal: Espaco.lg,
    paddingTop: Espaco.lg - 2,
  },
  ano: {
    height: 34,
    paddingHorizontal: Espaco.lg - 2,
    borderRadius: Raio.sm + 2,
    borderWidth: 1,
    borderColor: Cores.borda,
    alignItems: 'center',
    justifyContent: 'center',
  },
  anoTexto: { fontSize: Fonte.pequena + 0.5, fontWeight: '700', color: Cores.textoSecundario },
  anoTextoAtivo: { color: Cores.textoInverso },
  tipos: {
    paddingHorizontal: Espaco.lg,
    paddingTop: Espaco.md - 2,
    gap: Espaco.sm,
  },
  filtroTipo: {
    height: 30,
    paddingHorizontal: Espaco.md,
    borderRadius: Raio.sm + 2,
    borderWidth: 1,
    borderColor: Cores.bordaSuave,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Cores.fundo,
  },
  filtroTipoAtivo: {
    backgroundColor: Cores.fundoSuave,
    borderColor: Cores.borda,
  },
  filtroTipoTexto: {
    fontSize: Fonte.minuscula + 0.5,
    fontWeight: '700',
    color: Cores.textoApagado,
  },
  filtroTipoTextoAtivo: {
    color: Cores.texto,
  },
  recado: { paddingHorizontal: Espaco.lg, paddingTop: Espaco.lg },
  tabela: {
    marginHorizontal: Espaco.lg,
    marginTop: Espaco.lg,
    borderWidth: 1,
    borderColor: Cores.bordaSuave,
    borderRadius: Raio.lg - 2,
    overflow: 'hidden',
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.md - 1,
    padding: Espaco.md + 1,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1F6',
  },
  ultimaLinha: { borderBottomWidth: 0 },
  icone: {
    width: 34,
    height: 34,
    borderRadius: Raio.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linhaTexto: { flex: 1 },
  nome: {
    fontSize: Fonte.pequena + 1.5,
    fontWeight: '600',
    color: Cores.texto,
    lineHeight: 18,
  },
  linhaMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.sm,
    marginTop: Espaco.xs + 1,
  },
  tipo: {
    paddingVertical: 3,
    paddingHorizontal: Espaco.sm - 2,
    borderRadius: Raio.sm - 2,
  },
  tipoTexto: { fontSize: Fonte.minuscula - 1.5, fontWeight: '700', letterSpacing: 0.3 },
  data: { fontSize: Fonte.minuscula, color: Cores.textoApagado },
  acoes: { flexDirection: 'row', gap: Espaco.md },
});
