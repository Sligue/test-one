import { NextResponse } from 'next/server'
import { supabaseServer } from '../../../../../../lib/supabaseServer'

export async function PATCH(req: Request, { params }: { params: { id: string; appId: string } }) {
  try {
    const appId = params.appId
    const body = await req.json()
    const { status } = body
    if (!status) return NextResponse.json({ error: 'Missing status' }, { status: 400 })

    const { data, error } = await supabaseServer.from('gig_applications').update({ status }).eq('id', appId).select().maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ application: data ?? null })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
