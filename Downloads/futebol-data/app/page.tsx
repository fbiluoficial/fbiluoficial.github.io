"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import SideMenu from "@/components/side-menu"
import HomeGrid from "@/components/home-grid"
import FloatingButton from "@/components/floating-button"
import NewGameForm from "@/components/new-game-form"
import ExportScreen from "@/components/export-screen"
import DashboardPanel from "@/components/dashboard-panel"
import type { GameData } from "@/lib/types"

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentScreen, setCurrentScreen] = useState("home")
  const [showNewGameForm, setShowNewGameForm] = useState(false)
  const [games, setGames] = useState<GameData[]>([])

  useEffect(() => {
    // Load games from localStorage on initial render
    const savedGames = localStorage.getItem("futebolData")
    if (savedGames) {
      setGames(JSON.parse(savedGames))
    }
  }, [])

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const navigateTo = (screen: string) => {
    setCurrentScreen(screen)
    setMenuOpen(false)
  }

  const handleAddGame = (newGame: GameData) => {
    const updatedGames = [...games, { ...newGame, id: Date.now().toString() }]
    setGames(updatedGames)
    localStorage.setItem("futebolData", JSON.stringify(updatedGames))
    setShowNewGameForm(false)
  }

  return (
    <main className="min-h-screen pb-20">
      <Header toggleMenu={toggleMenu} />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} navigateTo={navigateTo} />

      {currentScreen === "home" && (
        <>
          <HomeGrid games={games} />
          <FloatingButton onClick={() => setShowNewGameForm(true)} />
        </>
      )}

      {currentScreen === "dashboard" && <DashboardPanel games={games} />}

      {currentScreen === "export" && <ExportScreen games={games} />}

      {showNewGameForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <NewGameForm onSave={handleAddGame} onCancel={() => setShowNewGameForm(false)} />
        </div>
      )}
    </main>
  )
}
