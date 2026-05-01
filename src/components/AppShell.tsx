import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function AppShell({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) {
  return (
    <div className={`mx-auto min-h-screen w-full max-w-md page-enter ${hideNav ? "" : "pb-28"}`}>
      {children}
      {!hideNav && <BottomNav />}
    </div>
  );
}
