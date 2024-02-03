// components/Layout.js
"use client";
import Navbar from "./navbar";
import { AuthProvider, useAuth } from "../context/AuthContext";

const Layout = ({ children }) => {
  return (
    <AuthProvider>
      <div>
        <Navbar />
        <div className="container mt-4">{children}</div>
      </div>
    </AuthProvider>
  );
};

export default Layout;
