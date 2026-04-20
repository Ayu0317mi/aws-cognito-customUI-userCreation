import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./routes/Login";
import Signup from "./routes/Signup";
import ConfirmUser from "./routes/ConfirmUser";
import Dashboard from "./routes/Dashboard";
import Waiver from "./routes/Waiver";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/confirm" element={<ConfirmUser />} />
                </Route>
                <Route element={<ProtectedRoute />}>
                    <Route path="/waiver" element={<Waiver />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </AuthProvider>
    )
}