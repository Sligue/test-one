'use client'

import React from 'react'
import Protected from '../../../components/Protected'
import GigForm from '../../../components/GigForm'

export default function CreateGigPage(){
  return (
    <Protected>
      <section className="py-12">
        <div className="max-w-2xl mx-auto">
          <GigForm />
        </div>
      </section>
    </Protected>
  )
}
