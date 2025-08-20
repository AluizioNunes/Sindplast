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
      console.error('❌ Home.tsx: Erro ao carregar usuários:', error);
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
      console.error('❌ Home.tsx: Erro ao carregar sócios:', error);
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
      console.error('❌ Home.tsx: Erro ao carregar empresas:', error);
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
      variants={animations.containerVariants}
      initial="hidden"
      animate="visible"
      style={{ willChange: 'transform' }}
    >
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32, color: '#F2311F' }}>
        Home
      </Title>

      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={animations.cardVariants}>
            <Card 
              hoverable 
              style={{ textAlign: 'center', cursor: 'pointer' }}
              onClick={() => navigate('/usuarios')}
            >
              <Statistic
                title="Usuários"
                value={totalUsuarios}
                prefix={<UserOutlined style={{ color: '#F2311F' }} />}
                valueStyle={{ color: '#F2311F' }}
                loading={loadingUsuarios}
                formatter={(value) => formatNumber(value as number)}
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={animations.cardVariants}>
            <Card 
              hoverable 
              style={{ textAlign: 'center', cursor: 'pointer' }}
              onClick={() => navigate('/socios')}
            >
              <Statistic
                title="Sócios"
                value={totalSocios}
                prefix={<TeamOutlined style={{ color: '#F2311F' }} />}
                valueStyle={{ color: '#F2311F' }}
                loading={loadingSocios}
                formatter={(value) => formatNumber(value as number)}
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={animations.cardVariants}>
            <Card 
              hoverable 
              style={{ textAlign: 'center', cursor: 'pointer' }}
              onClick={() => navigate('/empresas')}
            >
              <Statistic
                title="Empresas"
                value={totalEmpresas}
                prefix={<BankOutlined style={{ color: '#F2311F' }} />}
                valueStyle={{ color: '#F2311F' }}
                loading={loadingEmpresas}
                formatter={(value) => formatNumber(value as number)}
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={animations.cardVariants}>
            <Card 
              hoverable 
              style={{ textAlign: 'center', cursor: 'pointer' }}
              onClick={() => navigate('/funcionarios')}
            >
              <Statistic
                title="Funcionários"
                value={0}
                prefix={<TeamOutlined style={{ color: '#F2311F' }} />}
                valueStyle={{ color: '#F2311F' }}
                formatter={(value) => formatNumber(value as number)}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>
    </motion.div>
  );
};

export default Home; 