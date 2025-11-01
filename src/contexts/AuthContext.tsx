'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tipos de usuário
export type UserType = 'candidate' | 'company' | 'admin' | null;

export interface CandidateUser {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  birth_date: string;
  tipo: 'candidate';
  subtipo?: string; // Subtipo de deficiência do candidato (deprecado)
  deficiencia?: string; // ID da deficiência (ex: "DMOTO-305079") - usado para filtrar vagas
}

export interface CompanyUser {
  id: string;
  trade_name: string;
  company_name: string;
  email: string;
  cnpj: string;
  phone: string;
  tipo: 'company';
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  tipo: 'admin';
}

export type User = CandidateUser | CompanyUser | AdminUser | null;

interface AuthContextData {
  user: User;
  userType: UserType;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: User, token: string, type: UserType) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [userType, setUserType] = useState<UserType>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    const loadStorageData = () => {
      try {
        const storedToken = localStorage.getItem('@PCDentro:token');
        const storedUser = localStorage.getItem('@PCDentro:user');
        const storedUserType = localStorage.getItem('@PCDentro:userType');

        if (storedToken && storedUser && storedUserType) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setUserType(storedUserType as UserType);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStorageData();
  }, []);

  const login = (userData: User, authToken: string, type: UserType) => {
    setUser(userData);
    setToken(authToken);
    setUserType(type);

    // Salvar no localStorage
    localStorage.setItem('@PCDentro:token', authToken);
    localStorage.setItem('@PCDentro:user', JSON.stringify(userData));
    if (type) {
      localStorage.setItem('@PCDentro:userType', type);
    }
    
    // Set token and role cookies so middleware can validate access to protected routes
    try {
      if (type) {
        // cookie expires in 7 days
        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `pcd_token=${authToken}; path=/; expires=${expires}`;
        document.cookie = `pcd_role=${type}; path=/; expires=${expires}`;
      }
    } catch (e) {
      // noop if cookies can't be set (SSR contexts)
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setUserType(null);

    // Limpar localStorage
    localStorage.removeItem('@PCDentro:token');
    localStorage.removeItem('@PCDentro:user');
    localStorage.removeItem('@PCDentro:userType');
    try {
      // clear cookies
      document.cookie = 'pcd_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'pcd_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } catch (e) {
      // noop
    }
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        userType,
        token,
        isLoading,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}
