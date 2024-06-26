'use client';
import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react';
import { ChevronDown, ChevronRight, LucideIcon, MoreHorizontal, Plus, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';

interface ItemProps {
  id?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;
  label: string;
  onclick?: () => void;
  icon: LucideIcon;
  documentIcon?: string;
}
export const Item = ({
  id,
  label,
  onclick,
  icon: Icon,
  active,
  documentIcon,
  isSearch,
  level = 0,
  onExpand,
  expanded,
}: ItemProps) => {
  const user = useUser();
  const create = useMutation(api.documents.create);
  const archive = useMutation(api.documents.archive);
  const router = useRouter();

  const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    if (!id) return;
    const promise = archive({ id: id as Id<'documents'> }).then(() => {
      router.push('/documents');
    });
    toast.promise(promise, {
      loading: 'Archiving document...',
      success: 'Document archived!',
      error: 'Failed to archive document',
    });
  };

  const handleExpand = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    onExpand?.();
  };

  const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    if (!id) return;
    const promise = create({
      title: 'New Document',
      parentDocument: id as Id<'documents'>,
    }).then((documentId) => {
      if (!expanded) onExpand?.();
      router.push(`/documents/${documentId}`);
    });
    toast.promise(promise, {
      loading: 'Creating document...',
      success: 'Document created!',
      error: 'Failed to create document',
    });
  };

  const ChevronIcon = expanded ? ChevronDown : ChevronRight;
  return (
    <div
      className={cn(
        ' group min-h-[27px] text-sm py-1 pr-3 w-full  hover:bg-primary/5 flex items-center text-muted-foreground font-medium',
        active && 'bg-primary/15',
      )}
      onClick={onclick}
      role="button"
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : '12px' }}
    >
      {!!id && (
        <div
          className="mr-1 h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
          onClick={handleExpand}
          role="button"
        >
          <ChevronIcon className=" size-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}

      {documentIcon ? (
        <div className=" mr-2 shrink-0 text-[18px]">{documentIcon}</div>
      ) : (
        <Icon className=" mr-2 size-[18px] shrink-0 text-muted-foreground" />
      )}

      <span className=" truncate">{label}</span>
      {isSearch && (
        <kbd
          className=" pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5
        font-mono text-[10px] font-medium text-muted-foreground opacity-100"
        >
          <span className=" text-xs ">⌘</span>K
        </kbd>
      )}
      {!!id && (
        <div className=" ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <div
                className=" ml-auto h-full rounded-sm opacity-0 hover:bg-neutral-300 group-hover:opacity-100 dark:hover:bg-neutral-600"
                role="button"
              >
                <MoreHorizontal className=" size-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className=" w-60" forceMount side="right">
              <DropdownMenuItem
                onClick={(e) => {
                  onArchive(e);
                }}
              >
                <Trash className=" mr-2 inline-block size-4" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="p-2 text-xs text-muted-foreground">Las edited by: {user?.user?.fullName}</div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            className=" ml-auto h-full rounded-sm opacity-0 hover:bg-neutral-300 group-hover:opacity-100 dark:hover:bg-neutral-600"
            onClick={onCreate}
            role="button"
          >
            <Plus className=" size-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      className=" flex gap-x-2 py-[3px]"
      style={{
        paddingLeft: level ? `${level * 12 + 25}px` : '12px',
      }}
    >
      <Skeleton className=" size-4" />
      <Skeleton className=" h-4 w-[30%]" />
    </div>
  );
};
