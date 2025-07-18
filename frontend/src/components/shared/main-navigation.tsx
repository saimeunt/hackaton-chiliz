'use client';

import {
  Trophy,
  Users,
  TrendingUp,
  UserCircle,
  Plus,
  List,
  Medal,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { usePathname } from 'next/navigation';
import {
  DesktopSideMenu,
  PageType,
} from '@/components/shared/desktop-side-menu';
import { MobileNavigationMenu } from '@/components/shared/mobile-navigation-menu';
import { useAdmin } from '@/hooks/useAdmin';

export function MainNavigation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAdmin } = useAdmin();

  const regularPages: PageType[] = [
    {
      count: null,
      icon: TrendingUp,
      label: 'Live Bets',
      url: '/live-bets',
    },
    {
      count: null,
      icon: Trophy,
      label: 'Achievements',
      url: '/achievements',
    },
    {
      count: null,
      icon: Users,
      label: 'Community',
      url: '/community',
    },
    {
      count: null,
      icon: UserCircle,
      label: 'Profile',
      url: '/profile',
    },
    {
      count: null,
      icon: Medal,
      label: 'Leaderboard',
      url: '/leaderboard',
    },
  ];

  const adminPages: PageType[] = isAdmin
    ? [
        {
          count: null,
          icon: Plus,
          label: 'Create Match',
          url: '/admin/create-match',
        },
        {
          count: null,
          icon: List,
          label: 'Manage Matches',
          url: '/admin/matches',
        },
      ]
    : [];

  return (
    <div className="min-h-screen font-dm-sans">
      {/* Desktop Sidebar */}
      <DesktopSideMenu
        regularPages={regularPages}
        adminPages={adminPages}
        pathname={pathname}
      />

      {/* Main content - offset to leave space for fixed menu */}
      <div className="md:ml-[220px] lg:ml-[280px] flex flex-col min-h-screen">
        <header className="flex h-14 items-center gap-4 border-b bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 px-4 lg:h-[60px] lg:px-6">
          {/* Mobile Navigation */}
          <MobileNavigationMenu
            regularPages={regularPages}
            adminPages={adminPages}
            pathname={pathname}
          />

          <div className="w-full flex-1"></div>
          <ThemeToggle />
          <appkit-button />
        </header>
        <div className="flex flex-1 flex-col">
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 w-full max-w-screen-md place-self-center bg-gray-50 dark:bg-gray-950">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
