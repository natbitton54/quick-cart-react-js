import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { clearCart, setCartItems } from '../../redux/actions/cartActions';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to update localStorage based on rememberMe status
const updateRememberMe = (uid, rememberMe) => {
    if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('userUID', uid);
    } else {
        sessionStorage.setItem('rememberMe', 'false');
        sessionStorage.setItem('userUID', uid);
    }
};

const register = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

const login = async (email, password, rememberMe = false) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        updateRememberMe(userCredential.user.uid, rememberMe);
        return userCredential.user;
    } catch (err) {
        throw new Error(err);
    }
};

const logout = async () => {
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    const storageType = rememberMe ? localStorage : sessionStorage;
    const userUID = rememberMe ? localStorage.getItem('userUID') : sessionStorage.getItem('userUID');

    // Save the current cart items to the appropriate storage before logging out
    const cartItems = JSON.parse(storageType.getItem(`cart-${userUID}`) || '[]');
    storageType.setItem(`cart-${userUID}`, JSON.stringify(cartItems));

    localStorage.removeItem('rememberMe');
    localStorage.removeItem('userUID');
    sessionStorage.removeItem('rememberMe');
    sessionStorage.removeItem('userUID');

    await signOut(auth);
};
const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
};

const signInWithGoogle = async (rememberMe = false) => {
    try {
        const userCredential = await signInWithPopup(auth, new GoogleAuthProvider());
        updateRememberMe(userCredential.user.uid, rememberMe);
        return userCredential.user;
    } catch (err) {
        throw new Error(err);
    }
};

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const rememberMe = localStorage.getItem('rememberMe') === 'true';
                const updatedUser = { ...user, rememberMe };
                setCurrentUser(updatedUser);

                // Load the cart items from the appropriate storage when the user logs in
                const storageType = rememberMe ? localStorage : sessionStorage;
                const storedCartItems = JSON.parse(storageType.getItem(`cart-${user.uid}`) || '[]');
                dispatch(setCartItems(storedCartItems));
            } else {
                setCurrentUser(null);
                dispatch(clearCart());
            }
            setLoading(false);
        });

        return unsubscribe;
    }, [dispatch]);

    const value = {
        currentUser,
        register,
        login,
        logout,
        resetPassword,
        signInWithGoogle,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export { auth, db, register };