'use client';

import { useUser } from '@clerk/clerk-react';
import { PlusCircle } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

import { Button } from '@/components/ui/button';

export default function DocumentsPage() {
  const { user } = useUser();

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <Image alt="empty" className=" dark:hidden" height={300} src="/empty.png" width={300} />
      <Image alt="empty" className=" hidden dark:block" height={300} src="/empty-dark.png" width={300} />
      <h2 className="text-lg font-medium">
        Welcome to {user?.firstName !== null ? user?.firstName : 'your'}&apos;s Rotion
      </h2>
      <Button onClick={() => {}}>
        <PlusCircle className="mr-2 size-4" />
        Create a note
      </Button>
    </div>
  );
}
