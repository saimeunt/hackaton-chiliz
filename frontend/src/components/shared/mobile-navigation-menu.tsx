'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Logo } from './logo';
import { Footer } from './footer';
import { PageType } from './desktop-side-menu';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface MobileNavigationMenuProps {
  pages: PageType[];
  pathname: string;
}

export function MobileNavigationMenu({
  pages,
  pathname,
}: MobileNavigationMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="p-2">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          <div className="flex flex-col h-full">
            <div className="p-6">
              <Link href="/" onClick={() => setOpen(false)}>
                <Logo iconSize="sm" textSize="md" />
              </Link>
            </div>

            <nav className="flex-1 px-6 space-y-1">
              {pages.map((page) => {
                const isActive = pathname === page.url;
                const Icon = page.icon;

                return (
                  <Link
                    key={page.url}
                    href={page.url}
                    onClick={() => setOpen(false)}
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
            </nav>

            <div className="p-6">
              <Footer />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
