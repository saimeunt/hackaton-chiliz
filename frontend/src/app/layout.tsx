import type { Metadata } from 'next';
import { Inter as FontSans, Rubik, DM_Sans } from 'next/font/google';
import '@/app/globals.css';
import { cn } from '@/lib/utils';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/contexts/theme-provider';
import { MainNavigation } from '@/components/shared/main-navigation';
import { Web3Provider } from '@/contexts/web3-provider';
import { Footer } from '@/components/shared/footer';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontRubik = Rubik({
  subsets: ['latin'],
  variable: '--font-rubik',
});

const fontDmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: 'Clash of fanZ - Sports Betting Platform',
  description:
    'Join the ultimate sports betting experience with Clash of fanZ. Place your bets, earn achievements, and connect with the community.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-gray-50 dark:bg-gray-950 font-dm-sans antialiased',
          fontSans.variable,
          fontRubik.variable,
          fontDmSans.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Web3Provider>
            <MainNavigation>
              <div className="flex-1">{children}</div>
              {/* Footer for mobile only - hidden on desktop since it's in the sidebar */}
              <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 py-4 md:hidden">
                <Footer />
              </footer>
            </MainNavigation>
            <Sonner
              toastOptions={{
                classNames: {
                  info: 'dark:bg-gray-800 dark:text-white bg-gray-200',
                  error: 'dark:bg-red-700 dark:text-white bg-red-500',
                  success: 'dark:bg-green-700 dark:text-white bg-green-400',
                },
                duration: 4000,
              }}
            />
            <Toaster />
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
