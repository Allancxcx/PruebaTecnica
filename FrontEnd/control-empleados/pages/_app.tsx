import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import "../styles/globals.css"
import { Toaster } from "@/Components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.className}>
      <Component {...pageProps} />
      <Toaster />
    </div>
  )
}