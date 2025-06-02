import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('picloopz-user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse user data', error);
      }
    }
  }, []);

  const login = async (email: string, _password: string): Promise<boolean> => {
    // In a real app, this would make an API call
    // This is a mock implementation for demonstration
    try {
      // Mock successful login for demonstration
      const mockUser = {
        id: '123456',
        name: 'Demo User',
        email: email,
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('picloopz-user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('picloopz-user');
    toast.success('Logged out successfully');
  };

  const register = async (name: string, email: string, _password: string): Promise<boolean> => {
    // Mock registration
    try {
      const mockUser = {
        id: '123456',
        name: name,
        email: email,
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('picloopz-user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      return false;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        login, 
        logout, 
        register 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
