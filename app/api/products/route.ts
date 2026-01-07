import { NextResponse } from 'next/server'
import { supabaseServer } from '../../../lib/supabaseServer'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const search = url.searchParams.get('search')
    const min = url.searchParams.get('minPrice')
    const max = url.searchParams.get('maxPrice')
    const limit = Number(url.searchParams.get('limit') ?? 50)

    let q = supabaseServer.from('products').select('*')

    if (search) {
      q = q.ilike('title', `%${search}%`)
    }

    if (min) q = q.gte('price', Number(min))
    if (max) q = q.lte('price', Number(max))

    const { data, error } = await q.order('created_at', { ascending: false }).limit(limit)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ products: data ?? [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { seller_id, title, description, price, image_url } = body
    if (!seller_id || !title) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const payload = { seller_id, title, description: description ?? null, price: price ?? 0, image_url: image_url ?? null }
    const { data, error } = await supabaseServer.from('products').insert(payload).select().maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ product: data ?? null }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
