import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Rosion',
  description: 'The connected workspace where better, faster work happens',
  icons: [
    {
      media: '(prefers-color-scheme:light)',
      url: '/logo.png',
      href: 'logo.png',
    },
    {
      media: '(prefers-color-scheme:dark)',
      url: '/logo_dark.png',
      href: 'logo_dark.png',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
