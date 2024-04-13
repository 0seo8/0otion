import { Poppins } from 'next/font/google';
import Image from 'next/image';
import React from 'react';

import { cn } from '@/lib/utils';

const font = Poppins({
  subsets: ['latin'],
  weight: ['400', '500'],
});

export default function Logo() {
  return (
    <div className="hidden items-center gap-x-2 md:flex">
      <Image alt="logo" height={20} src="/logo.png" width={20} />
      <p className={cn('font-semibold', font.className)}>Rotion</p>
    </div>
  );
}
