import { createContext, useContext, useState, useEffect, useRef } from "react";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [sessionTime, setSessionTime] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      // Start session timer
      timer.current = setInterval(() => {
        setSessionTime((t) => t + 1);
      }, 1000);

      // Update user's session time in localStorage
      const updateUserSession = () => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.map(u => {
          if (u.username === user.username) {
            return {
              ...u,
              sessionTime: (u.sessionTime || 0) + 1,
              lastLogin: new Date().toISOString()
            };
          }
          return u;
        });
        localStorage.setItem('users', JSON.stringify(updatedUsers));
      };

      const sessionInterval = setInterval(updateUserSession, 1000);
      return () => {
        clearInterval(timer.current);
        clearInterval(sessionInterval);
      };
    } else {
      clearInterval(timer.current);
      setSessionTime(0);
    }
  }, [user]);

  const login = (username, gender, income) => {
    const newUser = { username, gender, income, isLoyal: false };
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    // Update users list in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUserIndex = users.findIndex(u => u.username === username);
    
    if (existingUserIndex >= 0) {
      users[existingUserIndex] = {
        ...users[existingUserIndex],
        lastLogin: new Date().toISOString()
      };
    } else {
      users.push({
        ...newUser,
        sessionTime: 0,
        lastLogin: new Date().toISOString()
      });
    }
    localStorage.setItem('users', JSON.stringify(users));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUser = (info) => {
    const updatedUser = { ...user, ...info };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Update user in users list
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(u => 
      u.username === user.username ? { ...u, ...info } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const activateLoyalty = () => {
    if (user) {
      const updatedUser = { ...user, isLoyal: true };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      // Update user in users list
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map(u => 
        u.username === user.username ? { ...u, isLoyal: true } : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateUser, sessionTime, activateLoyalty }}>
      {children}
    </UserContext.Provider>
  );
} 