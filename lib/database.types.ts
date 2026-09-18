/**
 * Tipos e funções para trabalhar com o banco de dados
 */

export interface TabelaInfo {
  tabela: string;
  tipo: string;
  posicao: number;
  coluna: string;
  tipo_do_dado: string;
  tamanho: string | null;
  aceita_nulo: string;
  valor_padrao: string | null;
  e_identity: string;
}

/**
 * Consulta SQL para obter informações sobre as tabelas do banco
 */
export const SQL_INFO_TABELAS = `
  select
    t.table_name                                   as tabela,
    t.table_type                                   as tipo,
    c.ordinal_position                             as posicao,
    c.column_name                                  as coluna,
    c.data_type                                    as tipo_do_dado,
    coalesce(
      c.character_maximum_length::text,
      c.numeric_precision::text
    )                                              as tamanho,
    c.is_nullable                                  as aceita_nulo,
    c.column_default                               as valor_padrao,
    c.is_identity                                  as e_identity
  from information_schema.tables t
  join information_schema.columns c
    on c.table_schema = t.table_schema
   and c.table_name   = t.table_name
  where t.table_schema = 'public'
  order by t.table_name, c.ordinal_position;
`;
