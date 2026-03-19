'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { calculateStreak } from '@/lib/utils'

interface UserWithDream {
  id: string
  name: string
  dream_title: string
  last_activity: string
  streak: number
}

export default function Explore() {
  const [users, setUsers] = useState<UserWithDream[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      const { data: usersData } = await supabase
        .from('users')
        .select('id, name, created_at')
      
      if (!usersData) {
        setLoading(false)
        return
      }

      const usersWithDreams = await Promise.all(
        usersData.map(async (user) => {
          // Get dream
          const { data: dream } = await supabase
            .from('dreams')
            .select('title')
            .eq('user_id', user.id)
            .single()

          // Get proofs for streak
          const { data: proofs } = await supabase
            .from('proof_posts')
            .select('created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

          const lastActivity = proofs?.[0]?.created_at || user.created_at || new Date().toISOString()

          return {
            id: user.id,
            name: user.name,
            dream_title: dream?.title || 'No dream yet',
            last_activity: lastActivity,
            streak: calculateStreak(proofs || []),
          }
        })
      )

      setUsers(usersWithDreams)
      setLoading(false)
    }

    fetchUsers()
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center"></div>

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Explore Dreams</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((user) => (
            <Link
              key={user.id}
              href={`/user/${user.id}`}
              className="block bg-red-950/30 rounded-xl p-6 border border-red-800/50 hover:border-red-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-white">{user.name}</h2>
                <span className="text-2xl">🔥 {user.streak}</span>
              </div>
              
              <p className="text-red-400 mb-2 truncate">{user.dream_title}</p>
              
              <p className="text-sm text-gray-500">
                Last active: {new Date(user.last_activity).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}