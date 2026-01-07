'use client'

import React from 'react'
import Protected from '../../../components/Protected'
import ListingForm from '../../../components/ListingForm'

export default function CreateListingPage(){
  return (
    <Protected>
      <section className="py-12">
        <div className="max-w-2xl mx-auto">
          <ListingForm />
        </div>
      </section>
    </Protected>
  )
}
