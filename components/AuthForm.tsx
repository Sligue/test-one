'use client'

import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function AuthForm({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        // Supabase may require email confirmation depending on your project settings
        router.push('/')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/')
      }
    } catch (err: any) {
      setError(err.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h3 className="text-xl font-semibold mb-4">{mode === 'signup' ? 'Create account' : 'Sign in'}</h3>
      {error && <div className="text-red-600 mb-3">{error}</div>}
      <label className="block mb-2 text-sm">Email</label>
      <input className="w-full mb-3 p-2 border rounded" value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required />
      <label className="block mb-2 text-sm">Password</label>
      <input className="w-full mb-4 p-2 border rounded" value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required />
      <button className="w-full py-2 bg-blue-600 text-white rounded" disabled={loading}>
        {loading ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Sign in'}
      </button>
    </form>
  )
}
