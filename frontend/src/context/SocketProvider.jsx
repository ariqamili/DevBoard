import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useUser } from "./UserContext";
import { SocketContext } from "./SocketContext";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function SocketProvider({ children }) {
  const { accessToken, isAuthenticated } = useUser();
  const socketRef = useRef(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Only connect once we actually have a token to authenticate with.
    if (!isAuthenticated || !accessToken) {
      // If we were previously connected (e.g. user just logged out),
      // tear the connection down.
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const socket = io(SOCKET_URL, {
      auth: { token: accessToken },
    });

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("notification", (notification) => {
      setNotifications((prev) => [{ ...notification, read: false }, ...prev]);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, accessToken]);

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true })),
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SocketContext.Provider value={{ notifications, unreadCount, markAllRead }}>
      {children}
    </SocketContext.Provider>
  );
}
