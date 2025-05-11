"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      setUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        isAdmin: session.user.isAdmin,
        accessToken: session.accessToken, // Google access token if available
      });
    } else {
      setUser(null);
    }
    setLoading(status === "loading");
  }, [session, status]);

  const login = async (email, password) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (!result.ok) {
        return { success: false, message: result.error || "Login failed" };
      }
      return { success: true };
    } catch (error) {
      return { success: false, message: "An unexpected error occurred" };
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signIn("google", { redirect: false });
      return { success: true };
    } catch (error) {
      return { success: false, message: "Google login failed", error: error };
    }
  };
  const register = async (name, email, password) => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message };
      }

      // Auto login after registration
      const loginResult = await login(email, password);
      return loginResult;
    } catch (error) {
      return {
        success: false,
        message: "An error occurred during registration",
      };
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, loginWithGoogle, logout, loading, register }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
