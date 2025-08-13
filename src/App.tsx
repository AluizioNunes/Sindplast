import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Usuarios from './pages/Usuarios';
import Login from './components/Login';
import Perfil from './pages/Perfil';
import Permissoes from './pages/Permissoes';
import Socios from './pages/Socios';
import Empresas from './pages/Empresas';
import RelatoriosEmpresas from './pages/RelatoriosEmpresas';
import RelatoriosSocios from './pages/RelatoriosSocios';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';

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
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/permissoes" element={<Permissoes />} />
              <Route path="/socios" element={<Socios />} />
              <Route path="/empresas" element={<Empresas />} />
              <Route path="/relatorios-empresas" element={<RelatoriosEmpresas />} />
              <Route path="/relatorios-socios" element={<RelatoriosSocios />} />
            </Routes>
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
