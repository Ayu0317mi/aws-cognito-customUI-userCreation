import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <button onClick={logout} className="logout-button">
            Sign Out
          </button>
        </div>

        <div className="user-info">
          <h2>Welcome back! 👋</h2>
          
          <div className="info-section">
            <h3>Account Information</h3>
            
            <div className="info-row">
              <span className="info-label">User ID:</span>
              <span className="info-value">{user.userId || user.username}</span>
            </div>

            <div className="info-row">
              <span className="info-label">Username:</span>
              <span className="info-value">{user.username}</span>
            </div>

            {user.signInDetails && (
              <div className="info-row">
                <span className="info-label">Sign In Method:</span>
                <span className="info-value">
                  {user.signInDetails.loginId || "Email"}
                </span>
              </div>
            )}
          </div>

          <div className="info-section">
            <h3>Session Details</h3>
            <div className="session-status">
              <span className="status-badge">Active</span>
              <span className="status-text">You are currently signed in</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;