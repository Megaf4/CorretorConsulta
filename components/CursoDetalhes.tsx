import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Curso } from '@/lib/cursos';

interface CursoDetalhesProps {
  curso: Curso;
  onIniciarCurso?: () => void;
  onVoltar?: () => void;
}

export function CursoDetalhes({ curso, onIniciarCurso, onVoltar }: CursoDetalhesProps) {
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

  const getNivelColor = (nivel?: string) => {
    switch (nivel) {
      case 'iniciante':
        return '#4CAF50';
      case 'intermediario':
        return '#FF9800';
      case 'avancado':
        return '#F44336';
      default:
        return '#999';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {onVoltar && (
        <TouchableOpacity style={styles.voltarButton} onPress={onVoltar}>
          <Text style={styles.voltarText}>← Voltar</Text>
        </TouchableOpacity>
      )}

      {curso.thumbnail_url && (
        <Image
          source={{ uri: curso.thumbnail_url }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      )}

      <View style={styles.content}>
        <Text style={styles.titulo}>{curso.titulo}</Text>

        <View style={styles.metaContainer}>
          {curso.instrutor && (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>👤 Instrutor</Text>
              <Text style={styles.metaValue}>{curso.instrutor}</Text>
            </View>
          )}

          {curso.categoria && (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>📁 Categoria</Text>
              <Text style={styles.metaValue}>{curso.categoria}</Text>
            </View>
          )}

          {curso.nivel && (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>📊 Nível</Text>
              <View
                style={[
                  styles.nivelBadge,
                  { backgroundColor: getNivelColor(curso.nivel) },
                ]}
              >
                <Text style={styles.nivelText}>
                  {curso.nivel.toUpperCase()}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>⏱️ Duração</Text>
            <Text style={styles.metaValue}>{formatDuracao(curso.duracao)}</Text>
          </View>
        </View>

        {curso.descricao && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre o Curso</Text>
            <Text style={styles.descricao}>{curso.descricao}</Text>
          </View>
        )}

        <View style={styles.precoContainer}>
          <Text style={styles.precoLabel}>Investimento</Text>
          <Text style={styles.preco}>{formatPreco(curso.preco)}</Text>
        </View>

        {onIniciarCurso && (
          <TouchableOpacity
            style={styles.iniciarButton}
            onPress={onIniciarCurso}
            activeOpacity={0.8}
          >
            <Text style={styles.iniciarText}>
              {curso.preco ? 'Comprar Curso' : 'Iniciar Curso'}
            </Text>
          </TouchableOpacity>
        )}

        {curso.created_at && (
          <Text style={styles.dataPublicacao}>
            Publicado em {new Date(curso.created_at).toLocaleDateString('pt-BR')}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  voltarButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  voltarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  thumbnail: {
    width: '100%',
    height: 250,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  metaContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  metaItem: {
    marginBottom: 12,
  },
  metaLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  nivelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  nivelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  descricao: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  precoContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  precoLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  preco: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  iniciarButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  iniciarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dataPublicacao: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
