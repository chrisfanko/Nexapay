"use client";

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from './button';

const UserButton = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center">
        <Loader className='size-5 animate-spin text-white' />
      </div>
    )
  }

  const avatarFallback = session?.user?.name?.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/")
  }

  return (
    <div className="flex items-center">
      {session ? (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className='outline-none'>
            <div className='flex gap-3 items-center'>
              <span className='text-white text-sm font-medium'>{session.user?.name}</span>
              <Avatar className='size-8 hover:opacity-75 transition'>
                <AvatarImage src={session.user?.image || undefined} />
                <AvatarFallback className='bg-sky-900 text-white text-sm'>
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='center' side='bottom' className='w-50'>
            <DropdownMenuItem className='h-10' onClick={() => handleSignOut()}>
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className='flex items-center gap-3'>
          <Button size="sm" variant="ghost" className='text-white hover:text-white hover:bg-white/20'>
            <Link href={"sign-in"}>Sign In</Link>
          </Button>
          <Button size="sm" className='bg-white text-blue-500 hover:bg-white/90'>
            <Link href={"sign-up"}>Sign Up</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

export default UserButton;