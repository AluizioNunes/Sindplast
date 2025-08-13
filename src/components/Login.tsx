import React, { useState } from 'react';
import { Button, Input, Typography, Form, message } from 'antd';
import axios from 'axios';

const { Title, Link } = Typography;

interface LoginProps {
  onLogin: (usuario: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        Usuario: usuario,
        Senha: senha,
      });
      const data = response.data as { success: boolean; usuario?: any };
      if (data.success) {
        onLogin(data.usuario);
      } else {
        message.error('Usuário ou senha inválidos');
      }
    } catch (err) {
      message.error('Usuário ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  const handleDevLogin = () => {
    // Modo desenvolvimento: autentica sem checar API
    onLogin({ 
      Usuario: 'DEV', 
      Nome: 'Desenvolvedor',
      Funcao: 'DESENVOLVEDOR',
      Perfil: 'ADMINISTRADOR'
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f5f5',
    }}>
      <div style={{
        background: 'white',
        padding: 36,
        borderRadius: 12,
        boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
        minWidth: 340,
        maxWidth: 360,
        width: '100%',
      }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24, color: '#F2311F', letterSpacing: 1 }}>SINDPLAST-AM</Title>
        <Form layout="vertical" onSubmitCapture={handleLogin}>
          <Form.Item label="Usuário">
            <Input
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              placeholder="Digite seu usuário"
              size="large"
              autoFocus
            />
          </Form.Item>
          <Form.Item label="Senha">
            <Input.Password
              value={senha}
              onChange={e => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              size="large"
            />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <Link style={{ fontSize: 13 }} href="#">Esqueci meu usuário e senha</Link>
          </div>
          <Button type="primary" htmlType="submit" block size="large" style={{ background: '#F2311F', borderColor: '#F2311F', marginBottom: 8 }} loading={loading}>
            Entrar
          </Button>
          <Button block size="large" onClick={handleDevLogin} style={{ background: '#e0e0e0', color: '#F2311F', border: 'none', fontWeight: 500 }}>
            Acessar sem autenticar (Modo Desenvolvimento)
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login; 