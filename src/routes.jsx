import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import FindPeople from "./pages/FindPeople";
import FindTeams from "./pages/FindTeams";
import TeamDetail from "./pages/TeamDetail";
import CreateTeam from "./pages/CreateTeam";
import Projects from "./pages/Projects";
import CreateProject from "./pages/CreateProject";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import UserProfile from "./pages/UserProfile";
import Notifications from "./pages/Notifications";
import AITeamBuilder from "./pages/AITeamBuilder";
import AIAssistant from "./pages/AIAssistant";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center">
      <div className="text-purple-400 text-lg">Loading...</div>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/find-people" element={<PrivateRoute><FindPeople /></PrivateRoute>} />
      <Route path="/find-teams" element={<PrivateRoute><FindTeams /></PrivateRoute>} />
      <Route path="/teams/new" element={<PrivateRoute><CreateTeam /></PrivateRoute>} />
      <Route path="/teams/:id" element={<PrivateRoute><TeamDetail /></PrivateRoute>} />
      <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
      <Route path="/projects/new" element={<PrivateRoute><CreateProject /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/profile/edit" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
      <Route path="/users/:id" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
      <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
      <Route path="/ai/team-builder" element={<PrivateRoute><AITeamBuilder /></PrivateRoute>} />
      <Route path="/ai/assistant" element={<PrivateRoute><AIAssistant /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
