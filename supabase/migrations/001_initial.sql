-- ============================================================
-- AI Nav — Initial Schema
-- Run in Supabase SQL Editor or via Supabase CLI
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. tools ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tools (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text UNIQUE NOT NULL,
  name          text NOT NULL,
  category      text NOT NULL,
  subcategory   text,
  description   text,
  website_url   text,
  logo_url      text,
  rating        numeric(3,1),
  is_free       boolean NOT NULL DEFAULT false,
  has_free_tier boolean NOT NULL DEFAULT false,
  pricing_note  text,
  tags          text[],
  featured      boolean NOT NULL DEFAULT false,
  published     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- ── 2. articles ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS articles (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text UNIQUE NOT NULL,
  title         text NOT NULL,
  description   text,
  category      text,
  lang          text NOT NULL DEFAULT 'zh',
  content_type  text NOT NULL DEFAULT 'static' CHECK (content_type IN ('static','db')),
  static_file   text,
  html_content  text,
  cover_image   text,
  published     boolean NOT NULL DEFAULT true,
  featured      boolean NOT NULL DEFAULT false,
  view_count    integer NOT NULL DEFAULT 0,
  published_at  timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('simple',
      coalesce(title, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      coalesce(category, '')
    )
  ) STORED
);

CREATE INDEX IF NOT EXISTS articles_search_idx ON articles USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS articles_category_idx ON articles (category);
CREATE INDEX IF NOT EXISTS articles_published_idx ON articles (published, published_at DESC);

-- ── 3. tool_submissions ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS tool_submissions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_name       text NOT NULL,
  website_url     text NOT NULL,
  description     text,
  submitter_email text,
  status          text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  admin_note      text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ── 4. user_bookmarks ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_bookmarks (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id    uuid NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, tool_id)
);

CREATE INDEX IF NOT EXISTS bookmarks_user_idx ON user_bookmarks (user_id);

-- ── 5. page_views ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS page_views (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS page_views_path_idx ON page_views (path);
CREATE INDEX IF NOT EXISTS page_views_created_idx ON page_views (created_at DESC);

-- ── Auto-update updated_at ───────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tools_updated_at    BEFORE UPDATE ON tools    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Row Level Security ───────────────────────────────────────
ALTER TABLE tools            ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bookmarks   ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views       ENABLE ROW LEVEL SECURITY;

-- tools: anyone can read published tools
CREATE POLICY "tools_public_read" ON tools FOR SELECT USING (published = true);

-- articles: anyone can read published articles
CREATE POLICY "articles_public_read" ON articles FOR SELECT USING (published = true);

-- tool_submissions: anyone can insert; only service role can read/update
CREATE POLICY "submissions_insert" ON tool_submissions FOR INSERT WITH CHECK (true);

-- user_bookmarks: users can manage their own bookmarks
CREATE POLICY "bookmarks_select" ON user_bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "bookmarks_insert" ON user_bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bookmarks_delete" ON user_bookmarks FOR DELETE USING (auth.uid() = user_id);

-- page_views: anyone can insert; service role reads
CREATE POLICY "pageviews_insert" ON page_views FOR INSERT WITH CHECK (true);
