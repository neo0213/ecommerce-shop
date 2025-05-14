import { createContext, useContext, useState, useEffect, useRef } from "react";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [sessionTime, setSessionTime] = useState(0);
  const timer = useRef(null);
  const loginTime = useRef(null);

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      // Restore login time from localStorage if it exists
      const savedLoginTime = localStorage.getItem('loginTime');
      if (savedLoginTime) {
        loginTime.current = parseInt(savedLoginTime);
      } else {
        loginTime.current = Date.now();
        localStorage.setItem('loginTime', loginTime.current.toString());
      }
    }

    // Ensure admin account exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const adminExists = users.some(u => u.username === 'admin');
    if (!adminExists) {
      users.push({
        username: 'admin',
        password: 'admin',
        age: 30,
        gender: 'Male',
        income: 100000,
        numberOfPurchases: 0,
        productCategory: 0,
        sessionTime: 0,
        isLoyal: true,
        discountsAvailed: 0,
        purchaseStatus: 0,
        voucherUses: 0
      });
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, []);

  useEffect(() => {
    if (user) {
      // Start session timer
      timer.current = setInterval(() => {
        const totalSeconds = Math.floor((Date.now() - loginTime.current) / 1000);
        setSessionTime(totalSeconds);
      }, 1000); // Update every second

      // Update user's session time in localStorage
      const updateUserSession = () => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.map(u => {
          if (u.username === user.username) {
            const totalSeconds = Math.floor((Date.now() - loginTime.current) / 1000);
            return {
              ...u,
              sessionTime: totalSeconds,
              lastLogin: new Date().toISOString()
            };
          }
          return u;
        });
        localStorage.setItem('users', JSON.stringify(updatedUsers));
      };

      // Update localStorage every second
      const sessionInterval = setInterval(updateUserSession, 1000);

      return () => {
        clearInterval(timer.current);
        clearInterval(sessionInterval);
      };
    } else {
      clearInterval(timer.current);
      setSessionTime(0);
      loginTime.current = null;
      localStorage.removeItem('loginTime');
    }
  }, [user]);

  const login = (loginObj) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(u => u.username === loginObj.username);
    if (foundUser && foundUser.password === loginObj.password) {
      // Reset session time when logging in
      foundUser.sessionTime = 0;
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      // Set new login time
      loginTime.current = Date.now();
      localStorage.setItem('loginTime', loginTime.current.toString());
      return true;
    } else {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('cart'); // Clear cart from localStorage
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

  const updateSelectedVouchers = (selectedVouchers) => {
    if (!user) return;
    const updatedUser = { ...user, selectedVouchers };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    // Update user in users list
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(u =>
      u.username === user.username ? { ...u, selectedVouchers } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const updateProductVouchers = (productId, vouchersArr) => {
    if (!user) return;
    const selectedVouchersByProduct = { ...(user.selectedVouchersByProduct || {}) };
    selectedVouchersByProduct[productId] = vouchersArr;
    const updatedUser = { ...user, selectedVouchersByProduct };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    // Update user in users list
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(u =>
      u.username === user.username ? { ...u, selectedVouchersByProduct } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const resetAllProductVouchers = () => {
    if (!user) return;
    const updatedUser = { ...user, selectedVouchersByProduct: {} };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    // Update user in users list
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(u =>
      u.username === user.username ? { ...u, selectedVouchersByProduct: {} } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const updateUsedVouchers = (usedVouchers) => {
    if (!user) return;
    const updatedUser = { ...user, usedVouchers };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    // Update user in users list
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(u =>
      u.username === user.username ? { ...u, usedVouchers } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const resetUsedVouchers = () => {
    if (!user) return;
    const updatedUser = { ...user, usedVouchers: [false, false, false, false, false] };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    // Update user in users list
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(u =>
      u.username === user.username ? { ...u, usedVouchers: [false, false, false, false, false] } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const updateVoucherUses = (voucherUses) => {
    if (!user) return;
    const updatedUser = { ...user, voucherUses };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    // Update user in users list
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(u =>
      u.username === user.username ? { ...u, voucherUses } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateUser, sessionTime, activateLoyalty, register, updateSelectedVouchers, updateProductVouchers, resetAllProductVouchers, updateUsedVouchers, resetUsedVouchers, updateVoucherUses }}>
      {children}
    </UserContext.Provider>
  );
} 