let logoutCallback = null;

export const registerLogoutCallback = (logout) => {
  logoutCallback = logout;
};

export const triggerLogout = () => {
  if (logoutCallback) {
    logoutCallback();
  }
};
