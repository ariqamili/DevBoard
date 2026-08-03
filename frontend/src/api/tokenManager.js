let currentAccessToken = null;
export const setAccessTokenForApi = (token) => {
  currentAccessToken = token;
};

export const getAccessTokenForApi = () => {
  return currentAccessToken;
};
