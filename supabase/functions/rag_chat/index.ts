import { serve } from "https://deno.land/std@0.195.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.27.0"

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || ''
const EMBEDDING_MODEL = Deno.env.get('EMBEDDING_MODEL') || 'text-embedding-3-small'
const LLM_MODEL = Deno.env.get('LLM_MODEL') || 'gpt-4o-mini'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'POST required' }), { status: 405 })
  }

  try {
    const reqBody = await req.json() as Record<string, unknown>
    const question = reqBody.question as string
    const top_k = reqBody.top_k as number | undefined
    if (!question) return new Response(JSON.stringify({ error: 'question required' }), { status: 400 })

    // 1) get embedding for question
    const embRes = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({ input: question, model: EMBEDDING_MODEL })
    })
    if (!embRes.ok) {
      const txt = await embRes.text()
      return new Response(JSON.stringify({ error: 'embedding failed', details: txt }), { status: 502 })
    }
    const embJson = await embRes.json()
    const queryEmbedding = embJson.data[0].embedding

    // 2) call match_chunks SQL function
    const topK = top_k || 5
    const { data: chunks, error } = await supabase.rpc('match_chunks', { query_embedding: queryEmbedding, limit_count: topK })
    if (error) {
      return new Response(JSON.stringify({ error: 'retrieval failed', details: error }), { status: 502 })
    }

    // 3) build prompt with retrieved context
    const contextText = (chunks || []).map((c: any, i: number) => `[[${i}]] ${c.chunk_text}`).join('\n\n')
    const system = `You are an assistant that answers questions using only the provided context. Provide concise answers with citations referencing the context blocks like [[0]], [[1]]. If the answer is not present, say you cannot find it.`
    const userPrompt = `Context:\n${contextText}\n\nQuestion: ${question}\nAnswer with citations.`

    // 4) call LLM to generate answer
    const completionRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: LLM_MODEL,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 700
      })
    })

    if (!completionRes.ok) {
      const txt = await completionRes.text()
      return new Response(JSON.stringify({ error: 'LLM failed', details: txt }), { status: 502 })
    }

    const completionJson = await completionRes.json()
    const answer = completionJson.choices?.[0]?.message?.content || ''

    return new Response(JSON.stringify({ answer, sources: chunks }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
