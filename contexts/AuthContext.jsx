"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "loading") {
      setLoading(false);
    }
  }, [status]);

  const login = async (email, password) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        return { success: false, message: result.error };
      }

      router.push("/dashboard");
      return { success: true };
    } catch (error) {
      return { success: false, message: "An error occurred during login" };
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
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
