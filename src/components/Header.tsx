import React, { useEffect, useState } from 'react';
import { Layout, Typography, Button, Tooltip, Dropdown, Menu } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

interface HeaderProps {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

const SIDEBAR_WIDTH = 260;
const SIDEBAR_COLLAPSED_WIDTH = 80;

const Header: React.FC<HeaderProps> = ({ collapsed, toggleCollapsed }) => {
  const [dataHora, setDataHora] = useState(new Date());
  const [inicioConexao] = useState(new Date());
  const [tempoConexao, setTempoConexao] = useState('00:00:00');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setDataHora(new Date());
      const diff = new Date().getTime() - inicioConexao.getTime();
      const horas = Math.floor(diff / 1000 / 60 / 60).toString().padStart(2, '0');
      const minutos = Math.floor((diff / 1000 / 60) % 60).toString().padStart(2, '0');
      const segundos = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
      setTempoConexao(`${horas}:${minutos}:${segundos}`);
    }, 1000);
    return () => clearInterval(timer);
  }, [inicioConexao]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" disabled>
        <UserOutlined /> Perfil
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        <LogoutOutlined /> Sair
      </Menu.Item>
    </Menu>
  );

  return (
    <AntHeader
      style={{
        display: 'flex',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        width: '100%',
        background: '#FF3030',
        minHeight: 64,
        padding: 0,
      }}
    >
      {/* Botão de toggle alinhado com os ícones do Sidebar, mas com margem à esquerda */}
      <div style={{ width: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleCollapsed}
          style={{ fontSize: '20px', width: 48, height: 48, color: 'white', background: 'transparent', border: 'none', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 31 }}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        />
      </div>
      {/* Conteúdo do header centralizado conforme sidebar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        marginLeft: collapsed ? SIDEBAR_COLLAPSED_WIDTH - 48 : SIDEBAR_WIDTH - 48,
        transition: 'margin-left 0.2s',
      }}>
        <div>
          <Title level={4} style={{ color: 'white', margin: 0, lineHeight: '1.2' }}>
            SINDPLAST-AM
          </Title>
          <div style={{ color: 'white', fontSize: '12px', lineHeight: '1.2' }}>
            SINDICATO DOS TRABALHADORES NAS INDÚSTRIAS DE MATERIAL PLÁSTICO DE MANAUS E DO ESTADO DO AMAZONAS
          </div>
        </div>
        <div style={{ color: 'white', textAlign: 'right', minWidth: 320, paddingRight: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, fontSize: 17, lineHeight: 1, marginBottom: 8 }}>
            <Dropdown overlay={userMenu} trigger={['click']}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <UserOutlined style={{ fontSize: 16 }} />
                <span style={{ fontWeight: 500, fontSize: 15 }}>
                  {(user?.nome || '').toUpperCase()} {user?.usuario ? `| ${user.usuario.toUpperCase()}` : ''}
                </span>
              </div>
            </Dropdown>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16 }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', lineHeight: 1.2, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end', gap: 0 }}>
              <span>FUNÇÃO: {user?.funcao?.toUpperCase() || 'NÃO INFORMADA'} | PERFIL: {user?.perfil?.toUpperCase() || 'NÃO INFORMADO'}</span>
              <span style={{ marginTop: 4 }}>CONECTADO EM: {dataHora.toLocaleDateString()} {dataHora.toLocaleTimeString()} | TEMPO DE CONEXÃO: {tempoConexao}</span>
            </div>
          </div>
        </div>
      </div>
    </AntHeader>
  );
};

export default Header; 
