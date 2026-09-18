// Script de teste simples para Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kjqqqxvnogasmistxbor.supabase.co';
const supabaseKey = 'sb_publishable_0KLxV3HLRMIUvkTzcPFNGA_5kS2QpOc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testar() {
  console.log('🔍 Testando conexão com Supabase...\n');

  try {
    // Teste 1: Verificar se a tabela cursos existe
    console.log('1️⃣ Verificando tabela "cursos"...');
    const { data: cursos, error: errorCursos, count } = await supabase
      .from('cursos')
      .select('*', { count: 'exact' });

    if (errorCursos) {
      console.error('❌ Erro:', errorCursos.message);
      if (errorCursos.message.includes('relation') || errorCursos.message.includes('does not exist')) {
        console.log('\n⚠️  A tabela "cursos" não existe!');
        console.log('📝 Execute o script supabase/schema.sql no Supabase SQL Editor\n');
      }
      return;
    }

    console.log(`✅ Tabela "cursos" encontrada! Total: ${count || 0} cursos\n`);

    if (cursos && cursos.length > 0) {
      console.log('📚 Cursos encontrados:\n');
      cursos.forEach((curso, i) => {
        console.log(`${i + 1}. ${curso.titulo}`);
        console.log(`   👤 Instrutor: ${curso.instrutor || 'Não informado'}`);
        console.log(`   📁 Categoria: ${curso.categoria || 'Não informada'}`);
        console.log(`   💰 Preço: R$ ${curso.preco || 0}`);
        console.log(`   ⏱️  Duração: ${curso.duracao || 0} min`);
        console.log(`   🎯 Nível: ${curso.nivel || 'Não informado'}`);
        console.log(`   ${curso.ativo ? '✅ Ativo' : '❌ Inativo'}\n`);
      });
    } else {
      console.log('⚠️  Nenhum curso encontrado.');
      console.log('💡 Execute o script supabase/schema.sql para adicionar cursos de exemplo\n');
    }

    // Teste 2: Verificar informações da tabela
    console.log('2️⃣ Verificando estrutura da tabela...');
    const { data: estrutura, error: errorEstrutura } = await supabase
      .rpc('exec_sql', {
        query: `
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = 'cursos'
          ORDER BY ordinal_position;
        `
      });

    if (errorEstrutura) {
      console.log('⚠️  Não foi possível verificar a estrutura (função exec_sql não existe)');
      console.log('   Isso é normal se você não criou a função RPC no schema.sql\n');
    } else if (estrutura) {
      console.log('✅ Estrutura da tabela:');
      estrutura.forEach(col => {
        console.log(`   - ${col.column_name} (${col.data_type})`);
      });
      console.log('');
    }

    console.log('✅ Teste concluído com sucesso!\n');
    console.log('🎉 Seu projeto está configurado corretamente!');

  } catch (err) {
    console.error('❌ Erro inesperado:', err.message);
  }
}

testar();
