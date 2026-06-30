"use client"

import { useState, useEffect, useRef } from 'react'
import { Send, Sparkles, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/index'
import Link from 'next/link'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTIONS = [
  'What is an annual report and why does it matter?',
  'Generate a checklist for starting an LLC',
  'How does the Document Vault work?',
  'Explain the difference between an LLC and S-Corp',
]

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [locked, setLocked] = useState(false)
  const [sessionId] = useState(() => `session-${Date.now()}`)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return

    const userMessage: Message = { role: 'user', content: text }
    setMessages(m => [...m, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          sessionId,
          history: messages,
        }),
      })

      const data = await res.json()

      if (res.status === 403) {
        setLocked(true)
        setMessages(m => m.slice(0, -1))
        return
      }

      if (!res.ok) {
        setMessages(m => [...m, { role: 'assistant', content: `Error: ${data.error}` }])
        return
      }

      setMessages(m => [...m, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  if (locked) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md text-center">
          <CardContent className="p-8">
            <div className="w-12 h-12 bg-[#EEF2FF] rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-[#1E3A5F]" />
            </div>
            <h2 className="font-bold text-gray-900 mb-2">AI Assistant is a Pro feature</h2>
            <p className="text-sm text-gray-500 mb-6">
              Upgrade your plan to unlock the AI assistant, unlimited deadlines, and more storage.
            </p>
            <Link href="/pricing">
              <Button variant="navy">View plans</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#1E3A5F]" />
          AI Assistant
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Ask about platform features, get checklists, or general business setup info
        </p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto bg-white border border-gray-100 rounded-xl p-4 mb-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-8">
            <Sparkles className="w-8 h-8 text-gray-300 mb-3" />
            <p className="text-sm text-gray-500 mb-6">Ask me anything about ComplyFlow or general business compliance topics</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-left text-xs p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-[#1E3A5F] text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-2.5 text-sm text-gray-400">
                  Thinking...
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <form
        onSubmit={e => { e.preventDefault(); sendMessage(input) }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 h-11 rounded-lg border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
        />
        <Button type="submit" variant="navy" disabled={loading || !input.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
      <p className="text-xs text-gray-400 mt-2 text-center">
        ⚠️ This assistant does not provide legal, tax, or financial advice. Consult a qualified professional for your specific situation.
      </p>
    </div>
  )
}
