"use client"

import { Menu } from "lucide-react"

interface HeaderProps {
  toggleMenu: () => void
}

export default function Header({ toggleMenu }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 glass-card px-4 py-3 mb-6 flex items-center">
      <button onClick={toggleMenu} className="p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Menu">
        <Menu className="h-6 w-6 text-white" />
      </button>
      <h1 className="text-xl md:text-2xl font-bold ml-4">
        <span className="neon-text">Futebol</span>
        <span className="purple-text">Data</span>
      </h1>
    </header>
  )
}
