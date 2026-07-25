import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import ProtectedRoute from "./ProtectedRoute";
const Login = lazy(() => import("../pages/Login/Login"));
const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));
const Projects = lazy(() => import("../pages/Projects/Projects"));
const Deployments = lazy(() => import("../pages/Deployments/Deployments"));
const Notifications = lazy(() => import("../pages/Notifications/Notifications"));
const Monitoring = lazy(() => import("../pages/Monitoring/Monitoring"));
const Profile = lazy(() => import("../pages/Profile/Profile"));
const Settings = lazy(() => import("../pages/Settings/Settings"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));
const Tasks = lazy(() => import("../pages/Tasks/Tasks"));
const Kubernetes = lazy(() => import("../pages/Kubernetes/Kubernetes"));
const Docker = lazy(() => import("../pages/Docker/Docker"));
const Users = lazy(() => import("../pages/Users/Users"));
const Roles = lazy(() => import("../pages/Roles/Roles"));
const Queues = lazy(() => import("../pages/Queues/Queues"));
const Jobs = lazy(() => import("../pages/Jobs/Jobs"));
const Pipelines = lazy(() => import("../pages/Pipelines/Pipelines"));
function PageFallback() { return (<Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><CircularProgress /></Box>); }
export default function AppRoutes() {
  return (
    <BrowserRouter><Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        <Route path="/deployments" element={<ProtectedRoute><Deployments /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/monitoring" element={<ProtectedRoute><Monitoring /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path="/roles" element={<ProtectedRoute><Roles /></ProtectedRoute>} />
        <Route path="/queues" element={<ProtectedRoute><Queues /></ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
        <Route path="/pipelines" element={<ProtectedRoute><Pipelines /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
        <Route path="/kubernetes" element={<ProtectedRoute><Kubernetes /></ProtectedRoute>} />
        <Route path="/docker" element={<ProtectedRoute><Docker /></ProtectedRoute>} />
        <Route path="/home" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense></BrowserRouter>
  );
}
