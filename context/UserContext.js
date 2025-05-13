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

  const login = (loginObj) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(u => u.username === loginObj.username);
    if (foundUser && foundUser.password === loginObj.password) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    } else {
      return false;
    }
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

  const register = (userObj) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.username === userObj.username)) {
      return false; // Username already exists
    }
    users.push({
      ...userObj,
      sessionTime: 0,
      lastLogin: new Date().toISOString()
    });
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateUser, sessionTime, activateLoyalty, register }}>
      {children}
    </UserContext.Provider>
  );
} 