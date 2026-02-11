import React, { useState, useRef, useEffect } from 'react'
import { createClient } from '../lib/supabase'



interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: any[]
}

const supabase = createClient()

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setError('')

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL
      const response = await fetch(`${supabaseUrl}/functions/v1/rag_chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ question: input, top_k: 5 })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get response')
      }

      const data = await response.json()
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        sources: data.sources
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <p>Ask a question about the scriptures...</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`chat-message ${msg.role}`}>
              <div className="message-role">{msg.role === 'user' ? 'You' : 'AI'}</div>
              <div className="message-content">{msg.content}</div>
              {msg.sources && msg.sources.length > 0 && (
                <div className="message-sources">
                  <details>
                    <summary>📚 {msg.sources.length} source(s)</summary>
                    {msg.sources.map((src, i) => (
                      <div key={src.chunk_id} className="source-item">
                        <p className="source-label">Source {i}</p>
                        <p className="source-text">{src.chunk_text.substring(0, 200)}...</p>
                      </div>
                    ))}
                  </details>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && <div className="chat-error">{error}</div>}

      <div className="chat-input-group">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about dharma, karma, or any scripture topic..."
          disabled={loading}
          rows={2}
        />
        <button onClick={handleSend} disabled={loading || !input.trim()}>
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </div>
    </div>
  )
}
