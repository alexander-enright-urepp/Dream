export function calculateStreak(posts: { created_at: string }[]): number {
  if (!posts || posts.length === 0) return 0
  
  // Get unique dates (normalized to midnight UTC)
  const dates = posts.map(p => {
    const date = new Date(p.created_at)
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())).getTime()
  })
  
  const uniqueDates = [...new Set(dates)].sort((a, b) => b - a)
  
  if (uniqueDates.length === 0) return 0
  
  // Get today's date in UTC
  const now = new Date()
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).getTime()
  const yesterday = today - 86400000 // 24 hours in ms
  
  // Check if most recent post is today or yesterday
  const mostRecent = uniqueDates[0]
  if (mostRecent !== today && mostRecent !== yesterday) {
    return 0
  }
  
  let streak = 1
  
  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const current = uniqueDates[i]
    const next = uniqueDates[i + 1]
    const diffDays = (current - next) / 86400000
    
    if (diffDays === 1) {
      streak++
    } else {
      break
    }
  }
  
  return streak
}