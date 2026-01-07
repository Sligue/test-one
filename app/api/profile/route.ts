import { NextResponse } from 'next/server'
import { supabaseServer } from '../../../lib/supabaseServer'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const { data, error } = await supabaseServer.from('profiles').select('*').eq('id', id).maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ profile: data ?? null })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  // maintain backward compatibility with previous upsert POST behavior
  try {
    const body = await req.json()
    const { id, username, full_name, avatar_url, bio } = body

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const payload = {
      id,
      username: username ?? null,
      full_name: full_name ?? null,
      avatar_url: avatar_url ?? null,
      bio: bio ?? null,
    }

    const { data, error } = await supabaseServer.from('profiles').upsert(payload, { returning: 'representation' })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ profile: data?.[0] ?? null })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { id, username, full_name, avatar_url, bio } = body

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    // basic server-side validation
    if (username && username.length > 30) return NextResponse.json({ error: 'Username too long' }, { status: 400 })
    if (full_name && full_name.length > 80) return NextResponse.json({ error: 'Full name too long' }, { status: 400 })

    const updates: any = {}
    if (username !== undefined) updates.username = username
    if (full_name !== undefined) updates.full_name = full_name
    if (avatar_url !== undefined) updates.avatar_url = avatar_url
    if (bio !== undefined) updates.bio = bio

    const { data, error } = await supabaseServer.from('profiles').update(updates).eq('id', id).select().maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ profile: data ?? null })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
