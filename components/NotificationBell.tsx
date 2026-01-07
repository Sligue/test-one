'use client'

import React from 'react'
import useNotifications from '../lib/useNotifications'

export default function NotificationBell() {
  const { notifications, markAsRead } = useNotifications()

  return (
    <div className="relative">
      <button className="relative">
        🔔
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>
      {notifications.length > 0 && (
        <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg max-h-96 overflow-y-auto z-50">
          {notifications.map((notif) => (
            <div key={notif.id} className="p-3 border-b text-sm cursor-pointer hover:bg-gray-50" onClick={() => markAsRead(notif.id)}>
              <p className="font-semibold">{notif.type}</p>
              <p className="text-gray-600 text-xs">{JSON.stringify(notif.payload)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
