import React, { useEffect } from 'react';
import { RouterProvider } from "react-router-dom";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase-config';
import { loginSuccess, logout } from './redux/authSlice';
import { AppRouter } from "./AppRouter";
import { useDispatch } from 'react-redux';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Dispatch only serializable fields
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };
        dispatch(loginSuccess(userData));
      } else {
        dispatch(logout());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return <RouterProvider router={AppRouter} />;
}
