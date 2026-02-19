// components/ClientSessionProvider.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

export const ClientSessionProvider = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
