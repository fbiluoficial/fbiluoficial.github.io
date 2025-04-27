"use client"

import { useMemo } from "react"
import { BarChart, Activity, Award, Clock, TrendingUp, Users, Zap } from "lucide-react"
import type { GameData } from "@/lib/types"

interface DashboardPanelProps {
  games: GameData[]
}

export default function DashboardPanel({ games }: DashboardPanelProps) {
  // Cálculos de estatísticas
  const stats = useMemo(() => {
    // Estatística básica: total de jogos
    const totalGames = games.length

    if (totalGames === 0) {
      return {
        totalGames: 0,
        favoriteTeamWins: { count: 0, percentage: 0 },
        goalTiming: { before75: 0, after75: 0, beforePercentage: 0, afterPercentage: 0 },
        averageGoalsHT: 0,
        averageGoalsST: 0,
        averageFirstGoalMinute: 0,
        topFavoriteTeams: [],
        topScoringGames: [],
      }
    }

    // Vitórias do Time Favorito
    const favoriteTeamWins = games.reduce(
      (acc, game) => {
        const [teamAScore, teamBScore] = game.scoreFT.split("-").map(Number)
        const favoriteTeamIsA = game.favoriteTeam === game.teamA
        const favoriteTeamIsB = game.favoriteTeam === game.teamB

        if ((favoriteTeamIsA && teamAScore > teamBScore) || (favoriteTeamIsB && teamBScore > teamAScore)) {
          acc.count++
        }
        return acc
      },
      { count: 0, percentage: 0 },
    )
    favoriteTeamWins.percentage = Math.round((favoriteTeamWins.count / totalGames) * 100)

    // Porcentagem de Gols Antes e Após 75 minutos
    const goalTiming = games.reduce(
      (acc, game) => {
        if (game.goalTimingFT === "Antes do min 75") {
          acc.before75++
        } else {
          acc.after75++
        }
        return acc
      },
      { before75: 0, after75: 0, beforePercentage: 0, afterPercentage: 0 },
    )
    goalTiming.beforePercentage = Math.round((goalTiming.before75 / totalGames) * 100)
    goalTiming.afterPercentage = Math.round((goalTiming.after75 / totalGames) * 100)

    // Média de Gols no Primeiro Tempo (HT)
    const totalGoalsHT = games.reduce((acc, game) => {
      const [teamAScore, teamBScore] = game.scoreHT.split("-").map(Number)
      return acc + teamAScore + teamBScore
    }, 0)
    const averageGoalsHT = Number.parseFloat((totalGoalsHT / totalGames).toFixed(2))

    // Média de Gols no Segundo Tempo
    const totalGoalsST = games.reduce((acc, game) => {
      const [teamAScoreHT, teamBScoreHT] = game.scoreHT.split("-").map(Number)
      const [teamAScoreFT, teamBScoreFT] = game.scoreFT.split("-").map(Number)

      const secondHalfGoals = teamAScoreFT - teamAScoreHT + (teamBScoreFT - teamBScoreHT)

      return acc + secondHalfGoals
    }, 0)
    const averageGoalsST = Number.parseFloat((totalGoalsST / totalGames).toFixed(2))

    // Minuto Médio do Primeiro Gol
    const totalFirstGoalMinutes = games.reduce((acc, game) => {
      return acc + Number(game.firstGoalMinute)
    }, 0)
    const averageFirstGoalMinute = Math.round(totalFirstGoalMinutes / totalGames)

    // Top 3 Times Favoritos Mais Anotados
    const favoriteTeamCount = games.reduce(
      (acc, game) => {
        const team = game.favoriteTeam
        acc[team] = (acc[team] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const topFavoriteTeams = Object.entries(favoriteTeamCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([team, count]) => ({
        team,
        count,
        percentage: Math.round((count / totalGames) * 100),
      }))

    // Ranking de Jogos com Mais Gols
    const gamesWithGoalCount = games.map((game) => {
      const [teamAScore, teamBScore] = game.scoreFT.split("-").map(Number)
      const totalGoals = teamAScore + teamBScore
      return {
        id: game.id,
        teams: `${game.teamA} vs ${game.teamB}`,
        score: game.scoreFT,
        totalGoals,
      }
    })

    const topScoringGames = gamesWithGoalCount.sort((a, b) => b.totalGoals - a.totalGoals).slice(0, 5)

    return {
      totalGames,
      favoriteTeamWins,
      goalTiming,
      averageGoalsHT,
      averageGoalsST,
      averageFirstGoalMinute,
      topFavoriteTeams,
      topScoringGames,
    }
  }, [games])

  return (
    <div className="container mx-auto px-4 pb-10">
      <h2 className="text-2xl font-semibold mb-6">Dashboard Analítico</h2>

      {stats.totalGames === 0 ? (
        <div className="glass-card p-8 text-center">
          <p className="text-lg">Sem dados suficientes para análise.</p>
          <p className="mt-2 text-sm">Adicione algumas partidas para visualizar estatísticas.</p>
        </div>
      ) : (
        <>
          {/* Primeira linha - Estatísticas gerais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="glass-card p-6">
              <div className="flex items-center mb-4">
                <Activity className="h-6 w-6 text-[var(--accent-cyan)] mr-2" />
                <h3 className="text-lg font-semibold">Total de Partidas</h3>
              </div>
              <p className="text-3xl font-bold mb-2">{stats.totalGames}</p>
              <p className="text-sm">Partidas registradas</p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center mb-4">
                <Award className="h-6 w-6 text-[var(--accent-cyan)] mr-2" />
                <h3 className="text-lg font-semibold">Vitórias do Favorito</h3>
              </div>
              <div className="relative pt-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-semibold inline-block text-[var(--accent-cyan)]">
                      {stats.favoriteTeamWins.percentage}% de vitórias
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-white/10">
                  <div
                    style={{ width: `${stats.favoriteTeamWins.percentage}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[var(--accent-cyan)]"
                  ></div>
                </div>
                <p className="text-sm">
                  {stats.favoriteTeamWins.count} de {stats.totalGames} partidas
                </p>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-[var(--accent-cyan)] mr-2" />
                <h3 className="text-lg font-semibold">Minuto Médio 1º Gol</h3>
              </div>
              <p className="text-3xl font-bold mb-2">{stats.averageFirstGoalMinute}'</p>
              <p className="text-sm">Média de todas as partidas</p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center mb-4">
                <Zap className="h-6 w-6 text-[var(--accent-cyan)] mr-2" />
                <h3 className="text-lg font-semibold">Média de Gols</h3>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats.averageGoalsHT}</p>
                  <p className="text-xs">1º Tempo</p>
                </div>
                <div className="text-center mx-2">
                  <p className="text-sm">vs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats.averageGoalsST}</p>
                  <p className="text-xs">2º Tempo</p>
                </div>
              </div>
            </div>
          </div>

          {/* Segunda linha - Gráficos de barras */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="glass-card p-6">
              <div className="flex items-center mb-4">
                <BarChart className="h-6 w-6 text-[var(--accent-cyan)] mr-2" />
                <h3 className="text-lg font-semibold">Momento dos Gols</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-semibold inline-block text-[var(--accent-cyan)]">
                        Antes do min 75: {stats.goalTiming.beforePercentage}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-3 mb-1 text-xs flex rounded bg-white/10">
                    <div
                      style={{ width: `${stats.goalTiming.beforePercentage}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[var(--accent-cyan)]"
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400">
                    {stats.goalTiming.before75} de {stats.totalGames} partidas
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-semibold inline-block text-[var(--accent-purple)]">
                        Após o min 75: {stats.goalTiming.afterPercentage}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-3 mb-1 text-xs flex rounded bg-white/10">
                    <div
                      style={{ width: `${stats.goalTiming.afterPercentage}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[var(--accent-purple)]"
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400">
                    {stats.goalTiming.after75} de {stats.totalGames} partidas
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-[var(--accent-cyan)] mr-2" />
                <h3 className="text-lg font-semibold">Top 3 Times Favoritos</h3>
              </div>
              <div className="space-y-4">
                {stats.topFavoriteTeams.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-sm font-semibold inline-block text-white">
                          {item.team}: {item.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-3 mb-1 text-xs flex rounded bg-white/10">
                      <div
                        style={{ width: `${item.percentage}%` }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                          index === 0
                            ? "bg-[var(--accent-cyan)]"
                            : index === 1
                              ? "bg-[var(--accent-purple)]"
                              : "bg-[#FF5555]"
                        }`}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400">
                      {item.count} de {stats.totalGames} partidas
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Terceira linha - Ranking de jogos com mais gols */}
          <div className="glass-card p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-6 w-6 text-[var(--accent-cyan)] mr-2" />
              <h3 className="text-lg font-semibold">Ranking de Jogos com Mais Gols</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 px-3">#</th>
                    <th className="text-left py-2 px-3">Partida</th>
                    <th className="text-left py-2 px-3">Placar</th>
                    <th className="text-left py-2 px-3">Total de Gols</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topScoringGames.map((game, index) => (
                    <tr key={game.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-3">{index + 1}</td>
                      <td className="py-3 px-3">{game.teams}</td>
                      <td className="py-3 px-3">{game.score}</td>
                      <td className="py-3 px-3">
                        <span className="inline-block px-2 py-1 rounded-full bg-[rgba(0,255,255,0.1)] text-[var(--accent-cyan)]">
                          {game.totalGoals} gols
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
