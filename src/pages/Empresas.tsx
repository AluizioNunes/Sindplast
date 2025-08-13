import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Tooltip, Input, Space } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Empresa } from '../types/empresaTypes';
import { apiService } from '../services/apiService';

const Empresas: React.FC = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const fetchEmpresas = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAllEmpresas();
      setEmpresas(data);
    } catch (error) {
      setEmpresas([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtros de busca
  const filteredEmpresas = empresas.filter(empresa =>
    empresa.razaoSocial?.toLowerCase().includes(searchText.toLowerCase()) ||
    empresa.cnpj?.toLowerCase().includes(searchText.toLowerCase()) ||
    empresa.cidade?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Razão Social',
      dataIndex: 'razaoSocial',
      key: 'razaoSocial',
      sorter: (a: Empresa, b: Empresa) => (a.razaoSocial || '').localeCompare(b.razaoSocial || ''),
    },
    {
      title: 'CNPJ',
      dataIndex: 'cnpj',
      key: 'cnpj',
    },
    {
      title: 'Telefone',
      dataIndex: 'telefone01',
      key: 'telefone01',
    },
    {
      title: 'Cidade',
      dataIndex: 'cidade',
      key: 'cidade',
    },
    {
      title: 'UF',
      dataIndex: 'uf',
      key: 'uf',
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: Empresa) => (
        <Space size="middle">
          <Tooltip title="Editar">
            <EditOutlined style={{ cursor: 'pointer', color: '#1677ff', fontSize: '16px' }} />
          </Tooltip>
          <Tooltip title="Excluir">
            <DeleteOutlined style={{ cursor: 'pointer', color: '#ff4d4f', fontSize: '16px' }} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <ToastContainer />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <Input
            placeholder="Pesquisar empresas"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
        </div>
        <Button type="primary" icon={<PlusOutlined />}>Nova Empresa</Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredEmpresas.map((empresa, idx) => ({ ...empresa, key: empresa.id || idx }))}
        loading={loading}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: 'No data' }}
      />
      <div style={{ marginTop: 16 }}>Total de {filteredEmpresas.length} empresas</div>
    </div>
  );
};

export default Empresas; 