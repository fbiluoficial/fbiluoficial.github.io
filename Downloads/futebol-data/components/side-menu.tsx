"use client"

import { Home, BarChart2, FileSpreadsheet, X } from "lucide-react"

interface SideMenuProps {
  isOpen: boolean
  onClose: () => void
  navigateTo: (screen: string) => void
}

export default function SideMenu({ isOpen, onClose, navigateTo }: SideMenuProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />}

      {/* Menu */}
      <div className={`side-menu ${isOpen ? "side-menu-open" : "side-menu-closed"}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              <span className="neon-text">Menu</span>
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Fechar menu"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          <nav>
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => navigateTo("home")}
                  className="flex items-center w-full p-3 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <Home className="h-5 w-5 mr-3 text-[var(--accent-cyan)]" />
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("dashboard")}
                  className="flex items-center w-full p-3 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <BarChart2 className="h-5 w-5 mr-3 text-[var(--accent-cyan)]" />
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("export")}
                  className="flex items-center w-full p-3 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <FileSpreadsheet className="h-5 w-5 mr-3 text-[var(--accent-cyan)]" />
                  <span>Exportar</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}
