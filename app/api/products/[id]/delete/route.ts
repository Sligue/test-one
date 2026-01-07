import { NextResponse } from 'next/server'
import { supabaseServer } from '../../../../../lib/supabaseServer'

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const userId = req.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // verify seller ownership
    const { data: product, error: fetchErr } = await supabaseServer.from('products').select('seller_id').eq('id', id).maybeSingle()
    if (fetchErr || !product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    if (product.seller_id !== userId) return NextResponse.json({ error: 'Not authorized' }, { status: 403 })

    const { error } = await supabaseServer.from('products').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
