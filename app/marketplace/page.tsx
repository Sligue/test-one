import React from 'react'
import { supabaseServer } from '../../lib/supabaseServer'
import ProductCard from '../../components/ProductCard'
import Link from 'next/link'
import SearchBar from '../../components/SearchBar'

export default async function MarketplacePage({
  searchParams
}: {
  searchParams: { search?: string; minPrice?: string; maxPrice?: string }
}){
  let q = supabaseServer.from('products').select('*')
  
  if (searchParams.search) {
    q = q.ilike('title', `%${searchParams.search}%`)
  }
  if (searchParams.minPrice) q = q.gte('price', Number(searchParams.minPrice))
  if (searchParams.maxPrice) q = q.lte('price', Number(searchParams.maxPrice))

  const { data } = await q.order('created_at', { ascending: false }).limit(50)
  const products = data ?? []

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Marketplace</h2>
        <Link href="/marketplace/create" className="px-4 py-2 bg-blue-600 text-white rounded">Create listing</Link>
      </div>
      <SearchBar />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p: any) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}
