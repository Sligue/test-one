import { NextResponse } from 'next/server'
import { supabaseServer } from '../../../lib/supabaseServer'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get('user_id')
    if (!userId) return NextResponse.json({ error: 'Missing user_id' }, { status: 400 })

    const { data, error } = await supabaseServer.from('notifications').select('*').eq('user_id', userId).eq('read', false).order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ notifications: data ?? [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { user_id, type, payload } = body
    if (!user_id || !type) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const insertPayload = { user_id, type, payload: payload ?? null, read: false }
    const { data, error } = await supabaseServer.from('notifications').insert(insertPayload).select().maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ notification: data ?? null }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { notification_id } = body
    if (!notification_id) return NextResponse.json({ error: 'Missing notification_id' }, { status: 400 })

    const { data, error } = await supabaseServer.from('notifications').update({ read: true }).eq('id', notification_id).select().maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ notification: data ?? null })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
