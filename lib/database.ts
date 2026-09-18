import { supabase } from './supabase';
import { SQL_INFO_TABELAS, TabelaInfo } from './database.types';

/**
 * Busca informações sobre as tabelas do banco de dados
 */
export async function getTabelasInfo(): Promise<TabelaInfo[]> {
  const { data, error } = await supabase.rpc('exec_sql', {
    query: SQL_INFO_TABELAS
  });

  if (error) {
    console.error('Erro ao buscar informações das tabelas:', error);
    throw error;
  }

  return data || [];
}

/**
 * Busca informações sobre uma tabela específica
 */
export async function getTabelaInfo(nomeTabela: string): Promise<TabelaInfo[]> {
  const todasTabelas = await getTabelasInfo();
  return todasTabelas.filter(t => t.tabela === nomeTabela);
}

/**
 * Lista todas as tabelas disponíveis
 */
export async function listarTabelas(): Promise<string[]> {
  const tabelas = await getTabelasInfo();
  const tabelasUnicas = new Set(tabelas.map(t => t.tabela));
  return Array.from(tabelasUnicas).sort();
}

/**
 * Executa uma consulta SQL customizada
 * Nota: Você precisa criar uma função RPC no Supabase para isso
 */
export async function executarSQL(query: string) {
  const { data, error } = await supabase.rpc('exec_sql', { query });

  if (error) {
    console.error('Erro ao executar SQL:', error);
    throw error;
  }

  return data;
}
