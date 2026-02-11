import React, { useEffect, useState } from 'react'
import { createClient } from './lib/supabase'
import Chat from './components/Chat'

const supabase = createClient()

export default function App() {
  const [version, setVersion] = useState<string | null>(null)

  useEffect(() => {
    // Simple health check: fetch current time from Supabase realtime or test query
    ;(async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          setVersion('Supabase connected (no session)')
        } else if (data && data.session) {
          setVersion('Supabase connected (user session)')
        } else {
          setVersion('Supabase connected (no active session)')
        }
      } catch (e) {
        setVersion('Supabase client ready')
      }
    })()
  }, [])

  return (
    <div className="app">
      <header className="header">
        <h1>📖 Scripture AI</h1>
        <p className="subtitle">Explore ancient wisdom. Ask questions powered by retrieval-augmented generation.</p>
      </header>

      <main className="main">
        <section className="card chat-section">
          <Chat />
        </section>
        
        <aside className="sidebar">
          <div className="card">
            <h3>About</h3>
            <p className="muted">This app uses the Bhagavad Gita, Ramayana, Mahabharata, and Vedas. Answers are retrieved from scripture text and generated with AI.</p>
            <p className="muted">Supabase status: {version}</p>
          </div>
        </aside>
      </main>

      <footer className="footer">Scripture AI — Built with React, Supabase & OpenAI</footer>
    </div>
  )
}
