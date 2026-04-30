import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-md pb-24">
      {children}
      <BottomNav />
    </div>
  );
}
