import React, { useState, useEffect, useRef, useMemo } from 'react';
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
import { motion } from 'framer-motion';
import { animations } from '../utils/animations';
import { gerarFichaCadastralEmpresa } from '../reports/EmpresaFichaCadastro';
import { gerarRelatorioGeralEmpresas } from '../reports/EmpresasRelatorioGeral';

// Função auxiliar para formatar CNPJ
const formatCNPJ = (cnpj: string) => {
  if (!cnpj) return 'N/A';
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

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
      : ['razaoSocial', 'nomeFantasia', 'cnpj', 'telefone01', 'cidade', 'uf', 'actions'];
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

  // Filtros de busca otimizados com useMemo
  const filteredEmpresas = useMemo(() => {
    return empresas.filter(empresa =>
      empresa.razaoSocial?.toLowerCase().includes(searchText.toLowerCase()) ||
      empresa.nomeFantasia?.toLowerCase().includes(searchText.toLowerCase()) ||
      empresa.cnpj?.toLowerCase().includes(searchText.toLowerCase()) ||
      empresa.cidade?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [empresas, searchText]);

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
    const sucesso = gerarFichaCadastralEmpresa(empresa);
    if (sucesso) {
      toast.success(`Ficha da empresa ${empresa.razaoSocial} gerada com sucesso!`);
    } else {
      toast.error('Erro ao gerar o PDF. Verifique o console para mais detalhes.');
    }
  };

  const handlePrintEmpresas = () => {
    const sucesso = gerarRelatorioGeralEmpresas(empresas);
    if (sucesso) {
      toast.success('Relatório geral de empresas gerado com sucesso!');
    } else {
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

  

  type TableItemType = Empresa & { key: number };

  const allColumns: ColumnType<TableItemType>[] = [
    {
      title: 'RAZÃO SOCIAL',
      dataIndex: 'razaoSocial',
      key: 'razaoSocial',
      sorter: (a, b) => (a.razaoSocial || '').localeCompare(b.razaoSocial || ''),
      width: 300,
    },
    {
      title: 'NOME FANTASIA',
      dataIndex: 'nomeFantasia',
      key: 'nomeFantasia',
      width: 300,
    },
    {
      title: 'CNPJ',
      dataIndex: 'cnpj',
      key: 'cnpj',
      render: (cnpj: string) => formatCNPJ(cnpj),
      width: 180,
    },
    {
      title: 'TELEFONE',
      dataIndex: 'telefone01',
      key: 'telefone01',
      width: 150,
    },
    {
      title: 'CIDADE',
      dataIndex: 'cidade',
      key: 'cidade',
      width: 150,
    },
    {
      title: 'UF',
      dataIndex: 'uf',
      key: 'uf',
      width: 80,
    },
    {
      title: 'ENDEREÇO',
      dataIndex: 'endereco',
      key: 'endereco',
      width: 200,
    },
    {
      title: 'Nº FUNCIONÁRIOS',
      dataIndex: 'nFuncionarios',
      key: 'nFuncionarios',
      sorter: (a, b) => (a.nFuncionarios || 0) - (b.nFuncionarios || 0),
      width: 150,
    },
    {
      title: 'VALOR CONTRIBUIÇÃO',
      dataIndex: 'valorContribuicao',
      key: 'valorContribuicao',
      render: (valor: number) => valor ? `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'N/A',
      sorter: (a, b) => (a.valorContribuicao || 0) - (b.valorContribuicao || 0),
      width: 180,
    },
    {
      title: 'AÇÕES',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_: any, record: Empresa) => (
        <Space size="middle">
          <Tooltip title="Editar">
            <EditOutlined 
              style={{ cursor: 'pointer', color: '#1677ff', fontSize: '16px' }}
              onClick={() => handleEdit(record)}
              aria-label={`Editar empresa ${record.razaoSocial}`}
            />
          </Tooltip>
          <Tooltip title="Imprimir">
            <PrinterOutlined 
              style={{ cursor: 'pointer', color: '#52c41a', fontSize: '16px' }}
              onClick={() => handlePrintEmpresa(record)}
              aria-label={`Imprimir empresa ${record.razaoSocial}`}
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
              aria-label={`Excluir empresa ${record.razaoSocial}`}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const columns = useMemo(() => {
    return allColumns.filter(col => visibleColumns.includes(col.key as string));
  }, [visibleColumns]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={animations.container}
      style={{ padding: '0px' }}
      ref={containerRef}
    >
      <ToastContainer />
      <motion.div variants={animations.fadeIn}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Gerenciar colunas">
              <Button 
                icon={<SettingOutlined />}
                onClick={() => setColumnSelectorVisible(true)}
                aria-label="Gerenciar colunas visíveis"
              >
                COLUNAS
              </Button>
            </Tooltip>
            
            <Space.Compact style={{ marginLeft: '8px' }}>
              <Button 
                type={viewMode === 'table' ? 'primary' : 'default'}
                onClick={() => setViewMode('table')}
                icon={<TableOutlined />}
                aria-label="Visualizar em tabela"
              >
                TABELA
              </Button>
              
              <Button 
                type={viewMode === 'cards' ? 'primary' : 'default'}
                onClick={() => setViewMode('cards')}
                icon={<AppstoreOutlined />}
                aria-label="Visualizar em cartões"
              >
                CARTÕES
              </Button>
              
              <Button 
                type={viewMode === 'list' ? 'primary' : 'default'}
                onClick={() => setViewMode('list')}
                icon={<UnorderedListOutlined />}
                aria-label="Visualizar em lista"
              >
                LISTA
              </Button>
            </Space.Compact>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Space.Compact style={{ marginRight: '10px' }}>
              <Tooltip title="Imprimir lista">
                <Button 
                  icon={<PrinterOutlined />} 
                  aria-label="Imprimir lista de empresas"
                  onClick={handlePrintEmpresas}
                >
                  IMPRIMIR
                </Button>
              </Tooltip>
              <Tooltip title="Exportar dados">
                <Button icon={<ExportOutlined />} aria-label="Exportar dados de empresas">
                  EXPORTAR
                </Button>
              </Tooltip>
              <Tooltip title="Filtrar dados">
                <Button icon={<FilterOutlined />} aria-label="Filtrar dados de empresas">
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
              aria-label="Campo de pesquisa de empresas"
            />
            
            <Button
              type="primary"
              icon={<BankOutlined />}
              onClick={handleOpenCreate}
              style={{
                backgroundColor: '#4caf50',
                borderColor: '#4caf50',
              }}
              aria-label="Cadastrar nova empresa"
            >
              NOVA EMPRESA
            </Button>
          </div>
        </div>
      </motion.div>

      {viewMode === 'table' && (
        <motion.div variants={animations.card}>
          <Table
            columns={columns}
            dataSource={filteredEmpresas.map((empresa, idx) => ({ ...empresa, key: empresa.id || idx }))}
            rowKey="id"
            loading={loading}
            sticky
            scroll={{ y: tableScrollY, x: 'max-content' }}
            pagination={{ 
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} empresas`,
            }}
            locale={{ emptyText: 'Nenhuma empresa encontrada' }}
            components={{
              header: {
                cell: (props: any) => (
                  <th 
                    {...props} 
                    style={{ 
                      ...props.style, 
                      backgroundColor: '#FF3030',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                )
              }
            }}
          />
        </motion.div>
      )}

      {viewMode === 'cards' && (
        <motion.div variants={animations.card}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {loading ? (
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <div>Carregando empresas...</div>
              </div>
            ) : filteredEmpresas.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>
                Nenhuma empresa encontrada
              </div>
            ) : (
              filteredEmpresas.map((empresa) => (
                <Card
                  key={empresa.id}
                  title={empresa.razaoSocial}
                  extra={
                    <Space>
                      <Tooltip title="Editar">
                        <EditOutlined 
                          style={{ cursor: 'pointer', color: '#1677ff' }}
                          onClick={() => handleEdit(empresa)}
                          aria-label={`Editar empresa ${empresa.razaoSocial}`}
                        />
                      </Tooltip>
                      <Tooltip title="Imprimir">
                        <PrinterOutlined 
                          style={{ cursor: 'pointer', color: '#52c41a' }}
                          onClick={() => handlePrintEmpresa(empresa)}
                          aria-label={`Imprimir empresa ${empresa.razaoSocial}`}
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
                          aria-label={`Excluir empresa ${empresa.razaoSocial}`}
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
              ))
            )}
          </div>
        </motion.div>
      )}

      {viewMode === 'list' && (
        <motion.div variants={animations.list}>
          <List
            dataSource={filteredEmpresas}
            loading={loading}
            locale={{ emptyText: 'Nenhuma empresa encontrada' }}
            renderItem={(empresa) => (
              <motion.div variants={animations.listItem}>
                <List.Item
                  actions={[
                    <Tooltip title="Editar">
                      <EditOutlined 
                        style={{ cursor: 'pointer', color: '#1677ff' }}
                        onClick={() => handleEdit(empresa)}
                        aria-label={`Editar empresa ${empresa.razaoSocial}`}
                      />
                    </Tooltip>,
                    <Tooltip title="Imprimir">
                      <PrinterOutlined 
                        style={{ cursor: 'pointer', color: '#52c41a' }}
                        onClick={() => handlePrintEmpresa(empresa)}
                        aria-label={`Imprimir empresa ${empresa.razaoSocial}`}
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
                        aria-label={`Excluir empresa ${empresa.razaoSocial}`}
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
              </motion.div>
            )}
          />
        </motion.div>
      )}

      <Modal
        title="Gerenciar Colunas"
        open={columnSelectorVisible}
        onCancel={() => setColumnSelectorVisible(false)}
        onOk={() => {
          localStorage.setItem('empresasVisibleColumns', JSON.stringify(visibleColumns));
          setColumnSelectorVisible(false);
        }}
        aria-label="Modal de gerenciamento de colunas"
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
              aria-label={`Coluna ${typeof column.title === 'string' ? column.title : column.key}`}
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
    </motion.div>
  );
};

export default Empresas; 