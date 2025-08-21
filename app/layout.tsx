import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

const robotoMono = Roboto_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'DocNotes - Therapy Session Management',
  description: 'Professional therapy session note-taking with AI transcription',
  icons: {
    icon: '/icon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={`${inter.variable} ${robotoMono.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <SidebarProvider>
          <AppSidebar />
          <main className='flex flex-grow flex-col'>
            <SidebarTrigger className='p-6' />
            {children}
          </main>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
