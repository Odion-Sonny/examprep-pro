import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'ExamPrep Pro - AI Diagnostic Toolkit',
  description: 'Identify your knowledge gaps and build a personalized study guide for WAEC and JAMB using Generative AI.',
  keywords: ['WAEC', 'JAMB', 'Exam Prep', 'AI Tutor', 'Nigeria', 'Study Plan'],
  openGraph: {
    title: 'ExamPrep Pro',
    description: 'The ultimate AI-driven WAEC/JAMB exam preparation platform.',
    type: 'website',
    locale: 'en_NG',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ExamPrep Pro',
    description: 'AI-driven WAEC/JAMB preparation.',
  }
};

export const viewport: Viewport = {
  themeColor: '#0f111a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
          <Toaster 
            position="top-center"
            toastOptions={{
              style: {
                background: 'var(--surface)',
                color: 'var(--foreground)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--surface-border)',
                borderRadius: '16px',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
