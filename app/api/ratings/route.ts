import { NextResponse } from 'next/server'
import { supabaseServer } from '../../../../lib/supabaseServer'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { rater_id, target_id, gig_id, score, comment } = body
    if (!rater_id || !target_id || !score) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const payload = { rater_id, target_id, gig_id: gig_id ?? null, score, comment: comment ?? null }
    const { data, error } = await supabaseServer.from('ratings').insert(payload).select().maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ rating: data ?? null }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const targetId = url.searchParams.get('target_id')
    if (!targetId) return NextResponse.json({ error: 'Missing target_id' }, { status: 400 })

    const { data, error } = await supabaseServer.from('ratings').select('*').eq('target_id', targetId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ratings: data ?? [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
