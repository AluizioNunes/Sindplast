import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Layout, Spin, Alert } from 'antd';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import CustomLoader from './components/CustomLoader';

// Lazy loading das páginas
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Usuarios = lazy(() => import('./pages/Usuarios'));
const Perfil = lazy(() => import('./pages/Perfil'));
const Permissoes = lazy(() => import('./pages/Permissoes'));
const Socios = lazy(() => import('./pages/Socios'));
const Empresas = lazy(() => import('./pages/Empresas'));
const RelatoriosEmpresas = lazy(() => import('./pages/RelatoriosEmpresas'));
const RelatoriosSocios = lazy(() => import('./pages/RelatoriosSocios'));
const Funcionarios = lazy(() => import('./pages/Funcionarios'));

const { Content, Footer } = Layout;

// Error Boundary para capturar erros de renderização
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 ErrorBoundary capturou um erro:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '50px', 
          textAlign: 'center',
          background: '#fff2f0',
          border: '1px solid #ffccc7',
          borderRadius: '8px',
          margin: '20px'
        }}>
          <h1 style={{ color: '#cf1322' }}>🚨 Erro na Aplicação</h1>
          <p><strong>Erro:</strong> {this.state.error?.message}</p>
          <p><strong>Stack:</strong> {this.state.error?.stack}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              background: '#cf1322',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Recarregar Página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Salvar a rota atual no localStorage sempre que ela mudar
  // Isso permite manter a página ao atualizar, mas não interfere no login
  useEffect(() => {
    if (isAuthenticated && location.pathname !== '/' && location.pathname !== '/home') {
      localStorage.setItem('lastRoute', location.pathname);
    }
  }, [location.pathname, isAuthenticated]);

  // Se não autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header 
        collapsed={collapsed} 
        toggleCollapsed={() => setCollapsed(!collapsed)} 
      />
      <Layout>
        <Sidebar collapsed={collapsed} />
        <Layout>
          <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280 }}>
            <Suspense fallback={<CustomLoader message="Carregando página..." />}>
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/permissoes" element={<Permissoes />} />
                <Route path="/socios" element={<Socios />} />
                <Route path="/empresas" element={<Empresas />} />
                <Route path="/funcionarios" element={<Funcionarios />} />
                <Route path="/relatorios-empresas" element={<RelatoriosEmpresas />} />
                <Route path="/relatorios-socios" element={<RelatoriosSocios />} />
                {/* Rota padrão quando nenhuma outra corresponde */}
                <Route path="*" element={<Navigate to="/home" replace />} />
              </Routes>
            </Suspense>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            SINDPLAST-AM ©{new Date().getFullYear()} - Todos os direitos reservados
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Enquanto verifica a autenticação, mostrar um loader
  if (loading) {
    return <CustomLoader message="Verificando autenticação..." />;
  }
  
  // Se não estiver autenticado, mostrar login
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }
  
  // Se estiver autenticado e na raiz, tentar restaurar a última rota
  if (isAuthenticated && location.pathname === '/') {
    const lastRoute = localStorage.getItem('lastRoute');
    if (lastRoute && lastRoute !== '/' && lastRoute !== '/home') {
      return <Navigate to={lastRoute} replace />;
    }
  }
  
  // Se estiver autenticado, mostrar o layout da aplicação
  return <AppLayout />;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;