import React, { useState } from 'react';
import { Button, Input, Typography, Form, message, Spin, Alert } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Title, Link } = Typography;

const Login: React.FC = () => {
  const { login, loading, error } = useAuth();
  const [form] = Form.useForm();

  const handleLogin = async (values: any) => {
    const success = await login(values.usuario, values.senha);
    if (!success) {
      // Erro já será tratado pelo AuthContext
      console.log('Login falhou');
    }
    // Se o login for bem-sucedido, o redirecionamento será feito automaticamente
    // pelo AppRoutes que detecta o estado de autenticação
  };

  const handleDevLogin = () => {
    // Modo desenvolvimento: autentica sem checar API
    // Em produção, remover esta funcionalidade
    message.warning('Modo desenvolvimento ativado. Esta funcionalidade será removida em produção.');
    
    // Simular login de desenvolvedor com JWT
    const mockToken = 'dev-mock-token-' + Date.now();
    const mockUser = {
      id: 0,
      nome: 'Desenvolvedor',
      usuario: 'DEV',
      perfil: 'ADMINISTRADOR',
      funcao: 'DESENVOLVEDOR',
      email: 'dev@sindplast.com'
    };
    
    localStorage.setItem('token', mockToken);
    localStorage.setItem('refreshToken', 'dev-refresh-token');
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('auth', 'true');
    
    // Atualizar estado de autenticação sem recarregar
    window.dispatchEvent(new Event('storage'));
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
        <Title 
          level={3} 
          style={{ textAlign: 'center', marginBottom: 24, color: '#F2311F', letterSpacing: 1 }}
          aria-label="SINDPLAST-AM"
        >
          SINDPLAST-AM
        </Title>
        
        {error && (
          <Alert 
            message={error} 
            type="error" 
            showIcon 
            style={{ marginBottom: 16 }} 
          />
        )}
        
        <Form 
          form={form}
          layout="vertical" 
          onFinish={handleLogin}
          aria-label="Formulário de login"
        >
          <Form.Item 
            label={<span style={{ fontWeight: 'bold' }}>Usuário</span>}
            name="usuario"
            rules={[{ required: true, message: 'Por favor, informe seu usuário!' }]}
          >
            <Input
              placeholder="Digite seu usuário"
              size="large"
              autoFocus
              aria-label="Campo de usuário"
            />
          </Form.Item>
          <Form.Item 
            label={<span style={{ fontWeight: 'bold' }}>Senha</span>}
            name="senha"
            rules={[{ required: true, message: 'Por favor, informe sua senha!' }]}
          >
            <Input.Password
              placeholder="Digite sua senha"
              size="large"
              aria-label="Campo de senha"
            />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <Link 
              style={{ fontSize: 13 }} 
              href="#" 
              aria-label="Esqueci meu usuário e senha"
            >
              Esqueci meu usuário e senha
            </Link>
          </div>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              size="large" 
              style={{ 
                background: '#F2311F', 
                borderColor: '#F2311F', 
                marginBottom: 8,
                fontWeight: 'bold'
              }} 
              loading={loading}
              aria-label="Botão de entrar"
            >
              {loading ? 'Autenticando...' : 'Entrar'}
            </Button>
          </Form.Item>
          <Button 
            block 
            size="large" 
            onClick={handleDevLogin} 
            style={{ 
              background: '#e0e0e0', 
              color: '#F2311F', 
              border: 'none', 
              fontWeight: 500 
            }}
            aria-label="Botão de acesso sem autenticação (modo desenvolvimento)"
          >
            Acessar sem autenticar (Modo Desenvolvimento)
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login; 