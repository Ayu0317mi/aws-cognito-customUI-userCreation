import { createContext, useContext, useState, useEffect } from "react";

import {
    signIn,
    signUp,
    confirmSignUp,
    signOut,
    getCurrentUser,
    autoSignIn,
    signInWithRedirect,
} from "aws-amplify/auth";

import { Hub } from "aws-amplify/utils";

import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const getUser = async () => {
        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch (err) {
            console.error("Error fetching user: ", err);
            setUser(null);
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
                    getUser().then(() => navigate("/dashboard"));
                    break;
                case 'signInWithRedirect_failure':
                    setError(payload.data);
                    break;
                case 'customOAuthState':
                    // Handle custom state if needed
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

    const signup = async (username, password, email, name) => {
        try {
            setError(null);
            const attributes = { email };
            if (name) {
                attributes.name = name;
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

    return (
        <AuthContext.Provider
            value={{
                user,
                error,
                loading,
                login,
                signup,
                confirmUser,
                logout,
                loginWithGoogle,
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