import type { Metadata } from 'next'
import { Noto_Sans, Roboto_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _noto = Noto_Sans({ subsets: ["latin", "latin-ext", "vietnamese"], weight: ["300", "400", "700"], display: 'swap' });
const _robotoMono = Roboto_Mono({ subsets: ["latin", "latin-ext"], weight: ["400", "700"], display: 'swap' });

export const metadata: Metadata = {
  title: 'A* Maze Solver | 3D Visualization',
  description: 'Interactive A* pathfinding algorithm visualization with 3D maze display',
  icons: {
    // icon: [
    //   {
    //     url: '/icon-light-32x32.png',
    //     media: '(prefers-color-scheme: light)',
    //   },
    //   {
    //     url: '/icon-dark-32x32.png',
    //     media: '(prefers-color-scheme: dark)',
    //   },
    //   {
    //     url: '/icon.svg',
    //     type: 'image/svg+xml',
    //   },
    // ],
    // apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${_noto.className} ${_robotoMono.className} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
