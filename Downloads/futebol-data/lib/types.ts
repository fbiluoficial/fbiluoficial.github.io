export interface GameData {
  id: string
  teamA: string
  teamB: string
  scoreHT: string
  scoreFT: string
  favoriteTeam: string
  firstGoalMinute: string
  goalTimingFT: string
  firstGoalTime?: string // 1º Tempo ou 2º Tempo
  firstGoalScorer?: string // Casa, Fora ou Nenhum
}
