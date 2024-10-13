"use client";
import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

// Create a provider component
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (username) => {
    setUser(username); // Update the user state with the username
    localStorage.setItem("username", username); // Store username in localStorage
  };

  const logout = () => {
    setUser(null); // Reset user state on logout
    localStorage.removeItem("username"); // Remove username from localStorage
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
