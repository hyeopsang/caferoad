import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-config";
import { loginSuccess, logout } from "./redux/authSlice";
import { AppRouter } from "./AppRouter";
import { useDispatch } from "react-redux";
import { RefProvider } from "./context/RefContext";

export default function App() {
  return (
    <RefProvider>
      <RouterProvider router={AppRouter} />
    </RefProvider>
  );
}
