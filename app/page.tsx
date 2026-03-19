import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
          Dream
        </h1>
        <p className="text-2xl md:text-3xl text-red-400 font-semibold mb-4">
          Stop talking. Start proving.
        </p>
        <p className="text-lg text-gray-300 mb-10">
          Post your dream. Show your progress daily.
        </p>
        
        <Link
          href="/signup"
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-300"
        >
          Start Your Dream
        </Link>
      </div>

      {/* Demo Cards */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="bg-red-950/50 rounded-xl p-6 border border-red-800/50">
          <div className="text-3xl mb-2">🔥</div>
          <h3 className="text-white font-bold mb-1">Alex</h3>
          <p className="text-red-400 text-sm mb-2">42 Day Streak</p>
          <p className="text-gray-400 text-sm">Building a sports tech platform</p>
        </div>

        <div className="bg-red-950/50 rounded-xl p-6 border border-red-800/50">
          <div className="text-3xl mb-2">🔥</div>
          <h3 className="text-white font-bold mb-1">Sarah</h3>
          <p className="text-red-400 text-sm mb-2">28 Day Streak</p>
          <p className="text-gray-400 text-sm">Learning to code daily</p>
        </div>

        <div className="bg-red-950/50 rounded-xl p-6 border border-red-800/50">
          <div className="text-3xl mb-2">🔥</div>
          <h3 className="text-white font-bold mb-1">Mike</h3>
          <p className="text-red-400 text-sm mb-2">15 Day Streak</p>
          <p className="text-gray-400 text-sm">Writing a novel</p>
        </div>
      </div>
    </main>
  )
}