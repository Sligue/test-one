import { NextResponse } from 'next/server'
import { supabaseServer } from '../../../../lib/supabaseServer'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const { data, error } = await supabaseServer.from('gigs').select('*').eq('id', id).maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ gig: data ?? null })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await req.json()
    const updates: any = {}
    if (body.title !== undefined) updates.title = body.title
    if (body.description !== undefined) updates.description = body.description
    if (body.budget !== undefined) updates.budget = body.budget
    if (body.status !== undefined) updates.status = body.status

    const { data, error } = await supabaseServer.from('gigs').update(updates).eq('id', id).select().maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ gig: data ?? null })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const userId = req.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: gig, error: fetchErr } = await supabaseServer.from('gigs').select('poster_id').eq('id', id).maybeSingle()
    if (fetchErr || !gig) return NextResponse.json({ error: 'Gig not found' }, { status: 404 })
    if (gig.poster_id !== userId) return NextResponse.json({ error: 'Not authorized' }, { status: 403 })

    const { error } = await supabaseServer.from('gigs').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
