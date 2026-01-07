'use client'

import React from 'react'
import AuthForm from '../../components/AuthForm'
import Link from 'next/link'

export default function SignUpPage(){
  return (
    <section className="py-12">
      <div className="max-w-xl mx-auto">
        <AuthForm mode="signup" />
        <p className="text-center text-sm text-gray-600 mt-4">Already have an account? <Link href="/signin" className="text-blue-600">Sign in</Link></p>
      </div>
    </section>
  )
}
