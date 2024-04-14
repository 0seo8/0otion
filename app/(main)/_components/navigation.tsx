'use client';

import { useMutation } from 'convex/react';
import { ChevronsLeft, MenuIcon, Plus, PlusCircle, Search, Settings } from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { ElementRef, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useMediaQuery } from 'usehooks-ts';

import DocumentList from '@/app/(main)/_components/document-list';
import { Item } from '@/app/(main)/_components/item';
import UserItem from '@/app/(main)/_components/user-item';
import { api } from '@/convex/_generated/api';
import { useSearch } from '@/hooks/use-search';
import { useSettings } from '@/hooks/use-settings';
import { cn } from '@/lib/utils';

export default function Navigation() {
  const router = useRouter();
  const settings = useSettings();
  const search = useSearch();
  const pathname = usePathname();
  const params = useParams();
  const isMobile = useMediaQuery('(max-width: 780px)');

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<'aside'>>(null);
  const navbarRef = useRef<ElementRef<'div'>>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const create = useMutation(api.documents.create);
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    event.stopPropagation();
    isResizingRef.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = event.clientX;

    if (newWidth < 240) {
      newWidth = 240;
    }
    if (newWidth > 400) {
      newWidth = 400;
    }

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty('left', `${newWidth}px`);
      navbarRef.current.style.setProperty('width', `calc(100% - ${newWidth}px)`);
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? `100%` : `240px`;
      navbarRef.current.style.setProperty('left', isMobile ? `100%` : `240px`);
      navbarRef.current.style.setProperty('width', isMobile ? `0` : `calc(100% - 240px)`);
    }

    setTimeout(() => {
      setIsResetting(false);
    }, 300);
  };
  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = `0`;
      navbarRef.current.style.setProperty('left', `0`);
      navbarRef.current.style.setProperty('width', `100%`);
    }

    setTimeout(() => {
      setIsResetting(false);
    }, 300);
  };

  const handleCreate = () => {
    const promise = create({
      title: 'Untitled',
    });

    toast.promise(promise, {
      loading: 'Creating Document',
      success: 'Document Created',
      error: 'Error Creating Document',
    });
  };

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [pathname, isMobile]);

  return (
    <>
      <aside
        className={cn(
          'group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]',
          isResetting && 'transition-all ease-in-out duration-300',
          isMobile && 'w-0 ',
        )}
        ref={sidebarRef}
      >
        <div
          className={cn(
            'h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition',
            isMobile && 'opacity-100',
          )}
          onClick={collapse}
          role="button"
        >
          <ChevronsLeft className="size-6" />
        </div>
        <div>
          <UserItem />
          <Item icon={Search} isSearch label="search" onclick={search.onOpen} />
          <Item icon={Settings} label="Settings" onclick={settings.onOpen} />
          <Item icon={PlusCircle} label="New Page" onclick={handleCreate} />
          <div className="mt-4">
            <DocumentList />
            <Item icon={Plus} label="Add a page" onclick={handleCreate} />
            <div
              className="absolute right-0
              top-0 h-full  w-1 cursor-ew-resize bg-primary/10 opacity-0
              transition group-hover/sidebar:opacity-100"
              onClick={resetWidth}
              onMouseDown={handleMouseDown}
            />
          </div>
        </div>
      </aside>
      <div
        className={cn(
          'absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]',
          isResetting && 'transition-all ease-in-out duration-300',
          isMobile && 'w-full left-0',
        )}
        ref={navbarRef}
      >
        <nav className="w-full bg-transparent px-3 py-2">
          {isCollapsed && <MenuIcon className=" size-6 text-muted-foreground" onClick={resetWidth} role="button" />}
        </nav>
      </div>
    </>
  );
}
