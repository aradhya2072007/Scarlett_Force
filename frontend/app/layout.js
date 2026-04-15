import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'EventSphere — Discover Events Matched to Your Personality',
  description: 'EventSphere uses AI-powered personality matching to recommend events you\'ll love. Discover, RSVP, and experience tech, music, sports, art events near you.',
  keywords: 'events, personality quiz, event recommendations, AI events, tech events, music festivals',
  openGraph: {
    title: 'EventSphere',
    description: 'AI-powered event discovery platform',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="noise-bg animated-bg">
        <AuthProvider>
          <Navbar />
          <main className="page-wrapper">{children}</main>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'rgba(18,18,32,0.95)',
                color: '#e2e8f0',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
              },
              success: { iconTheme: { primary: '#4ade80', secondary: '#0a0a1a' } },
              error: { iconTheme: { primary: '#f87171', secondary: '#0a0a1a' } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
