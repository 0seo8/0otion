'use client';
import { SignOutButton, useUser } from '@clerk/clerk-react';
import { ChevronsLeftRight } from 'lucide-react';
import React from 'react';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function UserItem() {
  const { user } = useUser();

  console.log('user', user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className=" flex w-full items-center p-3 text-sm hover:bg-primary/5" role="button">
          <div className="flex max-w-[150px] items-center gap-x-2">
            <Avatar className=" size-5">
              <AvatarImage src={user?.imageUrl} />
            </Avatar>
            <span className=" line-clamp-1 text-start font-medium">{user?.username}</span>
          </div>
          <ChevronsLeftRight className=" ml-2 size-4 rotate-90 text-muted-foreground" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" alignOffset={11} className=" w-80" forceMount>
        <div className=" flex flex-col space-y-4 p-2">
          <p className="text-xs font-medium leading-none text-muted-foreground">
            {user?.emailAddresses[0]?.emailAddress}
          </p>
          <div className=" flex items-center gap-x-2">
            <div className=" rounded-md bg-secondary p-1">
              <Avatar className=" size-8">
                <AvatarImage src={user?.imageUrl} />
              </Avatar>
            </div>
            <div className=" space-y-1">
              <p className=" line-clamp-1 text-sm">{user?.fullName}&apos;s Otion</p>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className=" w-full cursor-pointer text-muted-foreground">
          <SignOutButton>Log out</SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
