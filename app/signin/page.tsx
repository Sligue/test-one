'use client'

import React from 'react'
import AuthForm from '../../components/AuthForm'
import Link from 'next/link'

export default function SignInPage(){
  return (
    <section className="py-12">
      <div className="max-w-xl mx-auto">
        <AuthForm mode="signin" />
        <p className="text-center text-sm text-gray-600 mt-4">Don't have an account? <Link href="/signup" className="text-blue-600">Sign up</Link></p>
      </div>
    </section>
  )
}
