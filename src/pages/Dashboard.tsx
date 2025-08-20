import React, { useState, useEffect } from 'react';
import { Typography, Card, Row, Col, Statistic, message, Spin } from 'antd';
import { UserOutlined, BankOutlined, TeamOutlined, BarChartOutlined } from '@ant-design/icons';
import axios from 'axios';
import { motion } from 'framer-motion';
import { animations } from '../utils/animations';
import { dateFormats, relativeTime } from '../utils/dateUtils';
import ReactECharts from 'echarts-for-react';

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

const Dashboard: React.FC = () => {
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalSocios, setTotalSocios] = useState(0);
  const [totalEmpresas, setTotalEmpresas] = useState(0);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [loadingSocios, setLoadingSocios] = useState(false);
  const [loadingEmpresas, setLoadingEmpresas] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // Dados para os gráficos
  const [usuariosPorPerfil, setUsuariosPorPerfil] = useState<any[]>([]);
  const [empresasPorFuncionarios, setEmpresasPorFuncionarios] = useState<any[]>([]);
  const [sociosPorStatus, setSociosPorStatus] = useState<any[]>([]);
  const [loadingCharts, setLoadingCharts] = useState(true);

  // Função para formatar números com ponto como separador de milhares
  const formatNumber = (value: number) => {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true
    });
  };

  const fetchTotalUsuarios = async () => {
    try {
      setLoadingUsuarios(true);
      const response = await axios.get<Usuario[]>('http://localhost:5000/api/usuarios');
      setTotalUsuarios(response.data.length);
    } catch (error) {
      console.error('❌ Dashboard.tsx: Erro ao carregar usuários:', error);
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
      console.error('❌ Dashboard.tsx: Erro ao carregar sócios:', error);
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
      console.error('❌ Dashboard.tsx: Erro ao carregar empresas:', error);
      message.error('Erro ao carregar total de empresas');
    } finally {
      setLoadingEmpresas(false);
    }
  };

  // Função para buscar dados para os gráficos
  const fetchChartData = async () => {
    try {
      setLoadingCharts(true);
      
      // Dados de usuários por perfil
      const usuariosResponse = await axios.get<Usuario[]>('http://localhost:5000/api/usuarios');
      const perfis = usuariosResponse.data.reduce((acc: any, usuario) => {
        acc[usuario.Perfil] = (acc[usuario.Perfil] || 0) + 1;
        return acc;
      }, {});
      
      const perfisData = Object.entries(perfis).map(([name, value]) => ({
        name,
        value
      }));
      setUsuariosPorPerfil(perfisData);
      
      // Dados de empresas por número de funcionários
      const empresasResponse = await axios.get<Empresa[]>('http://localhost:5000/api/empresas');
      const empresasData = empresasResponse.data.map(empresa => ({
        name: empresa.nomeFantasia,
        value: empresa.nFuncionarios
      }));
      setEmpresasPorFuncionarios(empresasData);
      
      // Dados de sócios por status
      const sociosResponse = await axios.get<Socio[]>('http://localhost:5000/api/socios');
      const status = sociosResponse.data.reduce((acc: any, socio) => {
        acc[socio.status] = (acc[socio.status] || 0) + 1;
        return acc;
      }, {});
      
      const statusData = Object.entries(status).map(([name, value]) => ({
        name,
        value
      }));
      setSociosPorStatus(statusData);
      
    } catch (error) {
      console.error('❌ Dashboard.tsx: Erro ao carregar dados dos gráficos:', error);
      message.error('Erro ao carregar dados dos gráficos');
    } finally {
      setLoadingCharts(false);
    }
  };

  useEffect(() => {
    fetchTotalUsuarios();
    fetchTotalSocios();
    fetchTotalEmpresas();
    fetchChartData();
    setLastUpdate(new Date());
  }, []);

  // Opções para o gráfico de usuários por perfil
  const usuariosPorPerfilOptions = {
    title: {
      text: 'Usuários por Perfil',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'horizontal',
      bottom: 10
    },
    series: [
      {
        name: 'Perfis',
        type: 'pie',
        radius: '50%',
        data: usuariosPorPerfil,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  // Opções para o gráfico de empresas por funcionários
  const empresasPorFuncionariosOptions = {
    title: {
      text: 'Empresas por Nº de Funcionários',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: empresasPorFuncionarios.slice(0, 10).map(item => item.name) // Limitar a 10 empresas
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: empresasPorFuncionarios.slice(0, 10).map(item => item.value), // Limitar a 10 empresas
        type: 'bar',
        itemStyle: {
          color: '#F2311F'
        }
      }
    ]
  };

  // Opções para o gráfico de sócios por status
  const sociosPorStatusOptions = {
    title: {
      text: 'Sócios por Status',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'horizontal',
      bottom: 10
    },
    series: [
      {
        name: 'Status',
        type: 'pie',
        radius: ['40%', '70%'],
        data: sociosPorStatus,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  return (
    <motion.div
      variants={animations.containerVariants}
      initial="hidden"
      animate="visible"
      style={{ willChange: 'transform' }}
    >
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32, color: '#F2311F' }}>
        Dashboard
      </Title>

      {/* Cards de Estatísticas */}
      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={animations.cardVariants}>
            <Card 
              hoverable 
              style={{ textAlign: 'center' }}
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
              style={{ textAlign: 'center' }}
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
              style={{ textAlign: 'center' }}
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
              style={{ textAlign: 'center' }}
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

      {/* Gráficos */}
      <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
        <Col xs={24} lg={12}>
          <Card title="Análise de Usuários" extra={<BarChartOutlined />}>
            {loadingCharts ? (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <p>Carregando gráfico...</p>
              </div>
            ) : (
              <ReactECharts 
                option={usuariosPorPerfilOptions} 
                style={{ height: '400px' }} 
              />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Análise de Sócios" extra={<BarChartOutlined />}>
            {loadingCharts ? (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <p>Carregando gráfico...</p>
              </div>
            ) : (
              <ReactECharts 
                option={sociosPorStatusOptions} 
                style={{ height: '400px' }} 
              />
            )}
          </Card>
        </Col>

        <Col xs={24}>
          <Card title="Análise de Empresas" extra={<BarChartOutlined />}>
            {loadingCharts ? (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <p>Carregando gráfico...</p>
              </div>
            ) : (
              <ReactECharts 
                option={empresasPorFuncionariosOptions} 
                style={{ height: '400px' }} 
              />
            )}
          </Card>
        </Col>
      </Row>
    </motion.div>
  );
};

export default Dashboard;