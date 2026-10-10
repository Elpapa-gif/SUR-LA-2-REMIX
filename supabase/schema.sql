-- ==============================================================================
-- SCHÉMA SUPABASE "SUR LA 2" - CORRIGÉ & ORDONNANCÉ
-- (Toutes les tables sont créées avant les politiques de sécurité RLS)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. CRÉATION DES TABLES (DANS L'ORDRE STRICT DES DÉPENDANCES)
-- ==============================================================================

-- Table Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    display_name TEXT NOT NULL,
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
    title TEXT DEFAULT 'Membre de la 2',
    mood_type TEXT DEFAULT 'energetic' CHECK (mood_type IN ('energetic', 'chill', 'focused', 'stressed', 'party', 'creative')),
    mood_emoji TEXT DEFAULT '⚡',
    mood_label TEXT DEFAULT 'En pleine forme',
    mood_color TEXT DEFAULT '#10B981',
    mood_custom_status TEXT,
    mood_updated_at TIMESTAMPTZ DEFAULT NOW(),
    streak_days INTEGER DEFAULT 1,
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    xp INTEGER DEFAULT 100,
    level INTEGER DEFAULT 1,
    coins INTEGER DEFAULT 150,
    equipped_badge TEXT DEFAULT 'badge_flame',
    badges TEXT[] DEFAULT ARRAY['badge_flame'],
    bio TEXT DEFAULT 'Membre actif sur la 2',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table Conversations
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('channel', 'direct')),
    topic TEXT,
    avatar TEXT,
    is_pinned BOOLEAN DEFAULT false,
    category TEXT DEFAULT 'salons' CHECK (category IN ('salons', 'groupes', 'directs')),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table Conversation Members (Créée AVANT les politiques qui y font référence)
CREATE TABLE IF NOT EXISTS public.conversation_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(conversation_id, user_id)
);

-- Table Messages
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL,
    sender_name TEXT NOT NULL,
    sender_avatar TEXT,
    sender_role TEXT DEFAULT 'member',
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'quiz', 'system', 'voice')),
    quiz_id UUID,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table Quizzes
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    time_limit_sec INTEGER DEFAULT 25,
    xp_reward INTEGER DEFAULT 105,
    coins_reward INTEGER DEFAULT 45,
    created_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_by_name TEXT DEFAULT 'Sur la 2',
    participants_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table Quiz Questions
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer INTEGER NOT NULL,
    explanation TEXT,
    order_index INTEGER DEFAULT 0
);

-- ==============================================================================
-- 2. ACTIVATION DE LA SÉCURITÉ RLS SUR TOUTES LES TABLES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 3. POLITIQUES DE SÉCURITÉ RLS (TOUTES LES TABLES EXISTENT DÉJÀ)
-- ==============================================================================

-- Profiles
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
CREATE POLICY "profiles_select_policy" ON public.profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
CREATE POLICY "profiles_insert_policy" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
CREATE POLICY "profiles_update_policy" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Conversations
DROP POLICY IF EXISTS "conversations_select_policy" ON public.conversations;
CREATE POLICY "conversations_select_policy" ON public.conversations FOR SELECT TO authenticated
    USING (
        type = 'channel' OR
        id IN (SELECT conversation_id FROM public.conversation_members WHERE user_id = auth.uid())
    );

DROP POLICY IF EXISTS "conversations_insert_policy" ON public.conversations;
CREATE POLICY "conversations_insert_policy" ON public.conversations FOR INSERT TO authenticated WITH CHECK (true);

-- Conversation Members
DROP POLICY IF EXISTS "members_select_policy" ON public.conversation_members;
CREATE POLICY "members_select_policy" ON public.conversation_members FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "members_insert_policy" ON public.conversation_members;
CREATE POLICY "members_insert_policy" ON public.conversation_members FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Messages
DROP POLICY IF EXISTS "messages_select_policy" ON public.messages;
CREATE POLICY "messages_select_policy" ON public.messages FOR SELECT TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = messages.conversation_id AND c.type = 'channel') OR
        EXISTS (SELECT 1 FROM public.conversation_members cm WHERE cm.conversation_id = messages.conversation_id AND cm.user_id = auth.uid())
    );

DROP POLICY IF EXISTS "messages_insert_policy" ON public.messages;
CREATE POLICY "messages_insert_policy" ON public.messages FOR INSERT TO authenticated WITH CHECK (true);

-- Quizzes
DROP POLICY IF EXISTS "quizzes_select_policy" ON public.quizzes;
CREATE POLICY "quizzes_select_policy" ON public.quizzes FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "quizzes_insert_policy" ON public.quizzes;
CREATE POLICY "quizzes_insert_policy" ON public.quizzes FOR INSERT TO authenticated WITH CHECK (true);

-- Quiz Questions
DROP POLICY IF EXISTS "quiz_questions_select_policy" ON public.quiz_questions;
CREATE POLICY "quiz_questions_select_policy" ON public.quiz_questions FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "quiz_questions_insert_policy" ON public.quiz_questions;
CREATE POLICY "quiz_questions_insert_policy" ON public.quiz_questions FOR INSERT TO authenticated WITH CHECK (true);

-- ==============================================================================
-- 4. FONCTION & TRIGGER DE CRÉATION AUTOMATIQUE DU PROFIL UTILISATEUR
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, display_name, avatar_url, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
        COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
        COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
        'member'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 5. DONNÉES INITIALES (SALONS DE LA COMMUNAUTÉ)
-- ==============================================================================

INSERT INTO public.conversations (id, name, type, topic, avatar, is_pinned, category)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'général - Sur la 2', 'channel', 'Le salon central de la communauté ⚡', '⚡', true, 'salons'),
    ('c2222222-2222-2222-2222-222222222222', 'le-lab-quizz', 'channel', 'Défis en direct, duels et quizz IA 🧠', '🧠', true, 'salons'),
    ('c3333333-3333-3333-3333-333333333333', 'humeurs-du-jour', 'channel', 'Partagez votre météo émotionnelle quotidienne ☀️', '🎭', false, 'salons')
ON CONFLICT (id) DO NOTHING;
