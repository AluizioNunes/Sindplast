import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Select, DatePicker, Table, Statistic, Space, Typography, Divider } from 'antd';
import { 
  BankOutlined, 
  ExportOutlined, 
  PrinterOutlined, 
  FilterOutlined,
  TeamOutlined,
  DollarOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { Empresa } from '../types/empresaTypes';
import { apiService } from '../services/apiService';
import moment from 'moment';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const RelatoriosEmpresas: React.FC = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({
    status: 'todas',
    cidade: 'todas',
    uf: 'todas',
    dataInicio: null as Date | null,
    dataFim: null as Date | null
  });

  useEffect(() => {
    carregarEmpresas();
  }, []);

  const carregarEmpresas = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAllEmpresas();
      setEmpresas(data);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Estatísticas
  const totalEmpresas = empresas.length;
  const empresasAtivas = empresas.length; // Removido filtro por status que não existe
  const totalFuncionarios = empresas.reduce((sum, e) => sum + (e.nFuncionarios || 0), 0);
  const valorTotalContribuicao = empresas.reduce((sum, e) => sum + (e.valorContribuicao || 0), 0);

  // Colunas da tabela
  const columns = [
    {
      title: 'Código',
      dataIndex: 'codEmpresa',
      key: 'codEmpresa',
      width: 80,
    },
    {
      title: 'Razão Social',
      dataIndex: 'razaoSocial',
      key: 'razaoSocial',
      ellipsis: true,
    },
    {
      title: 'CNPJ',
      dataIndex: 'cnpj',
      key: 'cnpj',
      width: 150,
    },
    {
      title: 'Cidade/UF',
      key: 'cidadeUF',
      render: (_: any, record: Empresa) => `${record.cidade || 'N/A'}/${record.uf || 'N/A'}`,
      width: 120,
    },
    {
      title: 'Funcionários',
      dataIndex: 'nFuncionarios',
      key: 'nFuncionarios',
      width: 100,
      render: (value: number) => value || 0,
    },
    {
      title: 'Valor Contribuição',
      dataIndex: 'valorContribuicao',
      key: 'valorContribuicao',
      width: 150,
      render: (value: number) => 
        value ? `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 0,00',
    },
    {
      title: 'Data Contribuição',
      dataIndex: 'dataContribuicao',
      key: 'dataContribuicao',
      width: 120,
      render: (date: string) => date ? moment(date).format('DD/MM/YYYY') : 'N/A',
    },
    {
      title: 'Telefone',
      dataIndex: 'telefone01',
      key: 'telefone01',
      width: 120,
      render: (value: string) => value || 'N/A',
    },
  ];

  // Aplicar filtros
  const empresasFiltradas = empresas.filter(empresa => {
    if (filtros.cidade !== 'todas' && empresa.cidade !== filtros.cidade) return false;
    if (filtros.uf !== 'todas' && empresa.uf !== filtros.uf) return false;
    if (filtros.dataInicio && empresa.dataContribuicao) {
      const dataEmpresa = moment(empresa.dataContribuicao);
      if (dataEmpresa.isBefore(filtros.dataInicio)) return false;
    }
    if (filtros.dataFim && empresa.dataContribuicao) {
      const dataEmpresa = moment(empresa.dataContribuicao);
      if (dataEmpresa.isAfter(filtros.dataFim)) return false;
    }
    return true;
  });

  // Obter cidades e UFs únicas para filtros
  const cidades = Array.from(new Set(empresas.map(e => e.cidade).filter(Boolean)));
  const ufs = Array.from(new Set(empresas.map(e => e.uf).filter(Boolean)));

  const handleExportar = () => {
    // Implementar exportação para Excel/PDF
    console.log('Exportando relatório de empresas...');
  };

  const handleImprimir = () => {
    // Implementar impressão
    window.print();
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Estatísticas */}
      <Row gutter={16} style={{ marginBottom: '30px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total de Empresas"
              value={totalEmpresas}
              prefix={<BankOutlined />}
              valueStyle={{ color: '#F2311F' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Empresas Ativas"
              value={empresasAtivas}
              prefix={<BankOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total de Funcionários"
              value={totalFuncionarios}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Valor Total Contribuições"
              value={valorTotalContribuicao}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#52c41a' }}
              formatter={(value) => `R$ ${value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            />
          </Card>
        </Col>
      </Row>

      {/* Filtros */}
      <Card title="Filtros" style={{ marginBottom: '20px' }}>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Text strong>Cidade:</Text>
            <Select
              style={{ width: '100%', marginTop: '5px' }}
              value={filtros.cidade}
              onChange={(value) => setFiltros({ ...filtros, cidade: value })}
            >
              <Select.Option value="todas">Todas as Cidades</Select.Option>
              {cidades.map(cidade => (
                <Select.Option key={cidade} value={cidade}>{cidade}</Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            <Text strong>UF:</Text>
            <Select
              style={{ width: '100%', marginTop: '5px' }}
              value={filtros.uf}
              onChange={(value) => setFiltros({ ...filtros, uf: value })}
            >
              <Select.Option value="todas">Todos os Estados</Select.Option>
              {ufs.map(uf => (
                <Select.Option key={uf} value={uf}>{uf}</Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <Text strong>Período de Contribuição:</Text>
            <RangePicker
              style={{ width: '100%', marginTop: '5px' }}
              onChange={(dates) => setFiltros({
                ...filtros,
                dataInicio: dates?.[0]?.toDate() || null,
                dataFim: dates?.[1]?.toDate() || null
              })}
            />
          </Col>
          <Col span={4}>
            <Space>
              <Button 
                type="primary" 
                icon={<FilterOutlined />}
                onClick={() => setFiltros({
                  status: 'todas',
                  cidade: 'todas',
                  uf: 'todas',
                  dataInicio: null,
                  dataFim: null
                })}
              >
                Limpar
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Ações */}
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col>
          <Button 
            type="primary" 
            icon={<ExportOutlined />}
            onClick={handleExportar}
            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
          >
            Exportar
          </Button>
        </Col>
        <Col>
          <Button 
            icon={<PrinterOutlined />}
            onClick={handleImprimir}
          >
            Imprimir
          </Button>
        </Col>
      </Row>

      {/* Tabela */}
      <Card title={`Empresas (${empresasFiltradas.length} registros)`}>
        <Table
          columns={columns}
          dataSource={empresasFiltradas}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} de ${total} empresas`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default RelatoriosEmpresas; 