import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { executarTodosTestes } from '@/lib/test-connection';

/**
 * Componente para testar a conexão com Supabase
 * Adicione este componente em qualquer tela para testar
 * 
 * @example
 * import { TesteSupabase } from '@/components/TesteSupabase';
 * 
 * <TesteSupabase />
 */
export function TesteSupabase() {
  const [testando, setTestando] = useState(false);
  const [resultado, setResultado] = useState<string | null>(null);

  const executarTeste = async () => {
    setTestando(true);
    setResultado(null);

    // Captura os logs do console
    const logs: string[] = [];
    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
      logs.push(args.join(' '));
      originalLog(...args);
    };

    console.error = (...args) => {
      logs.push('❌ ' + args.join(' '));
      originalError(...args);
    };

    try {
      await executarTodosTestes();
    } catch (err: any) {
      logs.push('❌ Erro inesperado: ' + err.message);
    }

    // Restaura os logs originais
    console.log = originalLog;
    console.error = originalError;

    setResultado(logs.join('\n'));
    setTestando(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 Teste de Conexão Supabase</Text>
      
      <TouchableOpacity
        style={[styles.button, testando && styles.buttonDisabled]}
        onPress={executarTeste}
        disabled={testando}
      >
        <Text style={styles.buttonText}>
          {testando ? '⏳ Testando...' : '▶️ Executar Teste'}
        </Text>
      </TouchableOpacity>

      {resultado && (
        <ScrollView style={styles.resultadoContainer}>
          <Text style={styles.resultadoText}>{resultado}</Text>
        </ScrollView>
      )}

      <Text style={styles.info}>
        Este teste verifica:
        {'\n'}• Conexão com Supabase
        {'\n'}• Existência da tabela 'cursos'
        {'\n'}• Lista os primeiros cursos
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultadoContainer: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 8,
    maxHeight: 400,
    marginBottom: 20,
  },
  resultadoText: {
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
  info: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
});
