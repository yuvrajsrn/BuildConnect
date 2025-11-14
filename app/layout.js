import './globals.css'
import { UserProvider } from '@/context/UserContext'

export const metadata = {
  title: 'BuildConnect - Construction Marketplace',
  description: 'Connect builders with verified contractors through digital tenders',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🏗️</text></svg>',
  },
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
