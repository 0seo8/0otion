'use client';

import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react';
import { PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { api } from '@/convex/_generated/api';

export default function DocumentsPage() {
  const router = useRouter();
  const { user } = useUser();
  const create = useMutation(api.documents.create);

  const onCreate = () => {
    // const promise = create({
    //   title: 'New Document',
    // }).then((documentId) => {
    //   router.push(`/documents/${documentId}`);
    // });

    const promise = create({ title: 'Untitled' });

    toast.promise(promise, {
      loading: 'Creating document...',
      success: 'Document created!',
      error: 'Error creating document',
    });
  };

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <Image alt="empty" className=" dark:hidden" height={300} src="/empty.png" width={300} />
      <Image alt="empty" className=" hidden dark:block" height={300} src="/empty-dark.png" width={300} />
      <h2 className="text-lg font-medium">
        Welcome to {user?.firstName !== null ? user?.firstName : 'your'}&apos;s Rotion
      </h2>
      <Button onClick={onCreate}>
        <PlusCircle className="mr-2 size-4" />
        Create a note
      </Button>
    </div>
  );
}
