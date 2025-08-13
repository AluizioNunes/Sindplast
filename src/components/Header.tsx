import React, { useEffect, useState } from 'react';
import { Layout, Typography, Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

interface HeaderProps {
  collapsed: boolean;
  toggleCollapsed: () => void;
  usuarioLogado?: {
    Nome?: string;
    Usuario?: string;
    Funcao?: string;
    Perfil?: string;
  };
}

const SIDEBAR_WIDTH = 260;
const SIDEBAR_COLLAPSED_WIDTH = 80;

const Header: React.FC<HeaderProps> = ({ collapsed, toggleCollapsed, usuarioLogado }) => {
  const [dataHora, setDataHora] = useState(new Date());
  const [inicioConexao] = useState(new Date());
  const [tempoConexao, setTempoConexao] = useState('00:00:00');

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

  return (
    <AntHeader
      style={{
        display: 'flex',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        width: '100%',
        background: '#F2311F',
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, fontSize: 17, lineHeight: 1 }}>
            <UserOutlined style={{ fontSize: 16 }} />
            <span style={{ fontWeight: 500, fontSize: 15 }}>
              {(usuarioLogado?.Nome || '').toUpperCase()} {usuarioLogado?.Usuario ? `| ${usuarioLogado.Usuario.toUpperCase()}` : ''}
            </span>
          </div>
          <div style={{ fontSize: 11, marginTop: 2, textTransform: 'uppercase', lineHeight: 1.2, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end', gap: 0 }}>
            <span>FUNÇÃO: {usuarioLogado?.Funcao?.toUpperCase() || 'NÃO INFORMADA'} | PERFIL: {usuarioLogado?.Perfil?.toUpperCase() || 'NÃO INFORMADO'}</span>
            <span style={{ marginTop: 4 }}>CONECTADO EM: {dataHora.toLocaleDateString()} {dataHora.toLocaleTimeString()} | TEMPO DE CONEXÃO: {tempoConexao}</span>
          </div>
        </div>
      </div>
    </AntHeader>
  );
};

export default Header; 