import React from 'react';
import { Layout, Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  TeamOutlined,
  BankOutlined,
  FileOutlined,
  SettingOutlined,
  LogoutOutlined,
  SolutionOutlined,
  SafetyOutlined,
  ProfileOutlined,
  PercentageOutlined,
  DashboardOutlined,
  IdcardOutlined,
  DesktopOutlined,
  DollarOutlined,
  TransactionOutlined,
  PayCircleOutlined,
  MoneyCollectOutlined,
  AccountBookOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getItem = (
    label: React.ReactNode,
    key: string,
    icon?: React.ReactNode,
    children?: any[],
  ) => ({
      key,
      icon,
      children,
      label,
  });

  const handleLogout = () => {
    // Limpar dados do localStorage
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('token');
    localStorage.removeItem('auth');
    
    // Redirecionar para login
    window.location.href = '/'; // Usando href para forçar recarregar a página inteira
  };

  const items = [
    getItem('Dashboard', 'home', <DashboardOutlined />),
    getItem('Cadastros', 'cadastros', <IdcardOutlined />, [
      getItem('Empresas', 'empresas', <BankOutlined />),
      getItem('Funcionários', 'funcionarios', <TeamOutlined />),
      getItem('Sócios', 'socios', <SolutionOutlined />),
      getItem('Dependentes', 'dependentes', <TeamOutlined />),
    ]),
    getItem('Financeiro', 'financeiro', <DollarOutlined />, [
      getItem('Contas a Pagar', 'contas-pagar', <PayCircleOutlined />),
      getItem('Contas a Receber', 'contas-receber', <MoneyCollectOutlined />),
      getItem('Receitas', 'receitas', <TransactionOutlined />),
      getItem('Despesas', 'despesas', <TransactionOutlined />),
      getItem('Mensalidades', 'mensalidades', <AccountBookOutlined />),
    ]),
    getItem('Relatórios', 'relatorios', <FileOutlined />, [
      getItem('Empresas', 'relatorios-empresas', <BankOutlined />),
      getItem('Sócios', 'relatorios-socios', <SolutionOutlined />),
    ]),
    getItem('Sistema', 'sistema', <DesktopOutlined />, [
      getItem('Usuários', 'usuarios', <UserOutlined />),
      getItem('Permissões', 'permissoes', <SafetyOutlined />),
      getItem('Perfil', 'perfil', <ProfileOutlined />),
    ]),
    getItem('Parâmetros', 'parametros', <SettingOutlined />,[
    getItem('Alíquotas', 'aliquotas', <PercentageOutlined />),]),
    getItem('Sair', 'logout', <LogoutOutlined />),
  ];

  const handleMenuClick = (info: any) => {
    const key = info.key;
    if (key === 'logout') {
      handleLogout();
      return;
    }
    navigate(`/${key}`);
  };

  return (
    <Sider trigger={null} collapsible collapsed={collapsed} width={260} style={{ minHeight: '100vh' }}>
      <div className="logo" />
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname.split('/')[1] || 'dashboard']}
        items={items}
        onClick={handleMenuClick}
      />
    </Sider>
  );
};

export default Sidebar;