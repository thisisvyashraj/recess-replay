import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Confessions from "./pages/Confessions";
import Leaderboard from "./pages/Leaderboard";
import GamesLibrary from "./pages/GamesLibrary";
import GamePlay from "./pages/GamePlay";
import AdminPanel from "./pages/AdminPanel";
import RoomsHome from "./pages/RoomsHome";
import RoomsCreate from "./pages/RoomsCreate";
import RoomPage from "./pages/RoomPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function PublicOnly({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return children;
}

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" theme="system" />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
            <Route path="/welcome" element={<PublicOnly><Welcome /></PublicOnly>} />
            <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/signup" element={<PublicOnly><Signup /></PublicOnly>} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/confessions" element={<ProtectedRoute><Confessions /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="/games" element={<ProtectedRoute><GamesLibrary /></ProtectedRoute>} />
            <Route path="/games/:slug" element={<ProtectedRoute><GamePlay /></ProtectedRoute>} />
            <Route path="/rooms" element={<ProtectedRoute><RoomsHome /></ProtectedRoute>} />
            <Route path="/rooms/new" element={<ProtectedRoute><RoomsCreate /></ProtectedRoute>} />
            <Route path="/rooms/:code" element={<ProtectedRoute><RoomPage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
