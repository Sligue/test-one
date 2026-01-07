'use client'

import React, { useState } from 'react'

export default function RatingForm({ targetId, gigId, onComplete }: { targetId: string; gigId: string; onComplete?: () => void }) {
  const [score, setScore] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { rater_id: targetId, target_id: targetId, gig_id: gigId, score: parseInt(score.toString()), comment }
      const res = await fetch('/api/ratings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const json = await res.json()
      if (json?.error) throw new Error(json.error)
      alert('Rating submitted!')
      onComplete?.()
    } catch (err: any) {
      alert(err.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-4 rounded shadow">
      <h4 className="font-semibold mb-3">Rate this worker</h4>
      <label className="block mb-2 text-sm">Score (1-5)</label>
      <select className="w-full mb-3 p-2 border rounded" value={score} onChange={(e) => setScore(parseInt(e.target.value))}>
        <option value="1">1 - Poor</option>
        <option value="2">2 - Fair</option>
        <option value="3">3 - Good</option>
        <option value="4">4 - Very Good</option>
        <option value="5">5 - Excellent</option>
      </select>
      <label className="block mb-2 text-sm">Comment</label>
      <textarea className="w-full mb-4 p-2 border rounded" value={comment} onChange={(e) => setComment(e.target.value)} />
      <button className="w-full py-2 bg-yellow-600 text-white rounded" disabled={loading}>{loading ? 'Submitting...' : 'Submit rating'}</button>
    </form>
  )
}
