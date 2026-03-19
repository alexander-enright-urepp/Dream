'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { calculateStreak } from '@/lib/utils'
import Link from 'next/link'

interface Dream {
  id: string
  title: string
  description: string | null
  dream_link: string | null
}

interface ProofPost {
  id: string
  content: string
  image_url: string | null
  created_at: string
}

interface UserData {
  name: string
  venmo_url: string | null
  created_at: string
}

export default function Profile() {
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [dream, setDream] = useState<Dream | null>(null)
  const [proofs, setProofs] = useState<ProofPost[]>([])
  const [streak, setStreak] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [proofContent, setProofContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
        return
      }
      setUser(user)

      // Fetch user data
      const { data: userRow } = await supabase
        .from('users')
        .select('name, venmo_url, created_at')
        .eq('id', user.id)
        .single()
      
      if (userRow) setUserData(userRow)

      // Fetch dream
      const { data: dreamRow } = await supabase
        .from('dreams')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      if (dreamRow) setDream(dreamRow)

      // Fetch proofs
      const { data: proofsData } = await supabase
        .from('proof_posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (proofsData) {
        setProofs(proofsData)
        setStreak(calculateStreak(proofsData))
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  const handleAddProof = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !proofContent.trim()) return

    const { error } = await supabase.from('proof_posts').insert({
      user_id: user.id,
      content: proofContent,
    })

    if (error) {
      console.error(error)
      return
    }

    setProofContent('')
    setShowModal(false)
    
    // Refresh proofs
    const { data: proofsData } = await supabase
      .from('proof_posts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (proofsData) {
      setProofs(proofsData)
      setStreak(calculateStreak(proofsData))
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"></div>

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-600 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
            {userData?.name?.[0] || '?'}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{userData?.name}</h1>
          <div className="text-4xl mb-2">🔥 {streak} Day Streak</div>
          
          {userData?.venmo_url && (
            <a
              href={userData.venmo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Support My Dream
            </a>
          )}
        </div>

        {/* Dream Section */}
        {dream ? (
          <div className="bg-red-950/30 rounded-xl p-6 border border-red-800/50 mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">{dream.title}</h2>
            {dream.description && (
              <p className="text-gray-300 mb-4">{dream.description}</p>
            )}
            {dream.dream_link && (
              <a
                href={dream.dream_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                View Dream
              </a>
            )}
          </div>
        ) : (
          <div className="bg-red-950/30 rounded-xl p-6 border border-red-800/50 mb-8 text-center">
            <p className="text-gray-400 mb-4">No dream yet.</p>
            <Link href="/create" className="text-red-400 hover:text-red-300">Create one →</Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-red-950/30 rounded-xl p-4 text-center border border-red-800/50">
            <div className="text-2xl font-bold text-white">{streak}</div>
            <div className="text-sm text-gray-400">Streak</div>
          </div>
          <div className="bg-red-950/30 rounded-xl p-4 text-center border border-red-800/50">
            <div className="text-2xl font-bold text-white">{proofs.length}</div>
            <div className="text-sm text-gray-400">Proofs</div>
          </div>
          <div className="bg-red-950/30 rounded-xl p-4 text-center border border-red-800/50">
            <div className="text-2xl font-bold text-white">{new Date(userData?.created_at || '').toLocaleDateString()}</div>
            <div className="text-sm text-gray-400">Joined</div>
          </div>
        </div>

        {/* Proof Feed */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Proof Feed</h2>
          
          {proofs.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No proof posts yet. Start your streak!</p>
          ) : (
            <div className="space-y-4">
              {proofs.map((proof) => (
                <div key={proof.id} className="bg-red-950/30 rounded-xl p-4 border border-red-800/50">
                  <p className="text-white mb-2">{proof.content}</p>
                  <p className="text-sm text-gray-500">{new Date(proof.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 bg-red-600 hover:bg-red-700 text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg transition-colors"
      >
        +
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-red-950 rounded-xl p-6 w-full max-w-md border border-red-800">
            <h2 className="text-2xl font-bold text-white mb-4">Add Proof</h2>
            
            <form onSubmit={handleAddProof}>
              <textarea
                value={proofContent}
                onChange={(e) => setProofContent(e.target.value)}
                placeholder="What did you do today?"
                rows={4}
                className="w-full bg-black/50 border border-red-800/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 resize-none mb-4"
                required
              />
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors"
                >
                  Post Proof
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}