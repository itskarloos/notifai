"use client"

import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function StudentAssistant() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<string>('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!input.trim()) return

    setLoading(true)
    setMessages('')

    try {
      const response = await fetch('/api/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: input }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      
      if (!reader) throw new Error('No reader available')

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        // Decode the chunk and append it directly to the messages
        const chunk = decoder.decode(value, { stream: true })
        try {
          const parsed = JSON.parse(chunk)
          setMessages(prev => prev + parsed.result)
        } catch (e) {
          // Handle partial JSON chunks by just appending the raw text
          setMessages(prev => prev + chunk)
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
      setInput('')
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start p-8">
      <div className="w-full max-w-2xl space-y-8 pt-12">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-light text-gray-900">Notifai Assistant</h1>
          <p className="text-gray-500 text-sm">Ask any computer science question</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question here..."
              className="pr-12 h-14 rounded-lg w-full border-gray-200 focus:border-gray-300 focus:ring-0 transition-colors"
              aria-label="Computer science question input"
            />
            <Button 
              type="submit" 
              size="sm" 
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg w-10 h-10 p-0 bg-gray-900 hover:bg-gray-800 transition-colors"
              disabled={loading}
              aria-label="Submit question"
            >
              <Send className="h-4 w-4 text-white" />
            </Button>
          </div>
        </form>

        {messages && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{messages}</p>
          </div>
        )}
      </div>
    </div>
  )
}

