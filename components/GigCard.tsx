'use client'

import React from 'react'
import Link from 'next/link'

export default function GigCard({ gig }: { gig: any }) {
  return (
    <article className="border rounded overflow-hidden shadow-sm">
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1"><Link href={`/jobs/${gig.id}`}>{gig.title}</Link></h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{gig.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-green-600">${Number(gig.budget).toFixed(2)}</span>
          <span className={`text-xs px-2 py-1 rounded ${gig.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{gig.status}</span>
        </div>
        <Link href={`/jobs/${gig.id}`} className="text-blue-600 text-sm mt-2 inline-block">View details</Link>
      </div>
    </article>
  )
}
