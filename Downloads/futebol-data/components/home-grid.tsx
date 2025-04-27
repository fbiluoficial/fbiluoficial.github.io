import GameCard from "@/components/game-card"
import type { GameData } from "@/lib/types"

interface HomeGridProps {
  games: GameData[]
}

export default function HomeGrid({ games }: HomeGridProps) {
  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-semibold mb-6">Histórico de Partidas</h2>

      {games.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <p className="text-lg">Nenhuma partida registrada ainda.</p>
          <p className="mt-2 text-sm">Use o botão + para adicionar sua primeira anotação.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  )
}
