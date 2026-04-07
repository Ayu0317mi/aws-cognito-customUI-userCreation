import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import "./Auth.css";

const Signup = () => {
  // Step management
  const [step, setStep] = useState(1); // 1: User info, 2: Waiver
  
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [waiverAccepted, setWaiverAccepted] = useState(false);
  
  const { signup, error, loading } = useAuth();
  const [localError, setLocalError] = useState("");

  const handleNext = (e) => {
    e.preventDefault();
    setLocalError("");

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters");
      return;
    }

    // Move to waiver step
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setLocalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!waiverAccepted) {
      setLocalError("You must accept the waiver to continue");
      return;
    }

    // Create waiver acceptance data with timestamp
    const waiverData = JSON.stringify({
      accepted: true,
      timestamp: new Date().toISOString()
    });

    await signup(email, password, email, name, waiverData);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {step === 1 ? (
          <>
            <h1>Create Account</h1>
            <p className="auth-subtitle">Sign up to get started</p>
            
            <form onSubmit={handleNext} className="auth-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  required
                />
              </div>

              {localError && (
                <div className="error-message">
                  {localError}
                </div>
              )}

              <button 
                type="submit" 
                className="auth-button"
              >
                Next
              </button>
            </form>

            <p className="auth-link">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </>
        ) : (
          <>
            <h1>Terms and Waiver</h1>
            <p className="auth-subtitle">Please review and accept to continue</p>
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="waiver-content">
                <div className="waiver-text">
                  <h3>Terms of Service & Waiver Agreement</h3>
                  <p>
                    By using this service, you acknowledge and agree to the following terms:
                  </p>
                  <ul>
                    <li>You are at least 18 years of age or have parental consent.</li>
                    <li>You agree to use this service in accordance with all applicable laws.</li>
                    <li>You understand that your data will be processed according to our Privacy Policy.</li>
                    <li>You release the service provider from any liability arising from your use of the service.</li>
                    <li>You agree to receive communications related to your account.</li>
                  </ul>
                  <p>
                    This is a binding agreement. Please read carefully before accepting.
                  </p>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={waiverAccepted}
                      onChange={(e) => setWaiverAccepted(e.target.checked)}
                      required
                    />
                    <span>I have read and accept the Terms of Service and Waiver Agreement</span>
                  </label>
                </div>
              </div>

              {(error || localError) && (
                <div className="error-message">
                  {localError || error?.message || "Failed to sign up"}
                </div>
              )}

              <div className="button-group">
                <button 
                  type="button"
                  className="auth-button secondary"
                  onClick={handleBack}
                  disabled={loading}
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  className="auth-button"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Sign Up"}
                </button>
              </div>
            </form>

            <p className="auth-link">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;