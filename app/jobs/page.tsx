import React from 'react'
import { supabaseServer } from '../../lib/supabaseServer'
import GigCard from '../../components/GigCard'
import Link from 'next/link'

export default async function JobsPage({
  searchParams
}: {
  searchParams: { search?: string; minBudget?: string; maxBudget?: string; status?: string }
}){
  let q = supabaseServer.from('gigs').select('*')
  
  if (searchParams.search) {
    q = q.ilike('title', `%${searchParams.search}%`)
  }
  if (searchParams.minBudget) q = q.gte('budget', Number(searchParams.minBudget))
  if (searchParams.maxBudget) q = q.lte('budget', Number(searchParams.maxBudget))
  if (searchParams.status) q = q.eq('status', searchParams.status)

  const { data } = await q.order('created_at', { ascending: false }).limit(50)
  const gigs = data ?? []

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Jobs & Gigs</h2>
        <Link href="/jobs/create" className="px-4 py-2 bg-green-600 text-white rounded">Post a gig</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gigs.map((g: any) => (
          <GigCard key={g.id} gig={g} />
        ))}
      </div>
    </section>
  )
}
