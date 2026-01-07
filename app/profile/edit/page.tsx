'use client'

import React from 'react'
import Protected from '../../../components/Protected'
import ProfileForm from '../../../components/ProfileForm'

export default function EditProfilePage(){
  return (
    <Protected>
      <section className="py-12">
        <div className="max-w-2xl mx-auto">
          <ProfileForm />
        </div>
      </section>
    </Protected>
  )
}
