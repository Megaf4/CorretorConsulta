-- Schema do app mobile Corretor Consulta.
-- Modelo adaptado do projeto antigo: courses -> video_modules -> module_videos -> videos.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN
  CREATE TYPE public.video_status AS ENUM ('rascunho', 'publicado', 'agendado', 'arquivado');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  nome text NOT NULL,
  descricao_curta text,
  descricao_completa text,
  instrutor text,
  status public.video_status NOT NULL DEFAULT 'publicado',
  publicado_em timestamptz DEFAULT now(),
  agendado_para timestamptz,
  gratuito boolean NOT NULL DEFAULT true,
  destaque boolean NOT NULL DEFAULT false,
  ordem integer NOT NULL DEFAULT 0,
  capa_horizontal_path text,
  capa_vertical_path text,
  banner_path text,
  arquivado boolean NOT NULL DEFAULT false,
  tags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  titulo text NOT NULL,
  descricao text,
  hls_url text,
  embed_url text,
  player_url text,
  thumbnail_url text,
  duracao_segundos integer DEFAULT 0,
  publicado boolean NOT NULL DEFAULT true,
  status public.video_status NOT NULL DEFAULT 'publicado',
  arquivado boolean NOT NULL DEFAULT false,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.video_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE,
  nome text NOT NULL,
  descricao text,
  ordem integer NOT NULL DEFAULT 0,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.module_videos (
  module_id uuid NOT NULL REFERENCES public.video_modules(id) ON DELETE CASCADE,
  video_id uuid NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (module_id, video_id)
);

CREATE TABLE IF NOT EXISTS public.historico (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id uuid NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  progresso_segundos integer NOT NULL DEFAULT 0,
  concluido boolean NOT NULL DEFAULT false,
  atualizado_em timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, video_id)
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historico ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS courses_public_read ON public.courses;
CREATE POLICY courses_public_read ON public.courses
  FOR SELECT
  TO anon, authenticated
  USING (status = 'publicado' AND arquivado = false AND (agendado_para IS NULL OR agendado_para <= now()));

DROP POLICY IF EXISTS videos_public_read ON public.videos;
CREATE POLICY videos_public_read ON public.videos
  FOR SELECT
  TO anon, authenticated
  USING (publicado = true AND status = 'publicado' AND arquivado = false);

DROP POLICY IF EXISTS video_modules_public_read ON public.video_modules;
CREATE POLICY video_modules_public_read ON public.video_modules
  FOR SELECT
  TO anon, authenticated
  USING (ativo = true);

DROP POLICY IF EXISTS module_videos_public_read ON public.module_videos;
CREATE POLICY module_videos_public_read ON public.module_videos
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS historico_self_all ON public.historico;
CREATE POLICY historico_self_all ON public.historico
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

GRANT SELECT ON public.courses TO anon, authenticated;
GRANT SELECT ON public.videos TO anon, authenticated;
GRANT SELECT ON public.video_modules TO anon, authenticated;
GRANT SELECT ON public.module_videos TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.historico TO authenticated;

CREATE INDEX IF NOT EXISTS idx_courses_order ON public.courses(ordem);
CREATE INDEX IF NOT EXISTS idx_video_modules_course_order ON public.video_modules(course_id, ordem);
CREATE INDEX IF NOT EXISTS idx_module_videos_module_order ON public.module_videos(module_id, ordem);

INSERT INTO public.courses (slug, nome, descricao_curta, destaque, ordem)
VALUES
  ('amil', 'Amil', 'Curso rápido para processos Amil.', true, 1),
  ('bradesco-saude', 'Bradesco Saúde', 'Curso para boleto, dependentes e reembolso.', true, 2),
  ('sulamerica', 'SulAmérica', 'Curso prático de rotinas SulAmérica.', true, 3),
  ('unimed', 'Unimed', 'Curso para rotinas principais Unimed.', false, 4),
  ('odontoprev', 'Odontoprev', 'Curso para rotinas Odontoprev.', false, 5)
ON CONFLICT (slug) DO UPDATE SET
  nome = EXCLUDED.nome,
  descricao_curta = EXCLUDED.descricao_curta,
  destaque = EXCLUDED.destaque,
  ordem = EXCLUDED.ordem,
  status = 'publicado',
  arquivado = false,
  updated_at = now();

INSERT INTO public.video_modules (course_id, slug, nome, ordem)
SELECT id, slug || '-modulo-principal', 'Aulas principais', 1
FROM public.courses
ON CONFLICT (slug) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  nome = EXCLUDED.nome,
  ordem = EXCLUDED.ordem,
  ativo = true,
  updated_at = now();

INSERT INTO public.videos (slug, titulo, descricao, duracao_segundos, ordem)
VALUES
  ('amil-boleto', 'Como emitir 2ª via de boleto no portal Amil', 'Passo a passo para gerar 2ª via de boleto no portal do corretor Amil.', 360, 1),
  ('amil-dependente', 'Inclusão de dependente no contrato Amil PME', 'Como cadastrar novos dependentes em apólices Amil PME pelo portal.', 480, 2),
  ('amil-emissao', 'Emissão de contrato Amil PME do zero', 'Fluxo completo de emissão de contrato Amil PME.', 840, 3),
  ('amil-cotacao', 'Cotação rápida Amil no portal do corretor', 'Gere cotações Amil para PF e PME.', 420, 4),
  ('bradesco-boleto', 'Bradesco Saúde: como emitir boleto mensal', 'Emissão e envio de boleto mensal no portal Bradesco Saúde.', 300, 1),
  ('bradesco-dependente', 'Inclusão de dependente Bradesco Saúde', 'Documentos, prazos e envio pelo portal Bradesco Saúde.', 540, 2),
  ('bradesco-reembolso', 'Reembolso Bradesco Saúde: como solicitar pelo app', 'Tutorial completo de solicitação de reembolso Bradesco.', 480, 3),
  ('sulamerica-contrato', 'SulAmérica: emissão de contrato adesão', 'Como emitir contrato de adesão SulAmérica.', 660, 1),
  ('sulamerica-boleto', '2ª via de boleto SulAmérica em 3 cliques', 'Onde acessar e reenviar boletos SulAmérica para o cliente.', 240, 2),
  ('sulamerica-portabilidade', 'Portabilidade SulAmérica: regras e prazos', 'Como conduzir portabilidade para SulAmérica.', 720, 3),
  ('unimed-boleto', 'Unimed: como emitir 2ª via no portal', 'Acesso ao portal Unimed e geração de 2ª via de boleto.', 300, 1),
  ('unimed-reajuste', 'Reajuste anual Unimed: como explicar ao cliente', 'Tabela de reajuste Unimed e roteiro de comunicação.', 720, 2),
  ('odontoprev-boleto', 'Odontoprev: emissão de boleto e baixa', 'Como emitir e dar baixa em boletos Odontoprev.', 300, 1),
  ('odontoprev-dependente', 'Inclusão de dependente Odontoprev', 'Tutorial completo de inclusão de dependentes Odontoprev.', 360, 2),
  ('odontoprev-cancelamento', 'Cancelamento Odontoprev: passo a passo', 'Como cancelar contrato Odontoprev e prazos.', 420, 3)
ON CONFLICT (slug) DO UPDATE SET
  titulo = EXCLUDED.titulo,
  descricao = EXCLUDED.descricao,
  duracao_segundos = EXCLUDED.duracao_segundos,
  ordem = EXCLUDED.ordem,
  publicado = true,
  status = 'publicado',
  arquivado = false,
  updated_at = now();

WITH links(course_slug, video_slug, ordem) AS (
  VALUES
    ('amil', 'amil-boleto', 1),
    ('amil', 'amil-dependente', 2),
    ('amil', 'amil-emissao', 3),
    ('amil', 'amil-cotacao', 4),
    ('bradesco-saude', 'bradesco-boleto', 1),
    ('bradesco-saude', 'bradesco-dependente', 2),
    ('bradesco-saude', 'bradesco-reembolso', 3),
    ('sulamerica', 'sulamerica-contrato', 1),
    ('sulamerica', 'sulamerica-boleto', 2),
    ('sulamerica', 'sulamerica-portabilidade', 3),
    ('unimed', 'unimed-boleto', 1),
    ('unimed', 'unimed-reajuste', 2),
    ('odontoprev', 'odontoprev-boleto', 1),
    ('odontoprev', 'odontoprev-dependente', 2),
    ('odontoprev', 'odontoprev-cancelamento', 3)
)
INSERT INTO public.module_videos (module_id, video_id, ordem)
SELECT vm.id, v.id, links.ordem
FROM links
JOIN public.courses c ON c.slug = links.course_slug
JOIN public.video_modules vm ON vm.course_id = c.id
JOIN public.videos v ON v.slug = links.video_slug
ON CONFLICT (module_id, video_id) DO UPDATE SET ordem = EXCLUDED.ordem;
