import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "./Auth.css";

const Waiver = () => {
  const [waiverAccepted, setWaiverAccepted] = useState(false);
  const [localError, setLocalError] = useState("");
  const { acceptWaiver, error, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!waiverAccepted) {
      setLocalError("You must accept the waiver to continue");
      return;
    }

    await acceptWaiver();
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Terms and Waiver</h1>
        <p className="auth-subtitle">Please review and accept to complete sign-up</p>

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
              {localError || error?.message || "Failed to save waiver"}
            </div>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Saving..." : "Accept & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Waiver;
