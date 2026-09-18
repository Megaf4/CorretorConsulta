import { supabase } from './supabase';

export type LessonStatus = 'nao-assistido' | 'assistido';

export interface Curso {
  id: string;
  slug: string;
  titulo: string;
  nome?: string;
  descricao?: string | null;
  descricao_curta?: string | null;
  instrutor?: string | null;
  duracao?: number;
  categoria?: string | null;
  aulas?: number;
  destaque?: boolean;
  gratuito?: boolean;
  ativo?: boolean;
  nivel?: 'iniciante' | 'intermediario' | 'avancado';
  preco?: number;
  thumbnail_url?: string | null;
  video_url?: string | null;
  color?: string;
  acronimo?: string;
  badge?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AulaCurso {
  id: string;
  slug: string;
  titulo: string;
  descricao?: string | null;
  duracaoSegundos: number;
  thumbnailUrl?: string | null;
  hlsUrl?: string | null;
  embedUrl?: string | null;
  playerUrl?: string | null;
  status: LessonStatus;
  progressoSegundos: number;
}

export interface CursoDetalhado {
  curso: Curso;
  aulas: AulaCurso[];
}

type CourseRow = {
  id: string;
  slug: string;
  nome: string;
  descricao_curta?: string | null;
  descricao_completa?: string | null;
  instrutor?: string | null;
  destaque?: boolean;
  gratuito?: boolean;
  created_at?: string;
  updated_at?: string;
};

type VideoRow = {
  id: string;
  slug: string;
  titulo: string;
  descricao?: string | null;
  hls_url?: string | null;
  embed_url?: string | null;
  player_url?: string | null;
  thumbnail_url?: string | null;
  duracao_segundos?: number | null;
  publicado?: boolean | null;
  status?: string | null;
  arquivado?: boolean | null;
};

const brandPresets: Record<string, { acronimo: string; color: string; categoria: string }> = {
  amil: { acronimo: 'AM', color: '#2559ac', categoria: 'saúde' },
  'bradesco-saude': { acronimo: 'BS', color: '#d30a36', categoria: 'saúde' },
  bradesco: { acronimo: 'BS', color: '#d30a36', categoria: 'saúde' },
  odontoprev: { acronimo: 'OP', color: '#2559ac', categoria: 'odonto' },
  sulamerica: { acronimo: 'SA', color: '#f47a00', categoria: 'saúde' },
  unimed: { acronimo: 'UN', color: '#069f61', categoria: 'saúde' },
};

const fallbackCourses: CursoDetalhado[] = [
  {
    curso: courseFromSeed('amil', 'Amil', 'EM ALTA'),
    aulas: [
      lessonFromSeed('amil-boleto', 'Como emitir 2ª via de boleto no portal Amil', 6),
      lessonFromSeed('amil-dependente', 'Inclusão de dependente no contrato Amil PME', 8),
      lessonFromSeed('amil-emissao', 'Emissão de contrato Amil PME do zero', 14),
      lessonFromSeed('amil-cotacao', 'Cotação rápida Amil no portal do corretor', 7),
    ],
  },
  {
    curso: courseFromSeed('bradesco-saude', 'Bradesco Saúde', 'EM ALTA'),
    aulas: [
      lessonFromSeed('bradesco-boleto', 'Bradesco Saúde: como emitir boleto mensal', 5),
      lessonFromSeed('bradesco-dependente', 'Inclusão de dependente Bradesco Saúde', 9, 'assistido'),
      lessonFromSeed('bradesco-reembolso', 'Reembolso Bradesco Saúde: como solicitar pelo app', 8),
    ],
  },
  {
    curso: courseFromSeed('sulamerica', 'SulAmérica', 'EM ALTA'),
    aulas: [
      lessonFromSeed('sulamerica-contrato', 'SulAmérica: emissão de contrato adesão', 11),
      lessonFromSeed('sulamerica-boleto', '2ª via de boleto SulAmérica em 3 cliques', 4, 'assistido'),
      lessonFromSeed('sulamerica-portabilidade', 'Portabilidade SulAmérica: regras e prazos', 12),
    ],
  },
  {
    curso: courseFromSeed('unimed', 'Unimed', 'FAVORITO'),
    aulas: [
      lessonFromSeed('unimed-boleto', 'Unimed: como emitir 2ª via no portal', 5, 'assistido'),
      lessonFromSeed('unimed-reajuste', 'Reajuste anual Unimed: como explicar ao cliente', 12),
    ],
  },
  {
    curso: courseFromSeed('odontoprev', 'Odontoprev', 'FAVORITO'),
    aulas: [
      lessonFromSeed('odontoprev-boleto', 'Odontoprev: emissão de boleto e baixa', 5),
      lessonFromSeed('odontoprev-dependente', 'Inclusão de dependente Odontoprev', 6, 'assistido'),
      lessonFromSeed('odontoprev-cancelamento', 'Cancelamento Odontoprev: passo a passo', 7),
    ],
  },
].map((item) => ({
  ...item,
  curso: {
    ...item.curso,
    aulas: item.aulas.length,
    duracao: totalMinutes(item.aulas),
  },
}));

function courseFromSeed(slug: string, titulo: string, badge: string): Curso {
  const preset = brandPresets[slug] ?? brandPresets.bradesco;
  return {
    id: slug,
    slug,
    titulo,
    nome: titulo,
    categoria: preset.categoria,
    color: preset.color,
    acronimo: preset.acronimo,
    badge,
    destaque: badge === 'EM ALTA',
    gratuito: true,
    ativo: true,
  };
}

function lessonFromSeed(
  slug: string,
  titulo: string,
  minutes: number,
  status: LessonStatus = 'nao-assistido'
): AulaCurso {
  return {
    id: slug,
    slug,
    titulo,
    duracaoSegundos: minutes * 60,
    status,
    progressoSegundos: status === 'assistido' ? minutes * 60 : 0,
  };
}

function slugToPreset(slug?: string, name?: string) {
  const normalized = (slug || name || '').toLowerCase();
  if (normalized.includes('bradesco')) return brandPresets['bradesco-saude'];
  if (normalized.includes('sul')) return brandPresets.sulamerica;
  if (normalized.includes('unimed')) return brandPresets.unimed;
  if (normalized.includes('odonto')) return brandPresets.odontoprev;
  if (normalized.includes('amil')) return brandPresets.amil;
  return { acronimo: (name || 'CC').slice(0, 2).toUpperCase(), color: '#2559ac', categoria: 'saúde' };
}

function mapCourse(row: CourseRow, aulas = 0, duracao = 0): Curso {
  const preset = slugToPreset(row.slug, row.nome);

  return {
    id: row.id,
    slug: row.slug,
    titulo: row.nome,
    nome: row.nome,
    descricao: row.descricao_completa ?? row.descricao_curta ?? null,
    descricao_curta: row.descricao_curta ?? null,
    instrutor: row.instrutor ?? null,
    duracao,
    categoria: preset.categoria,
    aulas,
    destaque: !!row.destaque,
    gratuito: !!row.gratuito,
    ativo: true,
    color: preset.color,
    acronimo: preset.acronimo,
    badge: row.destaque ? 'EM ALTA' : 'FAVORITO',
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function mapLesson(row: VideoRow, progress?: { progresso_segundos?: number | null; concluido?: boolean | null }): AulaCurso {
  return {
    id: row.id,
    slug: row.slug,
    titulo: row.titulo,
    descricao: row.descricao ?? null,
    duracaoSegundos: row.duracao_segundos ?? 0,
    thumbnailUrl: row.thumbnail_url ?? null,
    hlsUrl: row.hls_url ?? null,
    embedUrl: row.embed_url ?? null,
    playerUrl: row.player_url ?? null,
    status: progress?.concluido ? 'assistido' : 'nao-assistido',
    progressoSegundos: progress?.progresso_segundos ?? 0,
  };
}

function totalMinutes(aulas: AulaCurso[]) {
  return Math.round(aulas.reduce((sum, aula) => sum + aula.duracaoSegundos, 0) / 60);
}

function formatSupabaseError(error: { message?: string } | null) {
  return error?.message ? `Supabase: ${error.message}` : 'Erro ao carregar dados do Supabase';
}

async function getCurrentUserId() {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

async function carregarAulasDoCurso(courseId: string): Promise<AulaCurso[]> {
  const { data: modules, error: modulesError } = await supabase
    .from('video_modules')
    .select('id')
    .eq('course_id', courseId)
    .eq('ativo', true)
    .order('ordem', { ascending: true });

  if (modulesError) {
    throw new Error(formatSupabaseError(modulesError));
  }

  const moduleIds = (modules ?? []).map((module) => module.id);
  if (!moduleIds.length) return [];

  const { data: rows, error: lessonsError } = await supabase
    .from('module_videos')
    .select('module_id, ordem, video:videos(id, slug, titulo, descricao, hls_url, embed_url, player_url, thumbnail_url, duracao_segundos, publicado, status, arquivado)')
    .in('module_id', moduleIds)
    .order('ordem', { ascending: true });

  if (lessonsError) {
    throw new Error(formatSupabaseError(lessonsError));
  }

  const videos = (rows ?? [])
    .map((row: any) => row.video as VideoRow | null)
    .filter((video): video is VideoRow => {
      return !!video && video.publicado !== false && video.status !== 'arquivado' && video.arquivado !== true;
    });

  const userId = await getCurrentUserId();
  let progressByVideo: Record<string, { progresso_segundos?: number | null; concluido?: boolean | null }> = {};

  if (userId && videos.length) {
    const { data: progressRows } = await supabase
      .from('historico')
      .select('video_id, progresso_segundos, concluido')
      .eq('user_id', userId)
      .in(
        'video_id',
        videos.map((video) => video.id)
      );

    progressByVideo = (progressRows ?? []).reduce((acc: typeof progressByVideo, row: any) => {
      acc[row.video_id] = row;
      return acc;
    }, {});
  }

  return videos.map((video) => mapLesson(video, progressByVideo[video.id]));
}

async function carregarCursosDoSupabase(): Promise<Curso[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('id, slug, nome, descricao_curta, descricao_completa, instrutor, destaque, gratuito, created_at, updated_at')
    .eq('status', 'publicado')
    .eq('arquivado', false)
    .order('ordem', { ascending: true });

  if (error) {
    throw new Error(formatSupabaseError(error));
  }

  const rows = (data ?? []) as CourseRow[];
  const enriched = await Promise.all(
    rows.map(async (course) => {
      try {
        const aulas = await carregarAulasDoCurso(course.id);
        return mapCourse(course, aulas.length, totalMinutes(aulas));
      } catch {
        return mapCourse(course);
      }
    })
  );

  return enriched;
}

function cursosFallback(): Curso[] {
  return fallbackCourses.map((item) => item.curso);
}

export async function listarCursosAtivos(): Promise<Curso[]> {
  try {
    const cursos = await carregarCursosDoSupabase();
    return cursos.length ? cursos : cursosFallback();
  } catch (error) {
    console.warn('Usando cursos locais porque o Supabase não retornou cursos:', error);
    return cursosFallback();
  }
}

export async function listarCursos(): Promise<Curso[]> {
  return listarCursosAtivos();
}

export async function pesquisarCursos(termo: string): Promise<Curso[]> {
  const query = termo.trim().toLowerCase();
  const cursos = await listarCursosAtivos();
  if (!query) return cursos;

  return cursos.filter((curso) => {
    const alvo = `${curso.titulo} ${curso.categoria ?? ''} ${curso.descricao ?? ''}`.toLowerCase();
    return alvo.includes(query);
  });
}

export async function buscarCursoDetalhado(slug: string): Promise<CursoDetalhado | null> {
  const fallback = fallbackCourses.find((item) => item.curso.slug === slug || item.curso.id === slug);

  try {
    const { data, error } = await supabase
      .from('courses')
      .select('id, slug, nome, descricao_curta, descricao_completa, instrutor, destaque, gratuito, created_at, updated_at')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      throw new Error(formatSupabaseError(error));
    }

    if (!data) {
      return fallback ?? null;
    }

    const aulas = await carregarAulasDoCurso(data.id);
    const curso = mapCourse(data as CourseRow, aulas.length, totalMinutes(aulas));

    return {
      curso,
      aulas: aulas.length ? aulas : fallback?.aulas ?? [],
    };
  } catch (error) {
    console.warn('Usando detalhe local porque o Supabase não retornou o curso:', error);
    return fallback ?? null;
  }
}

export async function buscarCurso(idOrSlug: string): Promise<Curso | null> {
  const cursos = await listarCursosAtivos();
  return cursos.find((curso) => curso.id === idOrSlug || curso.slug === idOrSlug) ?? null;
}

export async function salvarProgressoAula(
  videoId: string,
  progressoSegundos: number,
  concluido = false
): Promise<{ saved: boolean }> {
  const userId = await getCurrentUserId();
  if (!userId) return { saved: false };

  const { error } = await supabase.from('historico').upsert(
    {
      user_id: userId,
      video_id: videoId,
      progresso_segundos: Math.max(0, Math.round(progressoSegundos)),
      concluido,
      atualizado_em: new Date().toISOString(),
    },
    { onConflict: 'user_id,video_id' }
  );

  if (error) {
    throw new Error(formatSupabaseError(error));
  }

  return { saved: true };
}

export function inscreverMudancasCursos(callback: (payload: any) => void) {
  return supabase
    .channel('mobile-courses-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'courses' }, callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'videos' }, callback)
    .subscribe();
}

export async function buscarCursosPorCategoria(categoria: string): Promise<Curso[]> {
  const cursos = await listarCursosAtivos();
  return cursos.filter((curso) => curso.categoria?.toLowerCase() === categoria.toLowerCase());
}

export async function buscarCursosPorInstrutor(instrutor: string): Promise<Curso[]> {
  const cursos = await listarCursosAtivos();
  return cursos.filter((curso) => curso.instrutor?.toLowerCase().includes(instrutor.toLowerCase()));
}
