import {
  useEffect,
  useState
} from "react";
import { authService } from "../services/authService";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    authService.me()
      .then((user) => {
        if (active) setCurrentUser(user);
      })
      .catch((requestError) => {
        if (active && ![401, 403].includes(requestError.status)) {
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function login(email, password) {
    setLoading(true);
    setError("");
    try {
      const user = await authService.login(email, password);
      setCurrentUser(user);
      return { success: true, user };
    } catch (requestError) {
      setError(requestError.message);
      return { success: false, error: requestError.message };
    } finally {
      setLoading(false);
    }
  }

  async function register(formData) {
    setLoading(true);
    setError("");
    try {
      const result = await authService.register(formData);
      return {
        success: true,
        message: result.message,
        user: result.user
      };
    } catch (requestError) {
      setError(requestError.message);
      return { success: false, error: requestError.message };
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setError("");
    try {
      await authService.logout();
      setCurrentUser(null);
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    }
  }

  const value = {
    currentUser,
    loading,
    error,
    isAuthenticated: Boolean(currentUser),
    login,
    register,
    logout,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}