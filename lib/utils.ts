export function calculateStreak(posts: { created_at: string }[]): number {
  if (!posts || posts.length === 0) return 0
  
  const dates = posts.map(p => new Date(p.created_at).toDateString())
  const uniqueDates = [...new Set(dates)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  
  if (uniqueDates.length === 0) return 0
  
  let streak = 1
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()
  
  // Check if posted today or yesterday to start streak
  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
    return 0
  }
  
  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const current = new Date(uniqueDates[i])
    const next = new Date(uniqueDates[i + 1])
    const diffDays = (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24)
    
    if (diffDays === 1) {
      streak++
    } else {
      break
    }
  }
  
  return streak
}