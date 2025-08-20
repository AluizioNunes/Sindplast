import React from 'react';
import { Layout, Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
  AccountBookOutlined,
  BarChartOutlined,
  HomeOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

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

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const items = [
    getItem('Home', 'home', <HomeOutlined />),
    getItem('Dashboard', 'dashboard', <BarChartOutlined />),
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
    <Sider trigger={null} collapsible collapsed={collapsed} width={260} style={{ minHeight: '100vh', background: '#F2311F' }}>
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