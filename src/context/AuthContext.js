// context/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { signInWithPopup , signOut , onAuthStateChanged, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase/firebase';


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    })
    return () => unsubscribe();
  } ,[user]);
  
  const logout = () => {
    // Clear the user data on logout
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
