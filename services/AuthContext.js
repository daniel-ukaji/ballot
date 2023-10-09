// authContext.js
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({ email: null, token: null });
  const router = useRouter();

  useEffect(() => {
    // Check if the user is authenticated using a token stored in localStorage
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email'); // Retrieve the stored email
  
    if (token && email) {
      // User is authenticated, set the user state
      setUser({ email, token });
    } else {
      // User is not authenticated, redirect to the signin page
      router.push('/signin');
    }
  }, [router]);
  

  const login = async (email, password) => {
    // Make a POST request to your authentication API
    const response = await fetch('https://virtual.chevroncemcs.com/ballot/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('Response status:', response.status);

    if (response.ok) {
      const data = await response.json();
      if (data && data.token) {
        console.log('Login successful. Token:', data.token);
        setUser({ email, token: data.token });
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', email); // Store the email
      } else {
        console.error('Token not found in response');
        throw new Error('Authentication failed');
      }
    } else {
      console.error('Authentication failed');
      throw new Error('Authentication failed');
    }
  };

  const logout = () => {
    // Remove the token and email from localStorage and reset the user state
    localStorage.removeItem('token');
    localStorage.removeItem('email'); // Remove the email
    setUser({ email: null, token: null });

    // Redirect to the home page
    router.push('/signin');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
