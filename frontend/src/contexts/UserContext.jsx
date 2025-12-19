import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user'); // Or reconstruct from individual items
    // auth.service.js stores: token, email, name, id, role
    const id = localStorage.getItem('id');
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');

    return id ? { id, name, email, role } : { name: '', id: '', email: '' }; // Check if ID exists
  });

  const setUserInfo = (userInfo) => {
    setUser(userInfo);
  };

  return (
    <UserContext.Provider value={{ user, setUser: setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};
