#!/usr/bin/env node
/**
 * Simple ingestion script for Bhagavad Gita.
 *
 * Requirements:
 * - Add your Bhagavad Gita plaintext at `data/bhagavad_gita.txt`
 * - Set environment variables (see .env.example). This script uses the
 *   SUPABASE_SERVICE_ROLE_KEY to write to Supabase.
 *
 * Usage:
 *   node scripts/ingest_bhagavad_gita.js
 */

import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-3-small'

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Supabase URL or service role key missing. Set SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}
if (!OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY missing in env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

function chunkText(text, wordsPerChunk = 500, overlap = 50) {
  const words = text.split(/\s+/)
  const chunks = []
  let i = 0
  while (i < words.length) {
    const start = Math.max(0, i - overlap)
    const slice = words.slice(start, i + wordsPerChunk)
    chunks.push({ text: slice.join(' '), start_pos: start, end_pos: Math.min(words.length, i + wordsPerChunk) })
    i += wordsPerChunk
  }
  return chunks
}

async function embed(text) {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({ input: text, model: EMBEDDING_MODEL })
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`Embedding API error: ${res.status} ${txt}`)
  }
  const j = await res.json()
  return j.data[0].embedding
}

async function main() {
  const dataPath = path.resolve(process.cwd(), 'data', 'bhagavad_gita.txt')
  if (!fs.existsSync(dataPath)) {
    console.error('Add the Bhagavad Gita plaintext to data/bhagavad_gita.txt and re-run')
    process.exit(1)
  }

  const raw = fs.readFileSync(dataPath, 'utf8')
  const title = 'Bhagavad Gita'

  // upsert work
  const { data: workData, error: workErr } = await supabase.from('works').upsert({ title, language: 'Sanskrit/EN' }, { onConflict: ['title'] }).select().single()
  if (workErr) {
    console.error('Failed to upsert work', workErr)
    process.exit(1)
  }
  const work_id = workData.work_id

  // create document
  const { data: docData, error: docErr } = await supabase.from('documents').insert([{ work_id, translator: null, edition: 'original', source_url: null }]).select().single()
  if (docErr) {
    console.error('Failed to create document', docErr)
    process.exit(1)
  }
  const doc_id = docData.doc_id

  const chunks = chunkText(raw, 500, 50)

  console.log(`Preparing ${chunks.length} chunks...`)

  for (let i = 0; i < chunks.length; i++) {
    const c = chunks[i]
    try {
      const embedding = await embed(c.text)
      // Supabase pgvector expects arrays or vector type. We'll insert embedding as an array (float8[])
      const payload = {
        doc_id,
        chunk_text: c.text,
        start_pos: c.start_pos,
        end_pos: c.end_pos,
        embedding: embedding,
        metadata: { chunk_index: i }
      }
      const { error: insErr } = await supabase.from('chunks').insert([payload])
      if (insErr) {
        console.error('Insert chunk error', insErr)
      } else {
        console.log(`Inserted chunk ${i + 1}/${chunks.length}`)
      }
    } catch (e) {
      console.error('Embedding error for chunk', i, e)
    }
  }

  console.log('Ingestion complete.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
