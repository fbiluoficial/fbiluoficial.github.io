"use client"

import { Plus } from "lucide-react"

interface FloatingButtonProps {
  onClick: () => void
}

export default function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <button className="floating-button" onClick={onClick} aria-label="Adicionar nova partida">
      <Plus className="h-6 w-6" />
    </button>
  )
}
