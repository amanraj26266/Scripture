-- Scripture AI - Complete Database Schema Migration
-- Run this in Supabase SQL Editor or via migrations system
-- Date: 2026-02-12

-- ============================================
-- 1. Enable Vector Extension (for embeddings)
-- ============================================
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- 2. Create Core Tables
-- ============================================

CREATE TABLE IF NOT EXISTS works (
  work_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  language text,
  description text,
  license text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(title)
);

CREATE TABLE IF NOT EXISTS documents (
  doc_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id uuid REFERENCES works(work_id) ON DELETE CASCADE,
  translator text,
  edition text,
  source_url text,
  created_at timestamptz DEFAULT now()
);

-- Create chunks table with pgvector support
CREATE TABLE IF NOT EXISTS chunks (
  chunk_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doc_id uuid REFERENCES documents(doc_id) ON DELETE CASCADE,
  chunk_text text NOT NULL,
  start_pos int,
  end_pos int,
  embedding vector(1536),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- 3. Create Indexes for Performance
-- ============================================

-- Index for vector similarity search (if pgvector is available)
CREATE INDEX IF NOT EXISTS chunks_embedding_idx 
ON chunks USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- Index for document lookups
CREATE INDEX IF NOT EXISTS chunks_doc_id_idx 
ON chunks(doc_id);

-- Index for metadata queries
CREATE INDEX IF NOT EXISTS chunks_metadata_idx 
ON chunks USING GIN(metadata);

-- ============================================
-- 4. Create Match Function (for RAG retrieval)
-- ============================================

CREATE OR REPLACE FUNCTION match_chunks(
  query_embedding vector(1536),
  limit_count int DEFAULT 5
)
RETURNS TABLE(
  chunk_id uuid,
  chunk_text text,
  metadata jsonb,
  distance float
) AS $$
  SELECT 
    c.chunk_id,
    c.chunk_text,
    c.metadata,
    (c.embedding <-> query_embedding) AS distance
  FROM chunks c
  WHERE c.embedding IS NOT NULL
  ORDER BY c.embedding <-> query_embedding
  LIMIT limit_count;
$$ LANGUAGE SQL STABLE;

-- ============================================
-- 5. Create Users & Sessions Tables (for auth)
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text,
  used_chunk_ids uuid[] DEFAULT '{}',
  timestamp timestamptz DEFAULT now()
);

-- ============================================
-- 6. Create Bookmarks Table (for user preferences)
-- ============================================

CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  chunk_id uuid REFERENCES chunks(chunk_id) ON DELETE CASCADE,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- 7. Grant Permissions (for Supabase Auth)
-- ============================================

-- Allow anonymous readers
GRANT SELECT ON works TO anon;
GRANT SELECT ON documents TO anon;
GRANT SELECT ON chunks TO anon;

-- Allow authenticated users to create their own data
GRANT SELECT, INSERT, UPDATE ON users TO authenticated;
GRANT SELECT, INSERT ON user_queries TO authenticated;
GRANT SELECT, INSERT, DELETE ON bookmarks TO authenticated;

-- Allow service role (Edge Functions) full access
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- ============================================
-- 8. Insert Sample Data (Bhagavad Gita metadata)
-- ============================================

INSERT INTO works (title, language, description, license)
VALUES (
  'Bhagavad Gita',
  'Sanskrit/English',
  'The Bhagavad Gita is a 700-verse Hindu scripture that is part of the epic Mahabharata.',
  'Public Domain / Licensed Translations'
)
ON CONFLICT (title) DO NOTHING;

-- ============================================
-- Migration Complete
-- ============================================
-- The following tables are now available:
-- - works: Metadata about scriptures
-- - documents: Editions and translations
-- - chunks: Text passages with embeddings (vectors)
-- - users: User accounts
-- - user_queries: Query history for auditing
-- - bookmarks: User bookmarks and notes
--
-- Ready for RAG ingestion!
