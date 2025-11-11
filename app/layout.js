import './globals.css'
import { UserProvider } from '@/context/UserContext'

export const metadata = {
  title: 'BuildConnect - Construction Marketplace',
  description: 'Connect builders with verified contractors through digital tenders',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  )
}
