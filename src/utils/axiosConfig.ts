import axios from 'axios';

// Configuração base do axios
const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 10000,
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e refresh automático de token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Se for 401 (não autorizado) e não foi tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          // Tentar renovar o token
          const response = await axios.post('http://localhost:5000/api/auth/refresh', {}, {
            headers: { 'Authorization': `Bearer ${refreshToken}` }
          });
          
          if (response.data && typeof response.data === 'object' && 'success' in response.data && response.data.success) {
            const data = response.data as { success: boolean; access_token: string };
            const newToken = data.access_token;
            localStorage.setItem('token', newToken);
            
            // Atualizar o header da requisição original
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            
            // Reexecutar a requisição original com o novo token
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Erro ao renovar token:', refreshError);
        // Se falhar o refresh, limpar dados e redirecionar para login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('auth');
        window.location.href = '/';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 