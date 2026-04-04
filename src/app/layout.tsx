import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ExamPrep Pro - AI Diagnostic Toolkit',
  description: 'Identify your knowledge gaps and build a personalized study guide for WAEC and JAMB.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
