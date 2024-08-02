import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/Providers'
import NavBar from '@/components/NavBar'
import ClientLayout from '@/components/ClientLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AI Decision Maker',
  description: 'Make better decisions with AI assistance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ClientLayout>
            <NavBar />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="bg-gray-800 text-white py-4 mt-auto">
              <div className="container mx-auto px-4">
                © {new Date().getFullYear()} AI Decision Maker
              </div>
            </footer>
          </ClientLayout>
        </Providers>
      </body>
    </html>
  )
}