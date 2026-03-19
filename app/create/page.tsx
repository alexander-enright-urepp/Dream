'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'

export default function CreateDream() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dreamLink, setDreamLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
      } else {
        setUser(user)
      }
    }
    checkUser()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError('')

    const { error: insertError } = await supabase.from('dreams').insert({
      user_id: user.id,
      title,
      description: description || null,
      dream_link: dreamLink || null,
    })

    if (insertError) {
      console.error(insertError)
      setError(insertError.message || 'Failed to create dream. Please try again.')
      setLoading(false)
      return
    }

    setLoading(false)
    window.location.href = '/profile'
  }

  if (!user) return null

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-white text-center mb-2">Commit to Dream</h1>
        <p className="text-gray-400 text-center mb-8">What are you building?</p>
        
        <form onSubmit={handleSubmit} className="bg-red-950/30 rounded-xl p-8 border border-red-800/50">
          {error && (
            <div className="bg-red-900/50 text-red-200 p-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-300 text-sm mb-2">Dream Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Build a sports tech platform"
              className="w-full bg-black/50 border border-red-800/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm mb-2">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Help athletes showcase their talent..."
              rows={3}
              className="w-full bg-black/50 border border-red-800/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 resize-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 text-sm mb-2">Dream Link (optional)</label>
            <input
              type="url"
              value={dreamLink}
              onChange={(e) => setDreamLink(e.target.value)}
              placeholder="https://..."
              className="w-full bg-black/50 border border-red-800/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !title}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-bold py-3 rounded-lg transition-colors duration-300"
          >
            {loading ? 'Committing...' : 'Commit to Dream'}
          </button>
        </form>
      </div>
    </main>
  )
}