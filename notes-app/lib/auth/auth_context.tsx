import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

type AuthState = {
  email: string | null;
  setEmail: (email: string | null) => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);

  const value = useMemo(() => ({ email, setEmail }), [email]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
