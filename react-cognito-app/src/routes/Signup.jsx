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
  
  const { signup, loginWithGoogle, error, loading } = useAuth();
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

    const waiverData = JSON.stringify({
      accepted: true,
      timestamp: new Date().toISOString()
    });

    await signup(email, password, email, name, waiverData);
  };

  const handleGoogleSignIn = async () => {
    await loginWithGoogle();
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {step === 1 ? (
          <>
            <h1>Create Account</h1>
            <p className="auth-subtitle">Sign up to get started</p>

            <button
              type="button"
              className="google-button"
              onClick={handleGoogleSignIn}
            >
              <svg className="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <div className="divider">
              <span>OR</span>
            </div>

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
                  <h3>Terms of Service &amp; Waiver Agreement</h3>
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
