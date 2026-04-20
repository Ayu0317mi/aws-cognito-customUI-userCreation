import { createContext, useContext, useState, useEffect } from "react";

import {
    signIn,
    signUp,
    confirmSignUp,
    signOut,
    getCurrentUser,
    autoSignIn,
    signInWithRedirect,
    fetchUserAttributes,
    updateUserAttributes,
} from "aws-amplify/auth";

import { Hub } from "aws-amplify/utils";

import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [waiverAccepted, setWaiverAccepted] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const getUser = async () => {
        try {
            const currentUser = await getCurrentUser();
            let waiver = true;
            try {
                const attrs = await fetchUserAttributes();
                const isFederated = !!attrs.identities;
                waiver = !isFederated || !!attrs['custom:waiver_accepted'];
            } catch {
                waiver = true;
            }
            setWaiverAccepted(waiver);
            setUser(currentUser);
        } catch (err) {
            setUser(null);
            setWaiverAccepted(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUser();

        // Listen for OAuth sign-in events
        const hubListenerCancel = Hub.listen('auth', ({ payload }) => {
            switch (payload.event) {
                case 'signInWithRedirect':
                    // Re-fetch user and attributes after external provider OAuth redirect.
                    // ProtectedRoute handles routing based on waiverAccepted state.
                    getUser();
                    break;
                case 'signInWithRedirect_failure':
                    setError(payload.data);
                    setLoading(false);
                    break;
            }
        });

        return () => hubListenerCancel();
    }, []);

    const login = async (username, password) => {
        try {
            setError(null);
            await signIn({ username, password });
            await getUser();
            navigate("/dashboard");
        } catch (err) {
            console.error("Error logging in: ", err);
            setError(err);
        }
    };

    const signup = async (username, password, email, name, waiverData) => {
        try {
            setError(null);
            const attributes = { email };
            if (name) {
                attributes.name = name;
            }
            if (waiverData) {
                attributes["custom:waiver_accepted"] = waiverData;
            }
            await signUp({
                username,
                password,
                options: {
                    userAttributes: attributes,
                    autoSignIn: { enabled: true }
                },
            });
            navigate("/confirm");
        } catch (err) {
            console.error("Error signing up: ", err);
            setError(err);
        }
    };

    const confirmUser = async (username, code) => {
        try {
            await confirmSignUp({ username, confirmationCode: code });
            await autoSignIn();
            await getUser();
            navigate("/dashboard");
        } catch (err) {
            console.error("Error confirming user: ", err);
            setError(err);
        }
    };

    const logout = async () => {
        try {
            await signOut();
            setUser(null);
            setWaiverAccepted(false);
            navigate("/login");
        } catch (err) {
            console.error("Error logging out: ", err);
            setError(err);
        }
    };

    const loginWithGoogle = async () => {
        try {
            setError(null);
            await signInWithRedirect({ provider: 'Google' });
        } catch (err) {
            console.error("Error signing in with Google: ", err);
            setError(err);
        }
    };

    const acceptWaiver = async () => {
        try {
            setError(null);
            const waiverData = JSON.stringify({
                accepted: true,
                timestamp: new Date().toISOString(),
            });
            await updateUserAttributes({
                userAttributes: { "custom:waiver_accepted": waiverData },
            });
            setWaiverAccepted(true);
            navigate("/dashboard");
        } catch (err) {
            console.error("Error saving waiver: ", err);
            setError(err);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                waiverAccepted,
                error,
                loading,
                login,
                signup,
                confirmUser,
                logout,
                loginWithGoogle,
                acceptWaiver,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};