'use client'

import React, { useEffect, useState } from 'react'
import useAuth from '../lib/useAuth'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function EditListingForm({ productId }: { productId: string }) {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`)
        const json = await res.json()
        if (json?.product) {
          setTitle(json.product.title)
          setDescription(json.product.description ?? '')
          setPrice(json.product.price ?? '')
          setImageUrl(json.product.image_url)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [productId])

  const uploadImage = async () => {
    if (!file || !user) return null
    const path = `products/${user.id}/${Date.now()}_${file.name}`
    const { data, error } = await supabase.storage.from('products').upload(path, file, { upsert: true })
    if (error) throw error
    return supabase.storage.from('products').getPublicUrl(path).data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      let image_url = imageUrl
      if (file) image_url = await uploadImage()

      const payload = { title, description, price: parseFloat(price || '0'), image_url }
      const res = await fetch(`/api/products/${productId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const json = await res.json()
      if (json?.error) throw new Error(json.error)
      router.push(`/marketplace/${productId}`)
      router.refresh()
    } catch (err: any) {
      alert(err.message || String(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h3 className="text-xl font-semibold mb-4">Edit listing</h3>
      <label className="block mb-2 text-sm">Title</label>
      <input className="w-full mb-3 p-2 border rounded" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <label className="block mb-2 text-sm">Description</label>
      <textarea className="w-full mb-3 p-2 border rounded" value={description} onChange={(e) => setDescription(e.target.value)} />
      <label className="block mb-2 text-sm">Price (USD)</label>
      <input className="w-full mb-3 p-2 border rounded" value={price} onChange={(e) => setPrice(e.target.value)} type="number" step="0.01" />
      <label className="block mb-2 text-sm">Image</label>
      {imageUrl && <img src={imageUrl} alt="product" className="w-32 h-32 object-cover rounded mb-2" />}
      <input className="w-full mb-4" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <button className="w-full py-2 bg-blue-600 text-white rounded" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button>
    </form>
  )
}
