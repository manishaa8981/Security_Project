import { createContext, useEffect, useState, useMemo } from "react";
import { axiosInstance } from "@/utils/axiosInstance";
import { AuthContextType, IUser } from "@/interfaces/auth/IAuthContext";

const AuthContext = createContext<AuthContextType | null>(null);
export default AuthContext;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch user data
  const checkAuthStatus = async () => {
    try {
      // Call the server to check authentication status
      const { data } = await axiosInstance.get("/auth/user/status");
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error fetching user data:", error); // Debugging log
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Logout function
  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = "/login";
    }
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      checkAuthStatus,
      logout,
    }),
    [user, isAuthenticated, isLoading] // Only recompute if these values change
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
