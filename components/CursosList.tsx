import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { listarCursosAtivos, Curso, inscreverMudancasCursos } from '@/lib/cursos';

interface CursosListProps {
  onCursoPress?: (curso: Curso) => void;
}

export function CursosList({ onCursoPress }: CursosListProps) {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarCursos();

    // Inscrever para atualizações em tempo real
    const channel = inscreverMudancasCursos((payload) => {
      console.log('Mudança detectada nos cursos:', payload);
      carregarCursos();
    });

    // Cleanup
    return () => {
      channel.unsubscribe();
    };
  }, []);

  const carregarCursos = async () => {
    try {
      setError(null);
      const data = await listarCursosAtivos();
      setCursos(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar cursos');
      console.error('Erro ao carregar cursos:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    carregarCursos();
  };

  const formatDuracao = (minutos?: number) => {
    if (!minutos) return 'Duração não informada';
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    if (horas > 0) {
      return `${horas}h ${mins > 0 ? `${mins}min` : ''}`;
    }
    return `${mins}min`;
  };

  const formatPreco = (preco?: number) => {
    if (!preco) return 'Gratuito';
    return preco.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const renderCurso = ({ item }: { item: Curso }) => (
    <TouchableOpacity
      style={styles.cursoCard}
      onPress={() => onCursoPress?.(item)}
      activeOpacity={0.7}
    >
      {item.thumbnail_url && (
        <Image
          source={{ uri: item.thumbnail_url }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      )}
      <View style={styles.cursoContent}>
        <Text style={styles.cursoTitulo} numberOfLines={2}>
          {item.titulo}
        </Text>
        {item.descricao && (
          <Text style={styles.cursoDescricao} numberOfLines={2}>
            {item.descricao}
          </Text>
        )}
        <View style={styles.cursoMeta}>
          {item.instrutor && (
            <Text style={styles.metaText}>👤 {item.instrutor}</Text>
          )}
          {item.categoria && (
            <Text style={styles.metaText}>📁 {item.categoria}</Text>
          )}
        </View>
        <View style={styles.cursoFooter}>
          {item.nivel && (
            <View style={[styles.nivelBadge, getNivelStyle(item.nivel)]}>
              <Text style={styles.nivelText}>
                {item.nivel.toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={styles.duracao}>{formatDuracao(item.duracao)}</Text>
          <Text style={styles.preco}>{formatPreco(item.preco)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Carregando cursos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>❌ {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={carregarCursos}>
          <Text style={styles.retryText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={cursos}
      keyExtractor={(item) => item.id}
      renderItem={renderCurso}
      contentContainerStyle={styles.listContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      ListEmptyComponent={
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>📚 Nenhum curso disponível</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  cursoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbnail: {
    width: '100%',
    height: 180,
    backgroundColor: '#f0f0f0',
  },
  cursoContent: {
    padding: 16,
  },
  cursoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cursoDescricao: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  cursoMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  metaText: {
    fontSize: 12,
    color: '#999',
  },
  cursoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nivelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  niveliniciante: {
    backgroundColor: '#4CAF50',
  },
  nivelintermediario: {
    backgroundColor: '#FF9800',
  },
  nivelavancado: {
    backgroundColor: '#F44336',
  },
  nivelText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  duracao: {
    fontSize: 12,
    color: '#666',
  },
  preco: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

function getNivelStyle(nivel?: Curso['nivel']) {
  switch (nivel) {
    case 'iniciante':
      return styles.niveliniciante;
    case 'intermediario':
      return styles.nivelintermediario;
    case 'avancado':
      return styles.nivelavancado;
    default:
      return styles.niveliniciante;
  }
}
