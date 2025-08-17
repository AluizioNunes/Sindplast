import React, { useState, useEffect } from 'react';
import { Typography, Card, Row, Col, Button, Statistic, message } from 'antd';
import { UserOutlined, BankOutlined, TeamOutlined } from '@ant-design/icons';
import axios from 'axios';
import { motion } from 'framer-motion';
import { animations } from '../utils/animations';
import { dateFormats, relativeTime } from '../utils/dateUtils';
import { useNavigate } from 'react-router-dom';

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

interface Empresa {
  id: number;
  codEmpresa: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  nFuncionarios: number;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalSocios, setTotalSocios] = useState(0);
  const [totalEmpresas, setTotalEmpresas] = useState(0);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [loadingSocios, setLoadingSocios] = useState(false);
  const [loadingEmpresas, setLoadingEmpresas] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

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

  const fetchTotalEmpresas = async () => {
    try {
      setLoadingEmpresas(true);
      const response = await axios.get<Empresa[]>('http://localhost:5000/api/empresas');
      setTotalEmpresas(response.data.length);
    } catch (error) {
      message.error('Erro ao carregar total de empresas');
    } finally {
      setLoadingEmpresas(false);
    }
  };

  useEffect(() => {
    fetchTotalUsuarios();
    fetchTotalSocios();
    fetchTotalEmpresas();
    setLastUpdate(new Date());
  }, []);

  // Função para formatar números com ponto como separador de milhares
  const formatNumber = (value: number) => {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true
    });
  };

  // Funções de navegação
  const handleNavigateToEmpresas = () => navigate('/empresas');
  const handleNavigateToSocios = () => navigate('/socios');
  const handleNavigateToFuncionarios = () => navigate('/funcionarios');
  const handleNavigateToUsuarios = () => navigate('/usuarios');

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={animations.container}
      style={{ willChange: 'transform' }}
    >
      <motion.div variants={animations.fadeIn}>
      <Title level={2}>DASHBOARD</Title>
      <Paragraph>
        Bem-vindo ao sistema de gestão SINDPLAST-AM
      </Paragraph>
        <Paragraph type="secondary" style={{ fontSize: '12px' }}>
          Última atualização: {dateFormats.full(lastUpdate)}
          {' '}({relativeTime.fromNow(lastUpdate)})
        </Paragraph>
      </motion.div>
      
      <Row gutter={[16, 16]} style={{ marginTop: '20px', marginBottom: '32px' }}>
        <Col xs={24} sm={12} md={6}>
          <motion.div variants={animations.card}>
            <Card 
              hoverable 
              onClick={handleNavigateToEmpresas}
              style={{ cursor: 'pointer' }}
            >
            <Statistic 
              title="EMPRESAS" 
                value={totalEmpresas} 
              prefix={<BankOutlined />} 
              valueStyle={{ color: '#F2311F' }}
                loading={loadingEmpresas}
                formatter={(value) => formatNumber(value as number)}
            />
          </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <motion.div variants={animations.card}>
            <Card 
              hoverable 
              onClick={handleNavigateToSocios}
              style={{ cursor: 'pointer' }}
            >
            <Statistic 
              title="SÓCIOS" 
              value={totalSocios} 
              prefix={<UserOutlined />} 
              valueStyle={{ color: '#F2311F' }}
              loading={loadingSocios}
                formatter={(value) => formatNumber(value as number)}
            />
          </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <motion.div variants={animations.card}>
            <Card 
              hoverable 
              onClick={handleNavigateToFuncionarios}
              style={{ cursor: 'pointer' }}
            >
            <Statistic 
              title="FUNCIONÁRIOS" 
              value={384} 
              prefix={<TeamOutlined />} 
              valueStyle={{ color: '#F2311F' }}
                formatter={(value) => formatNumber(value as number)}
            />
          </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <motion.div variants={animations.card}>
            <Card 
              hoverable 
              onClick={handleNavigateToUsuarios}
              style={{ cursor: 'pointer' }}
            >
            <Statistic 
              title="USUÁRIOS" 
              value={totalUsuarios} 
              prefix={<UserOutlined />} 
              valueStyle={{ color: '#F2311F' }}
              loading={loadingUsuarios}
                formatter={(value) => formatNumber(value as number)}
            />
          </Card>
          </motion.div>
        </Col>
      </Row>
      
      <motion.div variants={animations.fadeIn}>
      <Title level={4}>AÇÕES RÁPIDAS</Title>
      </motion.div>
      
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col span={8}>
          <motion.div variants={animations.card}>
          <Card title="CADASTRO DE EMPRESAS" bordered={true}>
            <p>Adicione ou edite informações de empresas no sistema</p>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
            <Button type="primary">ACESSAR</Button>
              </motion.div>
          </Card>
          </motion.div>
        </Col>
        <Col span={8}>
          <motion.div variants={animations.card}>
          <Card title="RELATÓRIOS" bordered={true}>
            <p>Acesse relatórios e dados estatísticos das empresas</p>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
            <Button type="primary">VISUALIZAR</Button>
              </motion.div>
          </Card>
          </motion.div>
        </Col>
        <Col span={8}>
          <motion.div variants={animations.card}>
          <Card title="CONFIGURAÇÕES" bordered={true}>
            <p>Configure parâmetros do sistema e permissões</p>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
            <Button type="primary">CONFIGURAR</Button>
              </motion.div>
          </Card>
          </motion.div>
        </Col>
      </Row>
    </motion.div>
  );
};

export default Home; 