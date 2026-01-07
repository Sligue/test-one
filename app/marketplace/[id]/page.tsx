'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import useAuth from '../../../lib/useAuth'
import { useRouter } from 'next/navigation'

export default function ProductPage({ params }: { params: { id: string } }){
  const id = params.id
  const { user } = useAuth()
  const router = useRouter()
  const [product, setProduct] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [deleting, setDeleting] = React.useState(false)

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`)
        const json = await res.json()
        setProduct(json?.product ?? null)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const isOwner = user?.id === product?.seller_id

  const handleDelete = async () => {
    if (!confirm('Delete this listing?')) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/products/${id}/delete`, {
        method: 'DELETE',
        headers: { 'x-user-id': user?.id || '' }
      })
      const json = await res.json()
      if (json?.error) throw new Error(json.error)
      router.push('/marketplace')
    } catch (err: any) {
      alert(err.message)
      setDeleting(false)
    }
  }

  if (loading) return <div className="py-12 text-center">Loading...</div>
  if (!product) return <div className="py-12 text-center">Product not found</div>

  return (
    <section className="py-12">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        {product.image_url && <img src={product.image_url} alt={product.title} className="w-full h-64 object-cover mb-4 rounded" />}
        <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <div className="flex items-center justify-between mb-4">
          <div className="text-xl font-bold">${Number(product.price).toFixed(2)}</div>
          <Link href="/marketplace" className="text-sm text-blue-600">Back to marketplace</Link>
        </div>
        {isOwner && (
          <div className="flex gap-2 pt-4 border-t">
            <Link href={`/marketplace/${id}/edit`} className="px-4 py-2 bg-yellow-500 text-white rounded text-sm">Edit</Link>
            <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 bg-red-600 text-white rounded text-sm">{deleting ? 'Deleting...' : 'Delete'}</button>
          </div>
        )}
      </div>
    </section>
  )
}
