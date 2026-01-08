"use client"

import { ProfileProvider } from "./ProfileProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ProfileProvider>{children}</ProfileProvider>;
}
