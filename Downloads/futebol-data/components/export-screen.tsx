"use client"

import { useState } from "react"
import { FileDown, Check } from "lucide-react"
import type { GameData } from "@/lib/types"

interface ExportScreenProps {
  games: GameData[]
}

export default function ExportScreen({ games }: ExportScreenProps) {
  const [exported, setExported] = useState(false)

  const handleExport = async () => {
    try {
      // Importar a biblioteca xlsx dinamicamente
      const XLSX = await import("xlsx")

      // Criar uma planilha a partir dos dados
      const worksheet = XLSX.utils.json_to_sheet(games)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Partidas")

      // Gerar o arquivo e fazer o download
      XLSX.writeFile(workbook, "FutebolData_Export.xlsx")

      // Mostrar feedback de sucesso
      setExported(true)
      setTimeout(() => setExported(false), 3000)
    } catch (error) {
      console.error("Erro ao exportar:", error)
      alert("Ocorreu um erro ao exportar os dados.")
    }
  }

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-semibold mb-6">Exportar Dados</h2>

      <div className="glass-card p-6 mb-6">
        <p className="mb-4">Exporte todas as suas anotações de partidas para um arquivo Excel (.xlsx).</p>

        <button
          onClick={handleExport}
          disabled={games.length === 0 || exported}
          className={`btn btn-primary flex items-center ${games.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {exported ? (
            <>
              <Check className="h-5 w-5 mr-2" />
              Exportado com Sucesso!
            </>
          ) : (
            <>
              <FileDown className="h-5 w-5 mr-2" />
              Exportar para Excel
            </>
          )}
        </button>

        {games.length === 0 && <p className="mt-3 text-sm text-red-400">Você ainda não tem anotações para exportar.</p>}
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold mb-4">Dados a serem exportados ({games.length})</h3>

        {games.length === 0 ? (
          <p>Nenhuma partida registrada ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 px-3">Times</th>
                  <th className="text-left py-2 px-3">Placar HT</th>
                  <th className="text-left py-2 px-3">Placar FT</th>
                  <th className="text-left py-2 px-3">Time Favorito</th>
                </tr>
              </thead>
              <tbody>
                {games.map((game) => (
                  <tr key={game.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-3">
                      {game.teamA} vs {game.teamB}
                    </td>
                    <td className="py-3 px-3">{game.scoreHT}</td>
                    <td className="py-3 px-3">{game.scoreFT}</td>
                    <td className="py-3 px-3">{game.favoriteTeam}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
