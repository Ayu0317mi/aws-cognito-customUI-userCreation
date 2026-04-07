import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import "./Auth.css";

const ConfirmUser = () => {
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const { confirmUser, error, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await confirmUser(username, code);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Verify Your Email</h1>
        <p className="auth-subtitle">
          Enter the verification code sent to your email
        </p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Email</label>
            <input
              id="username"
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="code">Verification Code</label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength="6"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              {error.message || "Failed to verify code"}
            </div>
          )}

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <p className="auth-link">
          Back to <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default ConfirmUser;