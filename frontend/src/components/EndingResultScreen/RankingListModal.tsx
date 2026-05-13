import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'motion/react'
import type { RootState } from '../../store'
import { get } from '../../utils/request'

interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  achievementCount: number
  endingCount: number
}

interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[]
  currentUser: LeaderboardEntry | null
}

export function RankingListModal({ onClose }: { onClose: () => void }) {
  const auth = useSelector((s: RootState) => s.auth)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [currentUser, setCurrentUser] = useState<LeaderboardEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeButtonRef.current?.focus()
  }, [])

  useEffect(() => {
    setLoading(true)
    get<LeaderboardResponse>('/leaderboard')
      .then((data) => {
        setLeaderboard(data.leaderboard)
        setCurrentUser(data.currentUser)
      })
      .catch(() => {
        setLeaderboard([])
        setCurrentUser(null)
      })
      .finally(() => setLoading(false))
  }, [auth.token])

  const currentInTop10 = currentUser && leaderboard.some((e) => e.userId === currentUser.userId)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rankings-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 backdrop-blur-sm"
      onKeyDown={(e) => { if (e.key === 'Escape') onClose() }}
    >
      <div className="relative w-full max-w-md rounded-[2rem] border-4 border-[#7a4b2b] bg-[#f7e8c6] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        <div className="rounded-[1.5rem] border-2 border-[#c49a61] bg-[#fff7df]/80 px-3 py-4 shadow-inner">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#9a6a3e] text-center">
            Ranking List
          </p>
          <h2 id="rankings-dialog-title" className="mt-1 text-xl font-bold text-[#7a4b2b] text-center">
            Top 10 Players
          </h2>

          {!auth.token && (
            <p className="mt-1 text-center text-[10px] text-[#c49a61] italic">
              Guest mode — sign in to save your rankings
            </p>
          )}

          {loading ? (
            <p className="mt-4 text-center text-sm text-[#8a6446]">Loading...</p>
          ) : leaderboard.length === 0 ? (
            <p className="mt-4 text-center text-sm text-[#8a6446]">
              No rankings yet. Complete a game to appear here!
            </p>
          ) : (
            <div className="mt-3 max-h-[50vh] overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-[#c49a61] text-[#7a4b2b]">
                    <th className="py-1 px-1 text-center w-10">#</th>
                    <th className="py-1 px-2 text-left">Name</th>
                    <th className="py-1 px-1 text-center w-20">Achv.</th>
                    <th className="py-1 px-1 text-center w-16">Endings</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => {
                    const isMe = entry.userId === auth.userId
                    return (
                      <tr
                        key={entry.rank}
                        className={`border-b border-[#e8d5a8] text-[#5a3010] ${
                          isMe ? 'bg-[#d4a84b]/30 font-bold' : ''
                        }`}
                      >
                        <td className="py-1.5 px-1 text-center">{entry.rank}</td>
                        <td className="py-1.5 px-2 truncate max-w-[140px]">
                          {entry.username}
                          {isMe && <span className="ml-1 text-[10px] text-[#7a4b2b]">(You)</span>}
                        </td>
                        <td className="py-1.5 px-1 text-center">{entry.achievementCount}</td>
                        <td className="py-1.5 px-1 text-center">{entry.endingCount}</td>
                      </tr>
                    )
                  })}

                  {/* Current user row if outside top 10 */}
                  {currentUser && !currentInTop10 && (
                    <>
                      <tr>
                        <td colSpan={4} className="py-1 text-center text-[#c49a61] text-xs">...</td>
                      </tr>
                      <tr className="border-b border-[#e8d5a8] text-[#5a3010] bg-[#d4a84b]/30 font-bold">
                        <td className="py-1.5 px-1 text-center">{currentUser.rank}</td>
                        <td className="py-1.5 px-2 truncate max-w-[140px]">
                          {currentUser.username}
                          <span className="ml-1 text-[10px] text-[#7a4b2b]">(You)</span>
                        </td>
                        <td className="py-1.5 px-1 text-center">{currentUser.achievementCount}</td>
                        <td className="py-1.5 px-1 text-center">{currentUser.endingCount}</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <motion.button
          type="button"
          ref={closeButtonRef}
          onClick={onClose}
          className="mx-auto mt-4 block cursor-pointer rounded-full border-2 border-[#6b3f25] bg-[#9a5f2d] px-8 py-2.5 text-sm font-bold uppercase tracking-[0.18em] text-[#fff3d2] shadow-md hover:scale-105 active:scale-95 transition"
        >
          Close
        </motion.button>
      </div>
    </div>
  )
}
