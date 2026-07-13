const ACCESS_TOKEN_KEY = "access_token";

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setAccessToken = (token) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const removeAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

// Refresh Token
const REFRESH_TOKEN_KEY = "refresh_token";
export const getRefreshToken = () =>
    localStorage.getItem(REFRESH_TOKEN_KEY);

export const setRefreshToken = (token) =>
    localStorage.setItem(REFRESH_TOKEN_KEY, token);

export const removeRefreshToken = () =>
    localStorage.removeItem(REFRESH_TOKEN_KEY);


const USER_KEY = "user";

export const setUserData = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUserData = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const removeUserData = () => {
  localStorage.removeItem(USER_KEY);
};