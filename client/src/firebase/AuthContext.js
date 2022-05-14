import React, { useContext, useState, useEffect } from "react";
import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    updateProfile,
} from "firebase/auth";
import { auth } from "./Firebase";

const AuthContext = React.createContext();

const googleProvider = new GoogleAuthProvider();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    const signup = async (name, email, password) => {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(res.user, {
            displayName: name,
        });
        return res;
    };

    const signInWithGoogle = async () => {
        return await signInWithPopup(auth, googleProvider);
    };

    const login = async (email, password) => {
        return await signInWithEmailAndPassword(auth, email, password);
    };

    const logout = async () => {
        return await signOut(auth);
    };

    const resetPassword = async (email) => {
        return await sendPasswordResetEmail(auth, email);
    };

    const updateName = async (name) => {
        //console.log(currentUser);
        return await updateProfile(currentUser, { displayName: name });
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        login,
        signup,
        signInWithGoogle,
        logout,
        resetPassword,
        updateName,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
