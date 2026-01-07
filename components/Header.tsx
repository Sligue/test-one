import React from 'react'
import Link from 'next/link'
import NotificationBell from './NotificationBell'

export default function Header() {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">HustleHub</Link>
        <nav className="flex items-center gap-4">
          <Link href="/marketplace" className="text-sm text-gray-700">Marketplace</Link>
          <Link href="/jobs" className="text-sm text-gray-700">Jobs</Link>
          <NotificationBell />
          <Link href="/signin" className="text-sm text-blue-600">Sign in</Link>
        </nav>
      </div>
    </header>
  )
}
