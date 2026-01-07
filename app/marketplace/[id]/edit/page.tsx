'use client'

import React from 'react'
import Protected from '../../../../../components/Protected'
import EditListingForm from '../../../../../components/EditListingForm'

export default function EditListingPage({ params }: { params: { id: string } }){
  return (
    <Protected>
      <section className="py-12">
        <div className="max-w-2xl mx-auto">
          <EditListingForm productId={params.id} />
        </div>
      </section>
    </Protected>
  )
}
