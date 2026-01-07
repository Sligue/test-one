'use client'

import React, { useState } from 'react'
import useAuth from '../lib/useAuth'

export default function GigApplicationForm({ gigId }: { gigId: string }) {
  const { user } = useAuth()
  const [proposal, setProposal] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return alert('Sign in first')
    setLoading(true)
    try {
      const payload = { worker_id: user.id, proposal }
      const res = await fetch(`/api/gigs/${gigId}/applications`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const json = await res.json()
      if (json?.error) throw new Error(json.error)
      alert('Application submitted!')
      setProposal('')
      window.location.reload()
    } catch (err: any) {
      alert(err.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-blue-50 p-4 rounded mb-4">
      <h4 className="font-semibold mb-3">Apply for this gig</h4>
      <textarea className="w-full mb-3 p-2 border rounded" value={proposal} onChange={(e) => setProposal(e.target.value)} placeholder="Tell them why you're a good fit..." />
      <button className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading ? 'Submitting...' : 'Submit application'}</button>
    </form>
  )
}
