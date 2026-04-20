import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, redirectPath = "/login" }) {
    const { user, waiverAccepted, loading } = useAuth();
    const location = useLocation();

    if (loading) return null;
    if (!user) return <Navigate to={redirectPath} replace />;
    if (!waiverAccepted && location.pathname !== "/waiver") {
        return <Navigate to="/waiver" replace />;
    }
    return children ? <>{children}</> : <Outlet />;
}