import React, { useState, useEffect } from 'react';
import { Typography, Card, Row, Col, Button, Statistic, message } from 'antd';
import { UserOutlined, BankOutlined, TeamOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Paragraph } = Typography;

interface Usuario {
  IdUsuarios: number;
  Nome: string;
  CPF: string;
  Funcao: string;
  Email: string;
  Usuario: string;
  Perfil: string;
  Cadastrante: string;
  DataCadastro: string;
}

interface Socio {
  id: number;
  nome: string;
  status: string;
}

const Home: React.FC = () => {
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalSocios, setTotalSocios] = useState(0);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [loadingSocios, setLoadingSocios] = useState(false);

  const fetchTotalUsuarios = async () => {
    try {
      setLoadingUsuarios(true);
      const response = await axios.get<Usuario[]>('http://localhost:5000/api/usuarios');
      setTotalUsuarios(response.data.length);
    } catch (error) {
      message.error('Erro ao carregar total de usuários');
    } finally {
      setLoadingUsuarios(false);
    }
  };

  const fetchTotalSocios = async () => {
    try {
      setLoadingSocios(true);
      const response = await axios.get<Socio[]>('http://localhost:5000/api/socios');
      setTotalSocios(response.data.length);
    } catch (error) {
      message.error('Erro ao carregar total de sócios');
    } finally {
      setLoadingSocios(false);
    }
  };

  useEffect(() => {
    fetchTotalUsuarios();
    fetchTotalSocios();
  }, []);

  return (
    <div>
      <Title level={2}>DASHBOARD</Title>
      <Paragraph>
        Bem-vindo ao sistema de gestão SINDPLAST-AM
      </Paragraph>
      
      <Row gutter={[16, 16]} style={{ marginTop: '20px', marginBottom: '32px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="EMPRESAS" 
              value={42} 
              prefix={<BankOutlined />} 
              valueStyle={{ color: '#F2311F' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="SÓCIOS" 
              value={totalSocios} 
              prefix={<UserOutlined />} 
              valueStyle={{ color: '#F2311F' }}
              loading={loadingSocios}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="FUNCIONÁRIOS" 
              value={384} 
              prefix={<TeamOutlined />} 
              valueStyle={{ color: '#F2311F' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="USUÁRIOS" 
              value={totalUsuarios} 
              prefix={<UserOutlined />} 
              valueStyle={{ color: '#F2311F' }}
              loading={loadingUsuarios}
            />
          </Card>
        </Col>
      </Row>
      
      <Title level={4}>AÇÕES RÁPIDAS</Title>
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col span={8}>
          <Card title="CADASTRO DE EMPRESAS" bordered={true}>
            <p>Adicione ou edite informações de empresas no sistema</p>
            <Button type="primary">ACESSAR</Button>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="RELATÓRIOS" bordered={true}>
            <p>Acesse relatórios e dados estatísticos das empresas</p>
            <Button type="primary">VISUALIZAR</Button>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="CONFIGURAÇÕES" bordered={true}>
            <p>Configure parâmetros do sistema e permissões</p>
            <Button type="primary">CONFIGURAR</Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home; 