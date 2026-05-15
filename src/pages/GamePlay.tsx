import { Suspense, useState, useCallback } from "react";
import { useParams, Navigate } from "react-router-dom";
import { findGame } from "@/games/registry";
import { ReplayContext } from "@/games/useReplay";

export default function GamePlay() {
  const { slug = "" } = useParams();
  const game = findGame(slug);
  const [nonce, setNonce] = useState(0);
  const replay = useCallback(() => setNonce(n => n + 1), []);
  if (!game) return <Navigate to="/games" replace />;
  const C = game.Component;
  return (
    <ReplayContext.Provider value={replay}>
      <Suspense fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-12 w-12 rounded-full border-4 border-accent/30 border-t-accent animate-spin" />
        </div>
      }>
        <C key={nonce} />
      </Suspense>
    </ReplayContext.Provider>
  );
}
