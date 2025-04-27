import type { GameData } from "@/lib/types"

interface GameCardProps {
  game: GameData
}

export default function GameCard({ game }: GameCardProps) {
  // Determinar se o time favorito é o mandante ou visitante
  const favoriteTeamType = game.favoriteTeam === game.teamA ? "Mandante" : "Visitante"

  return (
    <div className="glass-card p-3 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-shadow duration-300">
      {/* Cabeçalho com Times */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex-1 text-center">
          <h3 className="text-base font-bold truncate">{game.teamA}</h3>
          <span className="text-xs text-gray-400">Mandante</span>
        </div>
        <div className="mx-2 text-xl font-bold neon-text">VS</div>
        <div className="flex-1 text-center">
          <h3 className="text-base font-bold truncate">{game.teamB}</h3>
          <span className="text-xs text-gray-400">Visitante</span>
        </div>
      </div>

      {/* Placares e Favorito */}
      <div className="flex justify-between items-center mb-2 border-t border-b border-white/10 py-1">
        <div>
          <span className="text-gray-400 text-sm">HT: </span>
          <span className="font-medium">{game.scoreHT}</span>
        </div>
        <div>
          <span className="text-gray-400 text-sm">FT: </span>
          <span className="font-medium">{game.scoreFT}</span>
        </div>
        <div>
          <span className="text-gray-400 text-sm">Fav: </span>
          <span className="purple-text font-medium">{favoriteTeamType}</span>
        </div>
      </div>

      {/* Informações do Primeiro Gol */}
      <div className="mb-2">
        <h4 className="text-center text-sm font-semibold mb-1 neon-text">PRIMEIRO GOL</h4>
        <div className="grid grid-cols-3 gap-1">
          <div>
            <p className="text-xs text-gray-400">Tempo:</p>
            <p className="text-sm font-medium">{game.firstGoalTime || "Não informado"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Marcou:</p>
            <p className="text-sm font-medium">{game.firstGoalScorer || "Não informado"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Min:</p>
            <p className="text-sm font-medium neon-text">{game.firstGoalMinute}</p>
          </div>
        </div>
      </div>

      {/* Momento do Gol FT */}
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-400">Momento do Gol FT:</p>
        <p className="text-sm font-medium neon-text">{game.goalTimingFT}</p>
      </div>
    </div>
  )
}
