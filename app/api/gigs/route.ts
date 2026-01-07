import { NextResponse } from 'next/server'
import { supabaseServer } from '../../../lib/supabaseServer'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const search = url.searchParams.get('search')
    const minBudget = url.searchParams.get('minBudget')
    const maxBudget = url.searchParams.get('maxBudget')
    const status = url.searchParams.get('status')
    const limit = Number(url.searchParams.get('limit') ?? 50)

    let q = supabaseServer.from('gigs').select('*')

    if (search) q = q.ilike('title', `%${search}%`)
    if (minBudget) q = q.gte('budget', Number(minBudget))
    if (maxBudget) q = q.lte('budget', Number(maxBudget))
    if (status) q = q.eq('status', status)

    const { data, error } = await q.order('created_at', { ascending: false }).limit(limit)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ gigs: data ?? [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { poster_id, title, description, budget, category, deadline } = body
    if (!poster_id || !title) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const payload = { poster_id, title, description: description ?? null, budget: budget ?? 0, category: category ?? null, deadline: deadline ?? null, status: 'open' }
    const { data, error } = await supabaseServer.from('gigs').insert(payload).select().maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ gig: data ?? null }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
