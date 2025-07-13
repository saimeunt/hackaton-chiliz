'use client';

import Link from 'next/link';
import { Logo } from './logo';
import { Footer } from './footer';

export type PageType = {
  count: number | null;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  url: string;
};

interface DesktopSideMenuProps {
  regularPages: PageType[];
  adminPages: PageType[];
  pathname: string;
}

export function DesktopSideMenu({
  regularPages,
  adminPages,
  pathname,
}: DesktopSideMenuProps) {
  return (
    <div className="fixed left-0 top-0 h-screen w-[220px] lg:w-[280px] border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col justify-between hidden md:block">
      <div className="flex flex-col h-full">
        <div className="p-4 lg:p-6">
          <Link href="/">
            <Logo size="full" />
          </Link>
        </div>

        <nav className="flex-1 px-4 lg:px-6 space-y-1">
          {regularPages.map((page) => {
            const isActive = pathname === page.url;
            const Icon = page.icon;

            return (
              <Link
                key={page.url}
                href={page.url}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-purple-100 text-purple-900 dark:bg-purple-900/20 dark:text-purple-200'
                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700 dark:text-gray-300 dark:hover:bg-purple-900/10 dark:hover:text-purple-300'
                }`}
              >
                <Icon className="mr-3 h-4 w-4" />
                {page.label}
              </Link>
            );
          })}

          {adminPages.length > 0 && (
            <>
              <div className="px-3 py-2">
                <div className="border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="px-3 py-1">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Admin
                </span>
              </div>
              {adminPages.map((page) => {
                const isActive = pathname === page.url;
                const Icon = page.icon;

                return (
                  <Link
                    key={page.url}
                    href={page.url}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-purple-100 text-purple-900 dark:bg-purple-900/20 dark:text-purple-200'
                        : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700 dark:text-gray-300 dark:hover:bg-purple-900/10 dark:hover:text-purple-300'
                    }`}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {page.label}
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        <div className="p-4 lg:p-6">
          <Footer />
        </div>
      </div>
    </div>
  );
}
