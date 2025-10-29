-- Criar enum para tipos de reações temáticas
CREATE TYPE public.reacao_tipo AS ENUM ('arretado', 'oxente', 'corajoso', 'sapeca');

-- Criar enum para roles de usuário
CREATE TYPE public.app_role AS ENUM ('admin', 'cangaceiro', 'cabra');

-- Tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  apelido TEXT NOT NULL UNIQUE,
  nome_completo TEXT,
  bandeira TEXT, -- frase de honra/símbolo pessoal
  biografia TEXT CHECK (char_length(biografia) <= 150),
  cidade TEXT,
  estado TEXT,
  nivel_respeito INTEGER DEFAULT 0 NOT NULL,
  foto_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Tabela de roles (separada por segurança)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role DEFAULT 'cabra' NOT NULL,
  UNIQUE(user_id, role)
);

-- Tabela de posts (Feed Raiz)
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  conteudo TEXT NOT NULL CHECK (char_length(conteudo) <= 1000),
  imagem_url TEXT,
  tipo TEXT DEFAULT 'texto' CHECK (tipo IN ('texto', 'imagem', 'audio')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Tabela de reações aos posts
CREATE TABLE public.reacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  tipo reacao_tipo NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(post_id, user_id)
);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger para profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Função para criar perfil automaticamente ao registrar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, apelido, nome_completo)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'apelido', 'cabra_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'nome_completo', '')
  );
  
  -- Atribuir role padrão
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'cabra');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger para criar perfil ao registrar usuário
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Função de segurança para verificar roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- HABILITAR RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reacoes ENABLE ROW LEVEL SECURITY;

-- POLICIES PARA PROFILES
CREATE POLICY "Perfis são visíveis para todos"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Usuários podem atualizar próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- POLICIES PARA USER_ROLES
CREATE POLICY "Roles são visíveis para todos autenticados"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (true);

-- POLICIES PARA POSTS
CREATE POLICY "Posts são visíveis para todos"
  ON public.posts FOR SELECT
  USING (true);

CREATE POLICY "Usuários autenticados podem criar posts"
  ON public.posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar próprios posts"
  ON public.posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- POLICIES PARA REAÇÕES
CREATE POLICY "Reações são visíveis para todos"
  ON public.reacoes FOR SELECT
  USING (true);

CREATE POLICY "Usuários autenticados podem reagir"
  ON public.reacoes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem remover próprias reações"
  ON public.reacoes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Índices para performance
CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_reacoes_post_id ON public.reacoes(post_id);
CREATE INDEX idx_profiles_nivel_respeito ON public.profiles(nivel_respeito DESC);