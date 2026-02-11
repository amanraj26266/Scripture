-- Create a SQL function to match nearest chunks by embedding using pgvector
-- Requires pgvector extension. Run after migrations/create_tables.sql

CREATE OR REPLACE FUNCTION match_chunks(query_embedding vector, limit_count int DEFAULT 5)
RETURNS TABLE(chunk_id uuid, chunk_text text, metadata jsonb, distance float) AS $$
  SELECT chunk_id, chunk_text, metadata, (embedding <-> query_embedding) AS distance
  FROM chunks
  ORDER BY embedding <-> query_embedding
  LIMIT limit_count;
$$ LANGUAGE SQL STABLE;
