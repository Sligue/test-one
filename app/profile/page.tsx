'use client'

import React from 'react'
import useAuth from '../../lib/useAuth'
import Protected from '../../components/Protected'

export default function ProfilePage(){
  const { user, loading, signOut } = useAuth()

  if (loading) return <div>Loading...</div>

  return (
    <Protected>
      <section className="py-12">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-semibold mb-4">Your profile</h2>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>ID:</strong> {user?.id}</p>
          <div className="mt-4">
            <button onClick={() => signOut()} className="px-4 py-2 bg-red-600 text-white rounded">Sign out</button>
          </div>
        </div>
      </section>
    </Protected>
  )
}
