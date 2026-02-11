-- Create core tables for scripture ingestion
-- Run this in Supabase SQL editor or via psql (requires appropriate privileges)

-- Enable pgvector if available (recommended):
-- CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS works (
  work_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  language text,
  description text,
  license text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS documents (
  doc_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id uuid REFERENCES works(work_id) ON DELETE CASCADE,
  translator text,
  edition text,
  source_url text,
  created_at timestamptz DEFAULT now()
);

-- If pgvector is enabled, use vector; otherwise fall back to float8[]
DO $$
BEGIN
  IF EXISTS(SELECT 1 FROM pg_extension WHERE extname='vector') THEN
    CREATE TABLE IF NOT EXISTS chunks (
      chunk_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      doc_id uuid REFERENCES documents(doc_id) ON DELETE CASCADE,
      chunk_text text,
      start_pos int,
      end_pos int,
      embedding vector(1536),
      metadata jsonb,
      created_at timestamptz DEFAULT now()
    );
  ELSE
    CREATE TABLE IF NOT EXISTS chunks (
      chunk_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      doc_id uuid REFERENCES documents(doc_id) ON DELETE CASCADE,
      chunk_text text,
      start_pos int,
      end_pos int,
      embedding float8[],
      metadata jsonb,
      created_at timestamptz DEFAULT now()
    );
  END IF;
END$$;
