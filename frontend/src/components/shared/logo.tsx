'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export function Logo({ size = 'full', className = '' }: LogoProps) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    full: 'w-full max-w-[200px] h-auto',
  };

  // Handle hydration issue
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`${sizeClasses[size]} ${className}`}>
        <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg animate-pulse"></div>
      </div>
    );
  }

  // Determine which logo to use
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';
  const logoSrc = isDark ? '/logoVectoDarkMode.png' : '/logoVectoLightMode.png';

  return (
    <div className={`${sizeClasses[size]} p-4 ${className}`}>
      <Image
        src={logoSrc}
        alt="Clash of FanZ Logo"
        width={200}
        height={200}
        className="w-full h-auto object-contain"
        priority
      />
    </div>
  );
}
