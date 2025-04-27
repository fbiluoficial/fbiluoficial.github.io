"use client"

import type React from "react"
import { useState } from "react"
import { X } from "lucide-react"
import type { GameData } from "@/lib/types"

interface NewGameFormProps {
  onSave: (game: GameData) => void
  onCancel: () => void
}

export default function NewGameForm({ onSave, onCancel }: NewGameFormProps) {
  const [formData, setFormData] = useState<Omit<GameData, "id">>({
    teamA: "",
    teamB: "",
    scoreHT: "0-0",
    scoreFT: "0-0",
    favoriteTeam: "",
    firstGoalMinute: "0-14 min",
    goalTimingFT: "Antes do min 75",
    firstGoalTime: "", // 1º Tempo ou 2º Tempo
    firstGoalScorer: "", // Casa, Fora ou Nenhum
  })

  const [scoreHTHome, setScoreHTHome] = useState("0")
  const [scoreHTAway, setScoreHTAway] = useState("0")
  const [scoreFTHome, setScoreFTHome] = useState("0")
  const [scoreFTAway, setScoreFTAway] = useState("0")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleScoreChange = (type: string, value: string) => {
    // Garantir que apenas números sejam inseridos
    const numericValue = value.replace(/[^0-9]/g, "")

    switch (type) {
      case "htHome":
        setScoreHTHome(numericValue)
        setFormData((prev) => ({ ...prev, scoreHT: `${numericValue}-${scoreHTAway}` }))
        break
      case "htAway":
        setScoreHTAway(numericValue)
        setFormData((prev) => ({ ...prev, scoreHT: `${scoreHTHome}-${numericValue}` }))
        break
      case "ftHome":
        setScoreFTHome(numericValue)
        setFormData((prev) => ({ ...prev, scoreFT: `${numericValue}-${scoreFTAway}` }))
        break
      case "ftAway":
        setScoreFTAway(numericValue)
        setFormData((prev) => ({ ...prev, scoreFT: `${scoreFTHome}-${numericValue}` }))
        break
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData as GameData)
  }

  const handleGoalTimingSelect = (timing: string) => {
    setFormData((prev) => ({ ...prev, goalTimingFT: timing }))
  }

  return (
    <div className="glass-card w-full max-w-md max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center p-5">
        <h2 className="text-xl font-bold text-white">Adicionar Nova Partida</h2>
        <button
          onClick={onCancel}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Fechar formulário"
        >
          <X className="h-5 w-5 text-white" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-6">
        {/* Seção Times */}
        <div className="glass-card p-4">
          <h3 className="text-sm text-gray-400 mb-3">Times</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="teamA" className="block mb-1 text-xs text-gray-400">
                Time A
              </label>
              <input
                type="text"
                id="teamA"
                name="teamA"
                value={formData.teamA}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label htmlFor="teamB" className="block mb-1 text-xs text-gray-400">
                Time B
              </label>
              <input
                type="text"
                id="teamB"
                name="teamB"
                value={formData.teamB}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>
        </div>

        {/* Seção Placar */}
        <div className="glass-card p-4">
          <h3 className="text-sm text-gray-400 mb-3">Placar</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-xs text-gray-400">Half Time (HT)</label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={scoreHTHome}
                  onChange={(e) => handleScoreChange("htHome", e.target.value)}
                  className="input-field w-16 text-center"
                  maxLength={2}
                  required
                />
                <span className="mx-2 text-lg text-white">-</span>
                <input
                  type="text"
                  value={scoreHTAway}
                  onChange={(e) => handleScoreChange("htAway", e.target.value)}
                  className="input-field w-16 text-center"
                  maxLength={2}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 text-xs text-gray-400">Full Time (FT)</label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={scoreFTHome}
                  onChange={(e) => handleScoreChange("ftHome", e.target.value)}
                  className="input-field w-16 text-center"
                  maxLength={2}
                  required
                />
                <span className="mx-2 text-lg text-white">-</span>
                <input
                  type="text"
                  value={scoreFTAway}
                  onChange={(e) => handleScoreChange("ftAway", e.target.value)}
                  className="input-field w-16 text-center"
                  maxLength={2}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Seção PRIMEIRO GOL */}
        <div className="glass-card p-4">
          <h3 className="text-center py-2 mb-4 bg-[var(--accent-cyan)] text-black font-bold rounded-md">
            PRIMEIRO GOL
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm text-gray-400">Tempo:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, firstGoalTime: "1º Tempo" }))}
                  className={`py-3 rounded-md transition-all cursor-pointer ${
                    formData.firstGoalTime === "1º Tempo"
                      ? "bg-[var(--accent-cyan)] text-black font-medium"
                      : "bg-[#1a1a1a] text-white hover:bg-[#252525]"
                  }`}
                >
                  1º Tempo
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, firstGoalTime: "2º Tempo" }))}
                  className={`py-3 rounded-md transition-all cursor-pointer ${
                    formData.firstGoalTime === "2º Tempo"
                      ? "bg-[var(--accent-cyan)] text-black font-medium"
                      : "bg-[#1a1a1a] text-white hover:bg-[#252525]"
                  }`}
                >
                  2º Tempo
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-400">Quem Marcou:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, firstGoalScorer: "Casa" }))}
                  className={`py-3 rounded-md transition-all cursor-pointer ${
                    formData.firstGoalScorer === "Casa"
                      ? "bg-[var(--accent-cyan)] text-black font-medium"
                      : "bg-[#1a1a1a] text-white hover:bg-[#252525]"
                  }`}
                >
                  Casa
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, firstGoalScorer: "Fora" }))}
                  className={`py-3 rounded-md transition-all cursor-pointer ${
                    formData.firstGoalScorer === "Fora"
                      ? "bg-[var(--accent-cyan)] text-black font-medium"
                      : "bg-[#1a1a1a] text-white hover:bg-[#252525]"
                  }`}
                >
                  Fora
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, firstGoalScorer: "Nenhum" }))}
                  className={`py-3 rounded-md transition-all cursor-pointer ${
                    formData.firstGoalScorer === "Nenhum"
                      ? "bg-[var(--accent-cyan)] text-black font-medium"
                      : "bg-[#1a1a1a] text-white hover:bg-[#252525]"
                  }`}
                >
                  Nenhum
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Seção Detalhes */}
        <div className="glass-card p-4">
          <h3 className="text-sm text-gray-400 mb-3">Detalhes</h3>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-xs text-gray-400">Time Favorito</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, favoriteTeam: formData.teamA }))
                  }}
                  className={`px-4 py-2 rounded-full transition-all cursor-pointer hover:bg-white/10 ${
                    formData.favoriteTeam === formData.teamA
                      ? "border-2 border-[var(--accent-cyan)] text-[var(--accent-cyan)] bg-[rgba(0,255,255,0.1)]"
                      : "border border-white/10 text-white"
                  }`}
                >
                  Mandante
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, favoriteTeam: formData.teamB }))
                  }}
                  className={`px-4 py-2 rounded-full transition-all cursor-pointer hover:bg-white/10 ${
                    formData.favoriteTeam === formData.teamB
                      ? "border-2 border-[var(--accent-cyan)] text-[var(--accent-cyan)] bg-[rgba(0,255,255,0.1)]"
                      : "border border-white/10 text-white"
                  }`}
                >
                  Visitante
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-1 text-xs text-gray-400">Minuto do Primeiro Gol HT</label>
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, firstGoalMinute: "0-14 min" }))}
                  className={`px-4 py-2 rounded-full transition-all ${
                    formData.firstGoalMinute === "0-14 min"
                      ? "border border-[var(--accent-cyan)] text-[var(--accent-cyan)]"
                      : "border border-white/10 text-white"
                  }`}
                >
                  0-14 min
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, firstGoalMinute: "15-29 min" }))}
                  className={`px-4 py-2 rounded-full transition-all ${
                    formData.firstGoalMinute === "15-29 min"
                      ? "border border-[var(--accent-cyan)] text-[var(--accent-cyan)]"
                      : "border border-white/10 text-white"
                  }`}
                >
                  15-29 min
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, firstGoalMinute: "30-45 min" }))}
                  className={`px-4 py-2 rounded-full transition-all ${
                    formData.firstGoalMinute === "30-45 min"
                      ? "border border-[var(--accent-cyan)] text-[var(--accent-cyan)]"
                      : "border border-white/10 text-white"
                  }`}
                >
                  30-45 min
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-1 text-xs text-gray-400">Momento do Gol FT</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleGoalTimingSelect("Antes do min 75")}
                  className={`px-4 py-2 rounded-full transition-all ${
                    formData.goalTimingFT === "Antes do min 75"
                      ? "border border-[var(--accent-cyan)] text-[var(--accent-cyan)]"
                      : "border border-white/10 text-white"
                  }`}
                >
                  Antes do min 75
                </button>
                <button
                  type="button"
                  onClick={() => handleGoalTimingSelect("Após o min 75")}
                  className={`px-4 py-2 rounded-full transition-all ${
                    formData.goalTimingFT === "Após o min 75"
                      ? "border border-[var(--accent-cyan)] text-[var(--accent-cyan)]"
                      : "border border-white/10 text-white"
                  }`}
                >
                  Após o min 75
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button type="button" onClick={onCancel} className="btn">
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            Salvar Anotação
          </button>
        </div>
      </form>
    </div>
  )
}
