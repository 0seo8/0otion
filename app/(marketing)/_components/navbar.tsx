'use client';

import { SignInButton, UserButton } from '@clerk/clerk-react';
import { useConvexAuth } from 'convex/react';
import Link from 'next/link';

import { ModeToggle } from '@/components/mode.toggle';
import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';

import Logo from '@/app/(marketing)/_components/Logo';
import { useScrollTop } from '@/hooks/use-scroll-top';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const { isLoading, isAuthenticated } = useConvexAuth();
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
        {isLoading && <Spinner />}
        {!isAuthenticated && !isLoading && (
          <>
            <SignInButton mode="modal">
              <Button size="sm" variant={'ghost'}>
                Log in
              </Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button size="sm">Get Rotion free</Button>
            </SignInButton>
          </>
        )}
        {isAuthenticated && !isLoading && (
          <>
            <Button asChild size="sm" variant="ghost">
              <Link href="/documents">Enter Rotion</Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  );
}
