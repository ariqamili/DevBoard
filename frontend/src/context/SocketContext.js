import { createContext, useContext } from "react";

export const SocketContext = createContext({
  notifications: [],
  unreadCount: 0,
  markAllRead: () => {},
});

export const useSocket = () => useContext(SocketContext);
