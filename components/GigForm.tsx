'use client'

import React, { useState } from 'react'
import useAuth from '../lib/useAuth'
import { useRouter } from 'next/navigation'

export default function GigForm() {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState('')
  const [category, setCategory] = useState('general')
  const [deadline, setDeadline] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return alert('Sign in first')
    setLoading(true)
    try {
      const payload = { poster_id: user.id, title, description, budget: parseFloat(budget || '0'), category, deadline: deadline || null }
      const res = await fetch('/api/gigs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const json = await res.json()
      if (json?.error) throw new Error(json.error)
      router.push('/jobs')
      router.refresh()
    } catch (err: any) {
      alert(err.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h3 className="text-xl font-semibold mb-4">Post a gig</h3>
      <label className="block mb-2 text-sm">Title</label>
      <input className="w-full mb-3 p-2 border rounded" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <label className="block mb-2 text-sm">Description</label>
      <textarea className="w-full mb-3 p-2 border rounded" value={description} onChange={(e) => setDescription(e.target.value)} />
      <label className="block mb-2 text-sm">Budget (USD)</label>
      <input className="w-full mb-3 p-2 border rounded" value={budget} onChange={(e) => setBudget(e.target.value)} type="number" step="0.01" />
      <label className="block mb-2 text-sm">Category</label>
      <select className="w-full mb-3 p-2 border rounded" value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>general</option>
        <option>design</option>
        <option>writing</option>
        <option>programming</option>
        <option>marketing</option>
      </select>
      <label className="block mb-2 text-sm">Deadline (optional)</label>
      <input className="w-full mb-4 p-2 border rounded" value={deadline} onChange={(e) => setDeadline(e.target.value)} type="date" />
      <button className="w-full py-2 bg-green-600 text-white rounded" disabled={loading}>{loading ? 'Posting...' : 'Post gig'}</button>
    </form>
  )
}
