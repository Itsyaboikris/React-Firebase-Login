import React, {useContext, useEffect, useState} from "react";
import {auth, db} from "../firebase/firebase";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({children}) {

    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    function signup(email, password, value) {

        const {firstName, lastName} = value

        return auth.createUserWithEmailAndPassword(email, password).then( (user) => {

            db.collection("users").doc(user.user.uid)
                .set({firstName, lastName})
            return auth.currentUser.updateProfile({displayName: `${firstName} ${lastName}`});
        });
    }

    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password);
    }

    async function getUserData(){

    }

    function logout() {
        return auth.signOut();
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email);
    }

    function updateEmail(email){
        return currentUser.updateEmail(email);
    }

    function updatePassword(password){
        return currentUser.updatePassword(password);
    }

    function updateUserDoc(values){
        const {firstName, lastName} = values;

        auth.currentUser.updateProfile({displayName: `${firstName} ${lastName}`})

        return db.collection("users")
            .doc(currentUser.uid)
            .update({firstName, lastName});

    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(
            user => {
                setCurrentUser(user);
                getUserData();
                setLoading(false);
            }
        )

        return unsubscribe;
    }, [])



    const value = {
        currentUser,
        login,
        logout,
        signup,
        resetPassword,
        updateEmail,
        updatePassword,
        getUserData,
        updateUserDoc,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}