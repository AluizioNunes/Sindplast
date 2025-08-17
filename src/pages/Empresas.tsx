import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Modal, Tooltip, Input, Space, Card, List, Avatar, Checkbox } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined, 
  PlusOutlined,
  SettingOutlined,
  PrinterOutlined,
  ExportOutlined,
  FilterOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  TableOutlined,
  BankOutlined
} from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Empresa } from '../types/empresaTypes';
import { apiService } from '../services/apiService';
import EmpresaModal, { EmpresaForm } from '../components/EmpresaModal';
import ConfirmModal from '../components/ConfirmModal';
import { showDeleteSuccessToast, showDeleteCancelToast, showDeleteErrorToast } from '../utils/toastUtils';
import { ColumnType } from 'antd/es/table';

const Empresas: React.FC = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    // Carregar configuração salva no localStorage ou usar padrão
    const savedColumns = localStorage.getItem('empresasVisibleColumns');
    return savedColumns 
      ? JSON.parse(savedColumns) 
      : ['razaoSocial', 'cnpj', 'telefone01', 'cidade', 'uf', 'actions'];
  });
  const [columnSelectorVisible, setColumnSelectorVisible] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'list' | 'cards' | 'table'>('table');
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [empresaToDelete, setEmpresaToDelete] = useState<Empresa | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tableScrollY, setTableScrollY] = useState<number>(500);

  useEffect(() => {
    fetchEmpresas();
  }, []);

  // Calcula altura disponível para scroll da tabela
  useEffect(() => {
    const calcHeight = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // margem inferior para footer e respiro
      const bottomPadding = 24;
      const available = viewportHeight - rect.top - bottomPadding;
      if (available > 200) setTableScrollY(available);
    };
    calcHeight();
    window.addEventListener('resize', calcHeight);
    return () => window.removeEventListener('resize', calcHeight);
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

  const handleOpenCreate = () => {
    setEditingEmpresa(null);
    setModalVisible(true);
  };

  const handleSubmit = async (values: EmpresaForm) => {
    try {
      setSaving(true);
      if (editingEmpresa) {
        await apiService.updateEmpresa(editingEmpresa.id, values as any);
        toast.success('Empresa atualizada com sucesso!');
      } else {
        await apiService.createEmpresa(values as any);
        toast.success('Empresa criada com sucesso!');
      }
      setModalVisible(false);
      await fetchEmpresas();
    } catch (error) {
      // toast já tratado no apiService
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (empresa: Empresa) => {
    setEditingEmpresa(empresa);
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditingEmpresa(null);
  };

  const handlePrintEmpresa = (empresa: Empresa) => {
    try {
      toast.info(`Gerando PDF da ficha da empresa ${empresa.razaoSocial}...`);
      // TODO: Implementar geração de PDF para empresas
      toast.success(`Ficha da empresa ${empresa.razaoSocial} gerada com sucesso!`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar o PDF. Verifique o console para mais detalhes.');
    }
  };

  const handleDelete = async (empresa: Empresa) => {
    console.log('handleDelete chamado para empresa:', empresa);
    setEmpresaToDelete(empresa);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!empresaToDelete) return;
    
    setDeleting(true);
    try {
      await apiService.deleteEmpresa(empresaToDelete.id);
      showDeleteSuccessToast(empresaToDelete.razaoSocial || 'Empresa');
      await fetchEmpresas();
      setDeleteModalVisible(false);
      setEmpresaToDelete(null);
    } catch (error) {
      showDeleteErrorToast();
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    if (empresaToDelete) {
      showDeleteCancelToast(empresaToDelete.razaoSocial || 'Empresa');
    }
    setDeleteModalVisible(false);
    setEmpresaToDelete(null);
  };

  const formatCNPJ = (cnpj: string) => {
    if (!cnpj) return 'N/A';
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  type TableItemType = Empresa & { key: number };

  const allColumns: ColumnType<TableItemType>[] = [
    {
      title: 'Razão Social',
      dataIndex: 'razaoSocial',
      key: 'razaoSocial',
      sorter: (a, b) => (a.razaoSocial || '').localeCompare(b.razaoSocial || ''),
    },
    {
      title: 'CNPJ',
      dataIndex: 'cnpj',
      key: 'cnpj',
      render: (cnpj: string) => formatCNPJ(cnpj),
    },
    {
      title: 'Nome Fantasia',
      dataIndex: 'nomeFantasia',
      key: 'nomeFantasia',
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
      title: 'Endereço',
      dataIndex: 'endereco',
      key: 'endereco',
    },
    {
      title: 'Nº Funcionários',
      dataIndex: 'nFuncionarios',
      key: 'nFuncionarios',
      sorter: (a, b) => (a.nFuncionarios || 0) - (b.nFuncionarios || 0),
    },
    {
      title: 'Valor Contribuição',
      dataIndex: 'valorContribuicao',
      key: 'valorContribuicao',
      render: (valor: number) => valor ? `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'N/A',
      sorter: (a, b) => (a.valorContribuicao || 0) - (b.valorContribuicao || 0),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: Empresa) => (
        <Space size="middle">
          <Tooltip title="Editar">
            <EditOutlined 
              style={{ cursor: 'pointer', color: '#1677ff', fontSize: '16px' }}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Imprimir">
            <PrinterOutlined 
              style={{ cursor: 'pointer', color: '#52c41a', fontSize: '16px' }}
              onClick={() => handlePrintEmpresa(record)}
            />
          </Tooltip>
          <Tooltip title="Excluir">
            <DeleteOutlined 
              style={{ cursor: 'pointer', color: '#ff4d4f', fontSize: '16px' }}
              onClick={(e) => {
                e.stopPropagation();
                console.log('Clique no ícone de exclusão detectado');
                handleDelete(record);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const columns = allColumns.filter(col => visibleColumns.includes(col.key as string));

  return (
    <div style={{ padding: '0px' }}>
      <ToastContainer />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Gerenciar colunas">
            <Button 
              icon={<SettingOutlined />}
              onClick={() => setColumnSelectorVisible(true)}
            >
              COLUNAS
            </Button>
          </Tooltip>
          
          <Space.Compact style={{ marginLeft: '8px' }}>
            <Button 
              type={viewMode === 'list' ? 'primary' : 'default'}
              onClick={() => setViewMode('list')}
              icon={<UnorderedListOutlined />}
            >
              LISTA
            </Button>
            
            <Button 
              type={viewMode === 'cards' ? 'primary' : 'default'}
              onClick={() => setViewMode('cards')}
              icon={<AppstoreOutlined />}
            >
              CARTÕES
            </Button>
            
            <Button 
              type={viewMode === 'table' ? 'primary' : 'default'}
              onClick={() => setViewMode('table')}
              icon={<TableOutlined />}
            >
              TABELA
            </Button>
          </Space.Compact>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Space.Compact style={{ marginRight: '10px' }}>
            <Tooltip title="Imprimir lista">
              <Button icon={<PrinterOutlined />}>
                IMPRIMIR
              </Button>
            </Tooltip>
            <Tooltip title="Exportar dados">
              <Button icon={<ExportOutlined />}>
                EXPORTAR
              </Button>
            </Tooltip>
            <Tooltip title="Filtrar dados">
              <Button icon={<FilterOutlined />}>
                FILTRAR
              </Button>
            </Tooltip>
          </Space.Compact>
          
          <Input
            placeholder="Pesquisar empresas"
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          
          <Button
            type="primary"
            icon={<BankOutlined />}
            onClick={handleOpenCreate}
            style={{
              backgroundColor: '#4caf50',
              borderColor: '#4caf50',
            }}
          >
            NOVA EMPRESA
          </Button>
        </div>
      </div>

      {viewMode === 'table' && (
      <Table
        columns={columns}
        dataSource={filteredEmpresas.map((empresa, idx) => ({ ...empresa, key: empresa.id || idx }))}
          rowKey="id"
          loading={loading}
          sticky
          scroll={{ y: tableScrollY }}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} empresas`,
          }}
          locale={{ emptyText: 'Nenhuma empresa encontrada' }}
        />
      )}

      {viewMode === 'cards' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {filteredEmpresas.map((empresa) => (
            <Card
              key={empresa.id}
              title={empresa.razaoSocial}
              extra={
                <Space>
                  <Tooltip title="Editar">
                    <EditOutlined 
                      style={{ cursor: 'pointer', color: '#1677ff' }}
                      onClick={() => handleEdit(empresa)}
                    />
                  </Tooltip>
                  <Tooltip title="Imprimir">
                    <PrinterOutlined 
                      style={{ cursor: 'pointer', color: '#52c41a' }}
                      onClick={() => handlePrintEmpresa(empresa)}
                    />
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <DeleteOutlined 
                      style={{ cursor: 'pointer', color: '#ff4d4f' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Clique no ícone de exclusão detectado (cards)');
                        handleDelete(empresa);
                      }}
                    />
                  </Tooltip>
                </Space>
              }
            >
              <p><strong>CNPJ:</strong> {formatCNPJ(empresa.cnpj || '')}</p>
              <p><strong>Telefone:</strong> {empresa.telefone01 || 'N/A'}</p>
              <p><strong>Cidade:</strong> {empresa.cidade || 'N/A'} - {empresa.uf || 'N/A'}</p>
              <p><strong>Funcionários:</strong> {empresa.nFuncionarios || 0}</p>
              <p><strong>Contribuição:</strong> {empresa.valorContribuicao ? `R$ ${empresa.valorContribuicao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'N/A'}</p>
            </Card>
          ))}
        </div>
      )}

      {viewMode === 'list' && (
        <List
          dataSource={filteredEmpresas}
        loading={loading}
          renderItem={(empresa) => (
            <List.Item
              actions={[
                <Tooltip title="Editar">
                  <EditOutlined 
                    style={{ cursor: 'pointer', color: '#1677ff' }}
                    onClick={() => handleEdit(empresa)}
                  />
                </Tooltip>,
                <Tooltip title="Imprimir">
                  <PrinterOutlined 
                    style={{ cursor: 'pointer', color: '#52c41a' }}
                    onClick={() => handlePrintEmpresa(empresa)}
                  />
                </Tooltip>,
                <Tooltip title="Excluir">
                  <DeleteOutlined 
                    style={{ cursor: 'pointer', color: '#ff4d4f' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Clique no ícone de exclusão detectado (lista)');
                      handleDelete(empresa);
                    }}
                  />
                </Tooltip>
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<BankOutlined />} style={{ backgroundColor: '#F2311F' }} />}
                title={empresa.razaoSocial}
                description={
                  <div>
                    <p><strong>CNPJ:</strong> {formatCNPJ(empresa.cnpj || '')}</p>
                    <p><strong>Telefone:</strong> {empresa.telefone01 || 'N/A'}</p>
                    <p><strong>Cidade:</strong> {empresa.cidade || 'N/A'} - {empresa.uf || 'N/A'}</p>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}

      <Modal
        title="Gerenciar Colunas"
        open={columnSelectorVisible}
        onCancel={() => setColumnSelectorVisible(false)}
        onOk={() => {
          localStorage.setItem('empresasVisibleColumns', JSON.stringify(visibleColumns));
          setColumnSelectorVisible(false);
        }}
      >
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {allColumns.map(column => (
            <Checkbox
              key={column.key}
              checked={visibleColumns.includes(column.key as string)}
              onChange={(e) => {
                if (e.target.checked) {
                  setVisibleColumns([...visibleColumns, column.key as string]);
                } else {
                  setVisibleColumns(visibleColumns.filter(col => col !== column.key));
                }
              }}
            >
              {typeof column.title === 'string' ? column.title : column.key}
            </Checkbox>
          ))}
        </div>
      </Modal>

      <EmpresaModal
        visible={modalVisible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        loading={saving}
        isEdit={!!editingEmpresa}
        initialValues={editingEmpresa || undefined}
      />

      <ConfirmModal
        visible={deleteModalVisible}
        title="Confirmar exclusão"
        content={`Deseja excluir o registro "${empresaToDelete?.razaoSocial}" da base de dados SINDPLAST?`}
        okText="Sim, confirmar exclusão"
        cancelText="Não"
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={deleting}
      />
    </div>
  );
};

export default Empresas; 