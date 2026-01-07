'use client'

import React, { useEffect, useState } from 'react'
import useAuth from '../lib/useAuth'

interface Notification {
  id: string
  user_id: string
  type: string
  payload: any
  read: boolean
  created_at: string
}

export default function useNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`/api/notifications?user_id=${user.id}`)
        const json = await res.json()
        setNotifications(json?.notifications ?? [])
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()

    // poll for new notifications every 5 seconds (alternative to websockets)
    const interval = setInterval(fetchNotifications, 5000)

    return () => clearInterval(interval)
  }, [user])

  const markAsRead = async (notificationId: string) => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification_id: notificationId })
      })
      const json = await res.json()
      if (json?.error) throw new Error(json.error)
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
    } catch (err: any) {
      throw new Error(err.message || String(err))
    }
  }

  return { notifications, loading, markAsRead }
}
