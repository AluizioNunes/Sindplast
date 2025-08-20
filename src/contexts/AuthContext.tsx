import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Definição do tipo de usuário
export interface AuthUser {
  id: number;
  nome: string;
  usuario: string;
  perfil: string;
  funcao: string;
  email: string;
}

// Definição do contexto
interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (usuario: string, senha: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Tipos para as respostas da API
interface LoginResponse {
  success: boolean;
  access_token?: string;
  refresh_token?: string;
  usuario?: AuthUser;
  message?: string;
}

interface RefreshResponse {
  access_token?: string;
}

// Criar o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider do contexto
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Verificar se há token salvo ao carregar
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Verificar se há token salvo
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        const savedAuth = localStorage.getItem('auth');
        
        if (savedToken && savedUser && savedAuth) {
          // Configurar axios com o token
          axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
          
          // Parse do usuário salvo
          const userData = JSON.parse(savedUser);
          
          // Atualizar estado com dados do localStorage
          setToken(savedToken);
          setUser(userData);
          setIsAuthenticated(true);
          
          // Verificar se o usuário ainda está válido no servidor (opcional)
          try {
            const response = await axios.get<{success: boolean; usuario?: AuthUser}>('http://localhost:5000/api/auth/me');
            
            if (response.data.success && response.data.usuario) {
              // Atualizar dados do usuário se necessário
              setUser(response.data.usuario);
              localStorage.setItem('user', JSON.stringify(response.data.usuario));
            } else {
              // Token inválido, limpar dados
              logout();
            }
          } catch (verificationError) {
            // Mesmo se a verificação falhar, manter o usuário autenticado com base no localStorage
            console.warn('⚠️ Não foi possível verificar o usuário no servidor, mas mantendo autenticação local');
          }
        }
      } catch (error) {
        console.error('❌ AuthContext: Erro ao verificar autenticação:', error);
        // Em caso de erro de parsing ou outros, fazer logout
        logout();
      }
    };
    
    checkAuthStatus();
    
    // Listener para mudanças no localStorage (para sincronizar entre abas)
    const handleStorageChange = () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      const savedAuth = localStorage.getItem('auth');
      
      if (savedToken && savedUser && savedAuth) {
        try {
          const userData = JSON.parse(savedUser);
          setToken(savedToken);
          setUser(userData);
          setIsAuthenticated(true);
          axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        } catch (e) {
          console.error('Erro ao parsear dados do usuário do localStorage:', e);
        }
      } else if (!savedToken || !savedUser || !savedAuth) {
        // Se algum item foi removido, fazer logout
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        delete axios.defaults.headers.common['Authorization'];
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Função de login
  const login = async (usuario: string, senha: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post<LoginResponse>('http://localhost:5000/api/auth/login', {
        usuario,
        senha
      });
      
      const { success, access_token, refresh_token, usuario: userData, message } = response.data;
      
      if (success && access_token && userData) {
        // Salvar token e usuário
        setToken(access_token);
        setUser(userData);
        setIsAuthenticated(true);
        
        // Salvar no localStorage
        localStorage.setItem('token', access_token);
        localStorage.setItem('refreshToken', refresh_token || '');
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('auth', 'true');
        
        // Limpar a última rota para garantir que vá para home após login
        localStorage.removeItem('lastRoute');
        
        // Configurar axios para usar o token
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        
        return true;
      } else {
        setError(message || 'Credenciais inválidas');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro na autenticação';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      // Chamar endpoint de logout no backend
      await axios.post('http://localhost:5000/api/auth/logout');
    } catch (err) {
      console.error('Erro ao fazer logout no servidor:', err);
    } finally {
      // Limpar estado e localStorage
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('auth');
      localStorage.removeItem('usuarioLogado');
      
      // Remover token do axios
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Função para atualizar o token (se necessário)
  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;
    
    try {
      const response = await axios.post<RefreshResponse>('http://localhost:5000/api/auth/refresh', {
        refresh_token: refreshToken
      });
      
      const { access_token } = response.data;
      if (access_token) {
        setToken(access_token);
        localStorage.setItem('token', access_token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        return true;
      }
      return false;
    } catch (err) {
      // Se falhar, fazer logout
      logout();
      return false;
    }
  };

  // Interceptor para tratar tokens expirados
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Se for 401 e não foi tentativa de refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          // Tentar refresh do token
          const refreshed = await refreshToken();
          if (refreshed) {
            return axios(originalRequest);
          }
        }
        
        return Promise.reject(error);
      }
    );
    
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated,
        loading,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para usar o contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};