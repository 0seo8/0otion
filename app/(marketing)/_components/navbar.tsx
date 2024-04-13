'use client';

import { ModeToggle } from '@/components/mode.toggle';

import Logo from '@/app/(marketing)/_components/Logo';
import { useScrollTop } from '@/hooks/use-scroll-top';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const scrolled = useScrollTop();
  return (
    <div
      className={cn(
        'z-50 bg-background dark:bg-[#1F1F1F] fixed top-0 flex items-center' + ' p-6' + ' w-full',
        scrolled && 'border-b shadow-sm',
      )}
    >
      <Logo />
      <div className="flex w-full items-center justify-between gap-x-2 md:ml-auto md:justify-end">
        <ModeToggle />
      </div>
    </div>
  );
}
