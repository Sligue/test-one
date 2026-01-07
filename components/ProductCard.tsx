'use client'

import React from 'react'
import Link from 'next/link'

export default function ProductCard({ product }: { product: any }) {
  return (
    <article className="border rounded overflow-hidden shadow-sm">
      {product.image_url && <img src={product.image_url} alt={product.title} className="w-full h-48 object-cover" />}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1"><Link href={`/marketplace/${product.id}`}>{product.title}</Link></h3>
        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold">${Number(product.price).toFixed(2)}</span>
          <Link href={`/marketplace/${product.id}`} className="text-blue-600 text-sm">View</Link>
        </div>
      </div>
    </article>
  )
}
