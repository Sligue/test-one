import React from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <section className="py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">HustleHub</h1>
        <p className="text-gray-600 mb-8">A marketplace and gigs platform — starter kit.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/marketplace" className="px-5 py-3 bg-blue-600 text-white rounded">Marketplace</Link>
          <Link href="/jobs" className="px-5 py-3 bg-green-600 text-white rounded">Jobs</Link>
        </div>
      </div>
    </section>
  )
}
