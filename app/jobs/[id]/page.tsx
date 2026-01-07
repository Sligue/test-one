'use client'

import React, { useState } from 'react'
import useAuth from '../../../lib/useAuth'
import { useRouter } from 'next/navigation'
import GigApplicationForm from '../../../components/GigApplicationForm'

export default function GigPage({ params }: { params: { id: string } }){
  const id = params.id
  const { user } = useAuth()
  const [gig, setGig] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [deleting, setDeleting] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const fetchGig = async () => {
      try {
        const res = await fetch(`/api/gigs/${id}`)
        const json = await res.json()
        setGig(json?.gig ?? null)
      } finally {
        setLoading(false)
      }
    }
    fetchGig()
  }, [id])

  const isOwner = user?.id === gig?.poster_id

  const handleDelete = async () => {
    if (!confirm('Delete this gig?')) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/gigs/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': user?.id || '' }
      })
      const json = await res.json()
      if (json?.error) throw new Error(json.error)
      router.push('/jobs')
    } catch (err: any) {
      alert(err.message)
      setDeleting(false)
    }
  }

  if (loading) return <div className="py-12 text-center">Loading...</div>
  if (!gig) return <div className="py-12 text-center">Gig not found</div>

  return (
    <section className="py-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-6 rounded shadow mb-6">
          <h1 className="text-2xl font-bold mb-2">{gig.title}</h1>
          <p className="text-gray-600 mb-4">{gig.description}</p>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-2xl font-bold text-green-600">${Number(gig.budget).toFixed(2)}</span>
              <span className="ml-4 text-sm text-gray-500">Category: {gig.category}</span>
            </div>
            <span className={`text-sm px-3 py-1 rounded ${gig.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{gig.status}</span>
          </div>
          {isOwner && (
            <div className="flex gap-2 pt-4 border-t">
              <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 bg-red-600 text-white rounded text-sm">{deleting ? 'Deleting...' : 'Delete gig'}</button>
            </div>
          )}
        </div>
        {!isOwner && gig.status === 'open' && <GigApplicationForm gigId={id} />}
      </div>
    </section>
  )
}
