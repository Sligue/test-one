'use client'

import React, { useEffect, useState } from 'react'
import useAuth from '../lib/useAuth'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function ProfileForm(){
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!user) return
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/profile?id=${user.id}`)
        const json = await res.json()
        if (json?.profile) {
          setUsername(json.profile.username ?? '')
          setFullName(json.profile.full_name ?? '')
          setBio(json.profile.bio ?? '')
          setAvatarUrl(json.profile.avatar_url ?? null)
        }
      } catch (e) {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [user])

  const handleUploadAvatar = async () => {
    if (!avatarFile || !user) return null
    const path = `avatars/${user.id}/${Date.now()}_${avatarFile.name}`
    const { data, error } = await supabase.storage.from('avatars').upload(path, avatarFile, { upsert: true })
    if (error) throw error
    const publicUrl = supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl
    return publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    try {
      let uploadedUrl = avatarUrl
      if (avatarFile) {
        uploadedUrl = await handleUploadAvatar()
      }

      const payload = {
        id: user.id,
        username: username || null,
        full_name: fullName || null,
        bio: bio || null,
        avatar_url: uploadedUrl || null,
      }

      const res = await fetch('/api/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const json = await res.json()
      if (json?.error) throw new Error(json.error)
      router.push('/profile')
      router.refresh()
    } catch (err: any) {
      alert(err.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h3 className="text-xl font-semibold mb-4">Edit profile</h3>
      <label className="block mb-2 text-sm">Username</label>
      <input className="w-full mb-3 p-2 border rounded" value={username} onChange={(e)=>setUsername(e.target.value)} />
      <label className="block mb-2 text-sm">Full name</label>
      <input className="w-full mb-3 p-2 border rounded" value={fullName} onChange={(e)=>setFullName(e.target.value)} />
      <label className="block mb-2 text-sm">Bio</label>
      <textarea className="w-full mb-3 p-2 border rounded" value={bio} onChange={(e)=>setBio(e.target.value)} />
      <label className="block mb-2 text-sm">Avatar</label>
      {avatarUrl && <img src={avatarUrl} alt="avatar" className="w-20 h-20 object-cover rounded-full mb-2" />}
      <input className="w-full mb-4" type="file" accept="image/*" onChange={(e)=>setAvatarFile(e.target.files?.[0] ?? null)} />
      <button className="w-full py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading ? 'Saving...' : 'Save profile'}</button>
    </form>
  )
}
