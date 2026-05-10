import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { BottomNav } from "./BottomNav";

export function AppShell({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) {
  const { pathname } = useLocation();
  return (
    <div className={`mx-auto min-h-screen w-full max-w-md ${hideNav ? "" : "pb-28"}`}>
      <div key={pathname} className="page-enter">{children}</div>
      {!hideNav && <BottomNav />}
    </div>
  );
}
