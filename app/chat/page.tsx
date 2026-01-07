'use client'

import React from 'react'
import Protected from '../../components/Protected'

export default function ChatListPage() {
  return (
    <Protected>
      <section className="py-12">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Messages</h2>
          <p className="text-gray-600">Chat feature is integrated per gig or product. Visit a marketplace product or job to start chatting with the seller/poster.</p>
        </div>
      </section>
    </Protected>
  )
}
