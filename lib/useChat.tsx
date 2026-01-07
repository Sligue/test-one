'use client'

import React, { useEffect, useState } from 'react'
import useAuth from '../lib/useAuth'
import { supabase } from '../lib/supabaseClient'

interface Message {
  id: string
  room_id: string
  sender_id: string
  content: string
  created_at: string
}

export default function useChat(roomId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!roomId) return

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages?room_id=${roomId}&limit=100`)
        const json = await res.json()
        setMessages(json?.messages ?? [])
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()

    // subscribe to real-time updates
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [roomId])

  const sendMessage = async (content: string, senderId: string) => {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_id: roomId, sender_id: senderId, content })
      })
      const json = await res.json()
      if (json?.error) throw new Error(json.error)
      return json?.message
    } catch (err: any) {
      throw new Error(err.message || String(err))
    }
  }

  return { messages, loading, sendMessage }
}
