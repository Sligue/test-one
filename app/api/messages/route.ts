import { NextResponse } from 'next/server'
import { supabaseServer } from '../../../lib/supabaseServer'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const roomId = url.searchParams.get('room_id')
    const limit = Number(url.searchParams.get('limit') ?? 50)

    if (!roomId) return NextResponse.json({ error: 'Missing room_id' }, { status: 400 })

    const { data, error } = await supabaseServer.from('messages').select('*').eq('room_id', roomId).order('created_at', { ascending: true }).limit(limit)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ messages: data ?? [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { room_id, sender_id, content } = body
    if (!room_id || !sender_id || !content) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const payload = { room_id, sender_id, content }
    const { data, error } = await supabaseServer.from('messages').insert(payload).select().maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ message: data ?? null }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
