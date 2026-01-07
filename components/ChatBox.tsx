'use client'

import React, { useState } from 'react'
import useChat from '../lib/useChat'
import useAuth from '../lib/useAuth'

export default function ChatBox({ roomId }: { roomId: string }) {
  const { user } = useAuth()
  const { messages, loading, sendMessage } = useChat(roomId)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !user) return
    setSending(true)
    try {
      await sendMessage(input, user.id)
      setInput('')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSending(false)
    }
  }

  if (loading) return <div className="text-center py-4">Loading messages...</div>

  return (
    <div className="flex flex-col h-96 bg-white border rounded">
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No messages yet</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`mb-3 ${msg.sender_id === user?.id ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block px-3 py-2 rounded ${msg.sender_id === user?.id ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                {msg.content}
              </span>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSend} className="p-3 border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded"
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded" disabled={sending}>
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  )
}
