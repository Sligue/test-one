import { NextResponse } from 'next/server'
import { supabaseServer } from '../../../../../lib/supabaseServer'

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const adminKey = req.headers.get('x-admin-key')
    if (adminKey !== process.env.ADMIN_KEY) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const id = params.id
    const { error } = await supabaseServer.from('products').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
