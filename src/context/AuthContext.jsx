import { createContext, useContext, useEffect, useState } from "react";
import {
  loginAdmin,
  loginStudent,
  registerAdmin,
  registerStudent,
} from "../services/api";

const AUTH_STORAGE_KEY = "careercompass.auth";
const LEGACY_STUDENT_STORAGE_KEY = "careercompass.student";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    try {
      const storedAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);
      const legacyStudent = window.localStorage.getItem(LEGACY_STUDENT_STORAGE_KEY);

      if (storedAuth) {
        setAuthState(JSON.parse(storedAuth));
      } else if (legacyStudent) {
        const parsedStudent = JSON.parse(legacyStudent);
        const migratedState = { role: "student", user: parsedStudent };
        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(migratedState));
        window.localStorage.removeItem(LEGACY_STUDENT_STORAGE_KEY);
        setAuthState(migratedState);
      }
    } catch {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      window.localStorage.removeItem(LEGACY_STUDENT_STORAGE_KEY);
    } finally {
      setAuthReady(true);
    }
  }, []);

  function persistAuth(role, user) {
    const nextState = { role, user };
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextState));
    setAuthState(nextState);
  }

  async function studentSignup(payload) {
    return registerStudent(payload);
  }

  async function studentLogin(payload) {
    const response = await loginStudent(payload);
    persistAuth("student", response.student);
    return response;
  }

  async function adminSignup(payload) {
    return registerAdmin(payload);
  }

  async function adminLogin(payload) {
    const response = await loginAdmin(payload);
    persistAuth("admin", response.admin);
    return response;
  }

  function logout() {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_STUDENT_STORAGE_KEY);
    setAuthState(null);
  }

  const role = authState?.role || null;
  const currentUser = authState?.user || null;
  const student = role === "student" ? currentUser : null;
  const admin = role === "admin" ? currentUser : null;

  return (
    <AuthContext.Provider
      value={{
        role,
        currentUser,
        student,
        admin,
        isStudent: role === "student",
        isAdmin: role === "admin",
        isAuthenticated: Boolean(currentUser),
        authReady,
        studentSignup,
        studentLogin,
        adminSignup,
        adminLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
