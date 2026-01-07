import { NextResponse } from 'next/server'
import { supabaseServer } from '../../../../../lib/supabaseServer'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const gigId = params.id
    const body = await req.json()
    const { worker_id, proposal } = body
    if (!worker_id) return NextResponse.json({ error: 'Missing worker_id' }, { status: 400 })

    const payload = { gig_id: gigId, worker_id, proposal: proposal ?? null, status: 'pending' }
    const { data, error } = await supabaseServer.from('gig_applications').insert(payload).select().maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ application: data ?? null }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const gigId = params.id
    const { data, error } = await supabaseServer.from('gig_applications').select('*').eq('gig_id', gigId).order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ applications: data ?? [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
