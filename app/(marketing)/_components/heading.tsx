'use client';

import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function Heading() {
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl font-bold sm:text-5xl md:text-6xl">
        Your Ideas,Documents, & Plans. Unified. Welcome to <span className="underline">Rosion</span>
      </h1>
      <h3 className="text-base font-medium sm:text-xl md:text-2xl">
        Rosion is the connected workspace where better, faster work happens.
      </h3>
      <Button>
        Enter Rotion
        <ArrowRight className="ml-2 size-4" />
      </Button>
    </div>
  );
}
