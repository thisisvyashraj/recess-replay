import { Suspense } from "react";
import { useParams, Navigate } from "react-router-dom";
import { findGame } from "@/games/registry";

export default function GamePlay() {
  const { slug = "" } = useParams();
  const game = findGame(slug);
  if (!game) return <Navigate to="/games" replace />;
  const C = game.Component;
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-accent/30 border-t-accent animate-spin" />
      </div>
    }>
      <C />
    </Suspense>
  );
}
