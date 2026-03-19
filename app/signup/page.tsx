'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    })

    if (authError) {
      setError(authError.message || 'Signup failed')
      setLoading(false)
      return
    }

    // User is auto-created by trigger, wait a moment for it to complete
    await new Promise(resolve => setTimeout(resolve, 500))

    setLoading(false)
    window.location.href = '/create'
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-white text-center mb-8">Create Account</h1>
        
        <form onSubmit={handleSignup} className="bg-red-950/30 rounded-xl p-8 border border-red-800/50">
          {error && (
            <div className="bg-red-900/50 text-red-200 p-3 rounded mb-4 text-sm">{error}</div>
          )}
          
          <div className="mb-4">
            <label className="block text-gray-300 text-sm mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/50 border border-red-800/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-red-800/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-red-800/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-bold py-3 rounded-lg transition-colors duration-300"
          >
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-red-400 hover:text-red-300">Log in</Link>
        </p>
      </div>
    </main>
  )
}