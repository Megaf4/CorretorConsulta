import { listarCursosAtivos } from './cursos';
import { supabase } from './supabase';

export async function executarTodosTestes() {
  console.log('Testando conexão com Supabase...');

  const { error } = await supabase
    .from('courses')
    .select('id')
    .limit(1);

  if (error) {
    console.error(`Erro ao acessar courses: ${error.message}`);
  } else {
    console.log('Tabela courses acessível.');
  }

  const cursos = await listarCursosAtivos();
  console.log(`Cursos disponíveis no app: ${cursos.length}`);

  cursos.slice(0, 5).forEach((curso, index) => {
    console.log(`${index + 1}. ${curso.titulo} - ${curso.aulas ?? 0} aulas`);
  });
}
