'use client';

import { useConvexAuth } from 'convex/react';
import React from 'react';

import { Spinner } from '@/components/spinner';

import Navigation from '@/app/(main)/_components/navigation';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // if (!isAuthenticated) {
  //   return redirect('/');
  // }

  return (
    <div className="flex h-full dark:bg-[#1F1F1F]">
      <Navigation />
      <main className="h-full flex-1 overscroll-y-auto">{children}</main>
    </div>
  );
}
