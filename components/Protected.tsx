'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuth from '../lib/useAuth'

export default function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.push('/signin')
  }, [loading, user, router])

  if (loading) return <div>Loading...</div>
  if (!user) return null

  return <>{children}</>
}
