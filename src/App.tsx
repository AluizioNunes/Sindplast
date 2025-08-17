import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Layout, Spin } from 'antd';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';

// Lazy loading das páginas
const Home = lazy(() => import('./pages/Home'));
const Usuarios = lazy(() => import('./pages/Usuarios'));
const Perfil = lazy(() => import('./pages/Perfil'));
const Permissoes = lazy(() => import('./pages/Permissoes'));
const Socios = lazy(() => import('./pages/Socios'));
const Empresas = lazy(() => import('./pages/Empresas'));
const RelatoriosEmpresas = lazy(() => import('./pages/RelatoriosEmpresas'));
const RelatoriosSocios = lazy(() => import('./pages/RelatoriosSocios'));
const Funcionarios = lazy(() => import('./pages/Funcionarios'));

const { Content, Footer } = Layout;

const AppLayout: React.FC<{ isAuthenticated: boolean; setIsAuthenticated: (v: boolean) => void; usuarioLogado: any; setUsuarioLogado: (u: any) => void }> = ({ isAuthenticated, setIsAuthenticated, usuarioLogado, setUsuarioLogado }) => {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Login onLogin={(usuario) => {
      setIsAuthenticated(true);
      setUsuarioLogado(usuario);
      // Salva o USUÁRIO do usuário logado no localStorage para ser usado como cadastrante
      if (usuario && usuario.Usuario) {
        localStorage.setItem('usuarioLogado', usuario.Usuario);
        localStorage.setItem('auth', 'true'); // Marca que o usuário está autenticado
      }
      navigate('/home', { replace: true });
    }} />;
  }

  // Se autenticado e na raiz, redireciona para /home
  if (isAuthenticated && location.pathname === '/') {
    return <Navigate to="/home" replace />;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header collapsed={collapsed} toggleCollapsed={() => setCollapsed(!collapsed)} usuarioLogado={usuarioLogado} />
      <Layout>
        <Sidebar collapsed={collapsed} />
        <Layout>
          <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280 }}>
            <Suspense fallback={
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '200px',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <Spin size="large" />
                <div style={{ color: '#666', fontSize: '14px' }}>Carregando página...</div>
              </div>
            }>
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/permissoes" element={<Permissoes />} />
                <Route path="/socios" element={<Socios />} />
                <Route path="/empresas" element={<Empresas />} />
                <Route path="/funcionarios" element={<Funcionarios />} />
                <Route path="/relatorios-empresas" element={<RelatoriosEmpresas />} />
                <Route path="/relatorios-socios" element={<RelatoriosSocios />} />
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

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState<any>(null);
  
  // Verifica se o usuário já está autenticado ao iniciar a aplicação
  useEffect(() => {
    const authStatus = localStorage.getItem('auth');
    const userInfo = localStorage.getItem('usuarioLogado');
    
    if (authStatus === 'true' && userInfo) {
      setIsAuthenticated(true);
      // Aqui você poderia buscar mais informações do usuário do servidor
      setUsuarioLogado({ Usuario: userInfo });
    }
  }, []);
  
  return (
    <Router>
      <AppLayout isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} usuarioLogado={usuarioLogado} setUsuarioLogado={setUsuarioLogado} />
    </Router>
  );
};

export default App;
