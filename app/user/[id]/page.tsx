'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { calculateStreak } from '@/lib/utils'
import Link from 'next/link'

interface UserData {
  name: string
  venmo_url: string | null
  created_at: string
}

interface Dream {
  title: string
  description: string | null
  dream_link: string | null
}

interface ProofPost {
  id: string
  content: string
  created_at: string
}

export default function UserProfile() {
  const params = useParams()
  const userId = params.id as string
  
  const [userData, setUserData] = useState<UserData | null>(null)
  const [dream, setDream] = useState<Dream | null>(null)
  const [proofs, setProofs] = useState<ProofPost[]>([])
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      // Fetch user data
      const { data: userRow } = await supabase
        .from('users')
        .select('name, venmo_url, created_at')
        .eq('id', userId)
        .single()
      
      if (userRow) setUserData(userRow)

      // Fetch dream
      const { data: dreamRow } = await supabase
        .from('dreams')
        .select('title, description, dream_link')
        .eq('user_id', userId)
        .single()
      
      if (dreamRow) setDream(dreamRow)

      // Fetch proofs
      const { data: proofsData } = await supabase
        .from('proof_posts')
        .select('id, content, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (proofsData) {
        setProofs(proofsData)
        setStreak(calculateStreak(proofsData))
      }

      setLoading(false)
    }

    fetchData()
  }, [userId])

  if (loading) return <div className="min-h-screen flex items-center justify-center"></div>

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/explore" className="text-red-400 hover:text-red-300 mb-4 inline-block">← Back to Explore</Link>

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
            <p className="text-gray-400">No dream yet.</p>
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
            <p className="text-gray-400 text-center py-8">No proof posts yet.</p>
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
    </main>
  )
}