"use client";

import Link from "next/link";
import { LogOut, Loader } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserButton() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Loader className="size-5 animate-spin text-slate-500" />;
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const initials = session?.user?.name?.charAt(0).toUpperCase() || "U";

  if (!session) {
    return (
      <div className="flex items-center gap-1.5">
        <Link
          href="/sign-in"
          className="hidden h-9 items-center px-3 text-sm font-medium text-slate-700 transition-colors hover:text-[#0A0A0A] sm:inline-flex"
        >
          Sign in
        </Link>
        <Link
          href="/sign-up"
          className="inline-flex h-9 items-center rounded-lg bg-[#1E6FFF] px-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#175ed8]"
        >
          Get started
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg outline-none transition-opacity hover:opacity-80">
        <span className="hidden max-w-28 truncate text-sm font-medium text-slate-700 xl:inline">
          {session.user?.name}
        </span>
        <Avatar className="size-8 border border-slate-200">
          <AvatarImage src={session.user?.image || undefined} />
          <AvatarFallback className="bg-[#0A0A0A] text-xs font-semibold text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={10} className="w-44">
        <DropdownMenuItem
          className="flex h-10 cursor-pointer items-center gap-2 text-red-600 focus:text-red-600"
          onClick={handleSignOut}
        >
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}