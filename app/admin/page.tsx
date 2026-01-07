'use client'

import React, { useState } from 'react'
import { supabaseServer } from '../../../lib/supabaseServer'

export default async function AdminDashboard() {
  const { data: products } = await supabaseServer.from('products').select('*').order('created_at', { ascending: false }).limit(100)

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Admin Dashboard</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">ID</th>
                <th className="border p-2 text-left">Title</th>
                <th className="border p-2 text-left">Price</th>
                <th className="border p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(products ?? []).map((p: any) => (
                <AdminListingRow key={p.id} product={p} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function AdminListingRow({ product }: { product: any }) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Delete this listing?')) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/listings/${product.id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': process.env.NEXT_PUBLIC_ADMIN_KEY || '' }
      })
      const json = await res.json()
      if (json?.error) throw new Error(json.error)
      window.location.reload()
    } catch (err: any) {
      alert(err.message)
      setDeleting(false)
    }
  }

  return (
    <tr>
      <td className="border p-2 text-sm">{product.id.slice(0, 8)}</td>
      <td className="border p-2">{product.title}</td>
      <td className="border p-2">${Number(product.price).toFixed(2)}</td>
      <td className="border p-2">
        <button onClick={handleDelete} disabled={deleting} className="text-red-600 text-sm">{deleting ? 'Deleting...' : 'Delete'}</button>
      </td>
    </tr>
  )
}
