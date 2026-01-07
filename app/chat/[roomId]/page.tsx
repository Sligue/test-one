'use client'

import React from 'react'
import Protected from '../../../components/Protected'
import ChatBox from '../../../components/ChatBox'

export default function ChatPage({ params }: { params: { roomId: string } }) {
  const roomId = params.roomId

  return (
    <Protected>
      <section className="py-12">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Chat</h2>
          <ChatBox roomId={roomId} />
        </div>
      </section>
    </Protected>
  )
}
