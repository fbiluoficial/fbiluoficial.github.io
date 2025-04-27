import type React from "react"
import type { Metadata } from "next"
import { Rajdhani } from "next/font/google"
import "./globals.css"
import "./custom-styles.css" // Importando os estilos personalizados

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "FutebolData - Anotações de Partidas",
  description: "Aplicação para anotações de partidas de futebol",
  manifest: "/manifest.json",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={rajdhani.className}>{children}</body>
    </html>
  )
}
