import { createContext, useState } from "react";
import {getAccessToken,
  removeAccessToken,
  setRefreshToken,
    setAccessToken,
    removeRefreshToken,
  getUserData,
  setUserData,
  removeUserData,
} from "../utils/token";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUserData());

  const isLoading = false;

    const login = (
        accessToken,
        refreshToken,
        userData
    ) => {
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setUserData(userData);
        setUser(userData);
    };

  const logout = () => {
    removeAccessToken();
    removeUserData();
      removeRefreshToken();
    setUser(null);
    window.location.href = "/login";
  };

  const isAuthenticated = !!getAccessToken();

  const hasRole = (role) => user?.role === role;

  return (
      <AuthContext.Provider
          value={{
            user,
            isLoading,
            isAuthenticated,
            login,
            logout,
            hasRole,
          }}
      >
        {children}
      </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthProvider;