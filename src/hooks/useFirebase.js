/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import initializeAuthentication from "../firebase/firebase.init";
import { toast } from 'react-toastify';

initializeAuthentication();
const useFirebase = () => {
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const auth = getAuth();
    const googleProvider = new GoogleAuthProvider();

    ///////// GOOGLE SIGN IN POPUP //////////
    const signInUsingGoogle = () => {
        setIsLoading(true);
        signInWithPopup(auth, googleProvider)
            .then(result => {
                setUser(result.user);
                console.log(result.user);
                // eslint-disable-next-line no-unused-expressions
                toast.success('User Successfully Signed In via Google')
                setTimeout(() => {
                    window.location.href = "https://shahriar-gymnesia.web.app/";
                }, 2000)
                ////////// SET ERROR //////////
            }).catch(error => {
                setError(error.message)
            }).finally(() => setIsLoading(false));
    }
    ////////// USER LOG OUT //////////
    const logOut = () => {
        setIsLoading(true);
        signOut(auth)
            .then(() => {
                setUser({});
                toast.success('User Successfully Logged Out')
                setTimeout(() => {
                    window.location.href = "https://shahriar-gymnesia.web.app/";
                }, 2000)
            }).finally(() => setIsLoading(false))
    }
    /////// OBSERVE WHEATHER AUTH STATE CHANGED OR NOT ///////

    useEffect(() => {
        const unsubscribed = onAuthStateChanged(auth, user => {
            if (user) {
                console.log('inside state changed', user);
                setUser(user);
            }
            else {
                setUser({})
            }
            setIsLoading(false);
        });
        return () => unsubscribed;
    }, [])

    return {
        signInUsingGoogle,
        isLoading,
        user,
        error,
        logOut
    }
}

export default useFirebase;