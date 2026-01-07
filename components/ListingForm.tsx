'use client'

import React, { useState } from 'react'
import useAuth from '../lib/useAuth'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function ListingForm() {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const uploadImage = async () => {
    if (!file || !user) return null
    const path = `products/${user.id}/${Date.now()}_${file.name}`
    const { data, error } = await supabase.storage.from('products').upload(path, file, { upsert: true })
    if (error) throw error
    const publicUrl = supabase.storage.from('products').getPublicUrl(path).data.publicUrl
    return publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return alert('Sign in first')
    setLoading(true)
    try {
      let image_url = null
      if (file) image_url = await uploadImage()

      const payload = { seller_id: user.id, title, description, price: parseFloat(price || '0'), image_url }
      const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const json = await res.json()
      if (json?.error) throw new Error(json.error)
      router.push('/marketplace')
      router.refresh()
    } catch (err: any) {
      alert(err.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h3 className="text-xl font-semibold mb-4">Create listing</h3>
      <label className="block mb-2 text-sm">Title</label>
      <input className="w-full mb-3 p-2 border rounded" value={title} onChange={(e)=>setTitle(e.target.value)} required />
      <label className="block mb-2 text-sm">Description</label>
      <textarea className="w-full mb-3 p-2 border rounded" value={description} onChange={(e)=>setDescription(e.target.value)} />
      <label className="block mb-2 text-sm">Price (USD)</label>
      <input className="w-full mb-3 p-2 border rounded" value={price} onChange={(e)=>setPrice(e.target.value)} type="number" step="0.01" />
      <label className="block mb-2 text-sm">Image</label>
      <input className="w-full mb-4" type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0] ?? null)} />
      <button className="w-full py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading ? 'Creating...' : 'Create listing'}</button>
    </form>
  )
}
