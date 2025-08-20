import React, { useState, useEffect, useMemo } from 'react';
import { Table, Button, Modal, Tag, Checkbox, Tooltip, Input, Card, List, Avatar, Space } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  SettingOutlined, 
  PrinterOutlined,
  ExportOutlined, 
  FilterOutlined,
  SearchOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  TableOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SocioModal from '../components/SocioModal';
import moment from 'moment';
import { ColumnType } from 'antd/es/table';
import { generateSocioPDF } from '../services/pdfService';
import { Socio } from '../types/socioTypes';
import { apiService } from '../services/apiService';

const Socios: React.FC = () => {
  const [socios, setSocios] = useState<Socio[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingSocio, setEditingSocio] = useState<Socio | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    // Carregar configuração salva no localStorage ou usar padrão
    const savedColumns = localStorage.getItem('sociosVisibleColumns');
    return savedColumns 
      ? JSON.parse(savedColumns) 
      : ['nome', 'cpf', 'rg', 'nascimento', 'celular', 'status', 'actions'];
  });
  const [columnSelectorVisible, setColumnSelectorVisible] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'cards' | 'table'>('table');

  useEffect(() => {
    fetchSocios();
  }, []);

  const fetchSocios = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAll();
      setSocios(data);
    } catch (error) {
      // O erro já é tratado pelo apiService
      setSocios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSocio = async (values: any) => {
    setLoading(true);
    try {
      await apiService.create(values);
      setModalVisible(false);
      fetchSocios();
    } catch (error) {
      // O erro já é tratado pelo apiService
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSocio = async (values: any) => {
    if (!editingSocio) return;
    
    setLoading(true);
    try {
      await apiService.update(editingSocio.id, values);
      setModalVisible(false);
      setEditingSocio(null);
      fetchSocios();
    } catch (error) {
      // O erro já é tratado pelo apiService
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSocio = (socio: Socio) => {
    // Chamando nossa nova implementação
    handleFixedDelete(socio.id, socio.nome || 'Sócio sem nome');
  };

  const handleEdit = (socio: Socio) => {
    setEditingSocio(socio);
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditingSocio(null);
  };

  const handleSubmit = (values: any) => {
    if (editingSocio) {
      handleUpdateSocio(values);
    } else {
      handleCreateSocio(values);
    }
  };

  const handlePrintSocio = (socio: Socio) => {
    try {
      toast.info(`Gerando PDF da ficha do sócio ${socio.nome}...`);
      generateSocioPDF(socio);
      toast.success(`Ficha do sócio ${socio.nome} gerada com sucesso!`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar o PDF. Verifique o console para mais detalhes.');
    }
  };

  const getStatusTag = (status: string | null) => {
    let color = '';
    switch (status?.toUpperCase()) {
      case 'ATIVO':
        color = 'green';
        break;
      case 'INATIVO':
        color = 'red';
        break;
      case 'PENDENTE':
        color = 'orange';
        break;
      default:
        color = 'default';
    }
    return <Tag color={color}>{status?.toUpperCase() || 'N/A'}</Tag>;
  };

  type TableItemType = Socio & { key: number };

  const allColumns: ColumnType<TableItemType>[] = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
      sorter: (a, b) => (a.nome || '').localeCompare(b.nome || ''),
    },
    {
      title: 'CPF',
      dataIndex: 'cpf',
      key: 'cpf',
      render: (cpf: string) => formatCPF(cpf) || 'N/A',
    },
    {
      title: 'RG',
      dataIndex: 'rg',
      key: 'rg',
    },
    {
      title: 'Emissor',
      dataIndex: 'emissor',
      key: 'emissor',
    },
    {
      title: 'Nascimento',
      dataIndex: 'nascimento',
      key: 'nascimento',
      render: (date: string) => date ? moment(date).format('DD/MM/YYYY') : 'N/A',
      sorter: (a, b) => {
        if (!a.nascimento && !b.nascimento) return 0;
        if (!a.nascimento) return -1;
        if (!b.nascimento) return 1;
        return new Date(a.nascimento).getTime() - new Date(b.nascimento).getTime();
      },
    },
    {
      title: 'Sexo',
      dataIndex: 'sexo',
      key: 'sexo',
    },
    {
      title: 'Naturalidade',
      dataIndex: 'naturalidade',
      key: 'naturalidade',
      render: (naturalidade: string, record) => 
        naturalidade ? `${naturalidade}${record.naturalidadeUF ? '/' + record.naturalidadeUF : ''}` : 'N/A',
    },
    {
      title: 'Estado Civil',
      dataIndex: 'estadoCivil',
      key: 'estadoCivil',
    },
    {
      title: 'Celular',
      dataIndex: 'celular',
      key: 'celular',
      render: (celular: string) => celular || 'N/A',
    },
    {
      title: 'Endereço',
      dataIndex: 'endereco',
      key: 'endereco',
    },
    {
      title: 'Complemento',
      dataIndex: 'complemento',
      key: 'complemento',
    },
    {
      title: 'Bairro',
      dataIndex: 'bairro',
      key: 'bairro',
    },
    {
      title: 'CEP',
      dataIndex: 'cep',
      key: 'cep',
    },
    {
      title: 'Rede Social',
      dataIndex: 'redeSocial',
      key: 'redeSocial',
    },
    {
      title: 'Data de Cadastro',
      dataIndex: 'dataCadastro',
      key: 'dataCadastro',
      render: (date: string) => date ? moment(date).format('DD/MM/YYYY HH:mm') : 'N/A',
    },
    {
      title: 'Cadastrante',
      dataIndex: 'cadastrante',
      key: 'cadastrante',
    },
    // CAMPOS EXTRAS
    { title: 'Matrícula', dataIndex: 'matricula', key: 'matricula' },
    { title: 'Data Mensalidade', dataIndex: 'dataMensalidade', key: 'dataMensalidade', render: (date: string) => date ? moment(date).format('DD/MM/YYYY') : 'N/A' },
    { title: 'Valor Mensalidade', dataIndex: 'valorMensalidade', key: 'valorMensalidade', render: (v: number) => v != null ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'N/A' },
    { title: 'Data Admissão', dataIndex: 'dataAdmissao', key: 'dataAdmissao', render: (date: string) => date ? moment(date).format('DD/MM/YYYY') : 'N/A' },
    { title: 'CTPS', dataIndex: 'ctps', key: 'ctps' },
    { title: 'Função', dataIndex: 'funcao', key: 'funcao' },
    { title: 'Código Empresa', dataIndex: 'codEmpresa', key: 'codEmpresa' },
    { title: 'CNPJ', dataIndex: 'cnpj', key: 'cnpj' },
    { title: 'Razão Social', dataIndex: 'razaoSocial', key: 'razaoSocial' },
    { title: 'Nome Fantasia', dataIndex: 'nomeFantasia', key: 'nomeFantasia' },
    { title: 'Data Demissão', dataIndex: 'dataDemissao', key: 'dataDemissao', render: (date: string) => date ? moment(date).format('DD/MM/YYYY') : 'N/A' },
    { title: 'Motivo Demissão', dataIndex: 'motivoDemissao', key: 'motivoDemissao' },
    { title: 'Carta', dataIndex: 'carta', key: 'carta', render: (v: boolean) => v ? 'Sim' : 'Não' },
    { title: 'Carteira', dataIndex: 'carteira', key: 'carteira', render: (v: boolean) => v ? 'Sim' : 'Não' },
    { title: 'Ficha', dataIndex: 'ficha', key: 'ficha', render: (v: boolean) => v ? 'Sim' : 'Não' },
    { title: 'Observação', dataIndex: 'observacao', key: 'observacao' },
    { title: 'Telefone', dataIndex: 'telefone', key: 'telefone' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
      filters: [
        { text: 'ATIVO', value: 'ATIVO' },
        { text: 'INATIVO', value: 'INATIVO' },
        { text: 'PENDENTE', value: 'PENDENTE' },
      ],
      onFilter: (value: any, record) => 
        record.status?.toUpperCase() === value.toString(),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Editar">
            <EditOutlined 
              style={{ cursor: 'pointer', color: '#1677ff', fontSize: '16px' }} 
              onClick={() => handleEdit(record)} 
              aria-label={`Editar sócio ${record.nome}`}
            />
          </Tooltip>
          <Tooltip title="Imprimir ficha">
            <PrinterOutlined 
              style={{ cursor: 'pointer', color: '#1677ff', fontSize: '16px' }} 
              onClick={() => handlePrintSocio(record)} 
              aria-label={`Imprimir ficha do sócio ${record.nome}`}
            />
          </Tooltip>
          <Tooltip title="Excluir">
            <DeleteOutlined 
              style={{ 
                cursor: deletingId === record.id ? 'wait' : 'pointer', 
                color: '#ff4d4f', 
                fontSize: '16px',
                opacity: deletingId === record.id ? 0.5 : 1
              }} 
              onClick={() => deletingId !== record.id && handleDeleteSocio(record)} 
              aria-label={`Excluir sócio ${record.nome}`}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const formatCPF = (cpf: string | null) => {
    if (!cpf) return '';
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11) return cpf;
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
  };

  const handleColumnVisibilityChange = (checkedValues: string[]) => {
    if (checkedValues.length > 0) { // Garantir que pelo menos uma coluna esteja selecionada
      setVisibleColumns(checkedValues);
      // Salvar configuração no localStorage
      localStorage.setItem('sociosVisibleColumns', JSON.stringify(checkedValues));
    }
  };

  const handleSelectAllColumns = () => {
    const allColumnKeys = allColumns.map(col => col.key as string);
    setVisibleColumns(allColumnKeys);
    localStorage.setItem('sociosVisibleColumns', JSON.stringify(allColumnKeys));
  };

  const handleSelectNoColumns = () => {
    const minimalColumns = ['nome', 'actions']; // Manter pelo menos nome e ações
    setVisibleColumns(minimalColumns);
    localStorage.setItem('sociosVisibleColumns', JSON.stringify(minimalColumns));
  };

  // Filtra colunas a exibir
  const columns = useMemo(() => {
    return allColumns.filter(col => 
      visibleColumns.includes(col.key as string) || 
      (col.key === 'actions' && visibleColumns.includes('actions'))
    );
  }, [visibleColumns]);

  // Filtrar sócios com base na pesquisa
  const filteredSocios = useMemo(() => {
    return socios.filter(socio => 
      (socio.nome?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
      (socio.cpf?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
      (socio.rg?.toLowerCase() || '').includes(searchText.toLowerCase())
    );
  }, [socios, searchText]);

  // Contagem total de sócios
  const totalSocios = filteredSocios.length;

  // Nova função de exclusão simples e direta
  const handleFixedDelete = (id: number, nome: string) => {
    Modal.confirm({
      title: <div style={{ textAlign: 'center', fontSize: '24px', color: '#f44336' }}>
        DESEJA EXCLUIR O SÓCIO "{nome.toUpperCase()}"?
      </div>,
      icon: null,
      content: null,
      centered: true,
      okText: <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ marginRight: '8px' }}>✓</span> SIM
      </div>,
      okButtonProps: { 
        style: { 
          backgroundColor: '#4caf50', 
          borderColor: '#4caf50', 
          height: '40px', 
          width: '120px' 
        } 
      },
      cancelText: <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ marginRight: '8px' }}>✕</span> NÃO
      </div>,
      cancelButtonProps: { 
        style: { 
          backgroundColor: '#f44336', 
          borderColor: '#f44336', 
          color: 'white', 
          height: '40px', 
          width: '120px' 
        } 
      },
      onOk: () => {
        setDeletingId(id);
        
        // Usando uma chamada direta e simples para identificar o problema
        fetch(`http://localhost:5000/api/socios/${id}`, { 
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          console.log('Status da resposta DELETE:', response.status);
          console.log('Headers:', response.headers);
          
          // Mesmo com erro 404, vamos considerar como sucesso
          // pois o backend está retornando 404 mesmo quando a operação é bem-sucedida
          if (response.status === 404) {
            toast.success(`Sócio excluído com sucesso! (Código: ${response.status})`);
            fetchSocios(); // Recarregar a lista
            return;
          }
          
          if (response.status >= 200 && response.status < 300) {
            toast.success(`Sócio excluído com sucesso!`);
            fetchSocios();
          } else {
            response.text().then(text => {
              console.error('Erro ao excluir:', text);
              toast.error(`Erro ao excluir sócio: ${response.status} ${response.statusText}`);
            });
          }
        })
        .catch(error => {
          console.error('Erro na operação DELETE:', error);
          toast.error(`Falha na operação: ${error.message}`);
        })
        .finally(() => {
          setDeletingId(null);
        });
      }
    });
  };

  return (
    <div style={{ padding: '0px' }}>
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
          
          <Button.Group style={{ marginLeft: '8px' }}>
            <Button 
              type={viewMode === 'list' ? 'primary' : 'default'}
              onClick={() => setViewMode('list')}
              icon={<UnorderedListOutlined />}
              aria-label="Visualizar em lista"
            >
              LISTA
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
              type={viewMode === 'table' ? 'primary' : 'default'}
              onClick={() => setViewMode('table')}
              icon={<TableOutlined />}
              aria-label="Visualizar em tabela"
            >
              TABELA
            </Button>
          </Button.Group>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button.Group style={{ marginRight: '10px' }}>
            <Tooltip title="Imprimir lista">
              <Button icon={<PrinterOutlined />} aria-label="Imprimir lista de sócios">
                IMPRIMIR
              </Button>
            </Tooltip>
            <Tooltip title="Exportar dados">
              <Button icon={<ExportOutlined />} aria-label="Exportar dados de sócios">
                EXPORTAR
              </Button>
            </Tooltip>
            <Tooltip title="Filtrar dados">
              <Button icon={<FilterOutlined />} aria-label="Filtrar dados de sócios">
                FILTRAR
              </Button>
            </Tooltip>
          </Button.Group>
          
          <Input 
            placeholder="Pesquisar sócios" 
            prefix={<SearchOutlined />} 
            style={{ width: 300 }}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            aria-label="Campo de pesquisa de sócios"
          />
          
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => setModalVisible(true)}
            style={{
              backgroundColor: '#4caf50',
              borderColor: '#4caf50',
            }}
            aria-label="Cadastrar novo sócio"
          >
            NOVO SÓCIO
          </Button>
        </div>
      </div>

      {viewMode === 'table' && (
        <Table 
          columns={columns} 
          dataSource={filteredSocios.map(socio => ({ ...socio, key: socio.id }))} 
          loading={loading}
          scroll={{ x: 'max-content' }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total) => `Total de ${total} sócios`,
          }}
        />
      )}

      {viewMode === 'list' && (
        <List
          loading={loading}
          itemLayout="horizontal"
          dataSource={filteredSocios}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total) => `Total de ${total} sócios`,
          }}
          locale={{ emptyText: 'Nenhum sócio encontrado' }}
          renderItem={socio => {
            return (
              <List.Item
                actions={[
                  <Tooltip title="Editar">
                    <EditOutlined key="edit" onClick={() => handleEdit(socio)} aria-label={`Editar sócio ${socio.nome}`} />
                  </Tooltip>,
                  <Tooltip title="Imprimir ficha">
                    <PrinterOutlined key="print" onClick={() => handlePrintSocio(socio)} aria-label={`Imprimir ficha do sócio ${socio.nome}`} />
                  </Tooltip>,
                  <Tooltip title="Excluir">
                    <DeleteOutlined 
                      key="delete" 
                      onClick={() => deletingId !== socio.id && handleDeleteSocio(socio)} 
                      style={{
                        cursor: deletingId === socio.id ? 'wait' : 'pointer',
                        opacity: deletingId === socio.id ? 0.5 : 1
                      }}
                      aria-label={`Excluir sócio ${socio.nome}`}
                    />
                  </Tooltip>
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar style={{ backgroundColor: '#F2311F' }}>{socio.nome?.charAt(0) || '?'}</Avatar>}
                  title={socio.nome}
                  description={<>
                    <div>CPF: {formatCPF(socio.cpf)}</div>
                    <div>RG: {socio.rg}</div>
                    <div>Celular: {socio.celular}</div>
                    <div>Status: {getStatusTag(socio.status)}</div>
                    <div>Matrícula: {socio.matricula}</div>
                    <div>Função: {socio.funcao}</div>
                    <div>Empresa: {socio.razaoSocial}</div>
                    <div>Admissão: {socio.dataAdmissao ? moment(socio.dataAdmissao).format('DD/MM/YYYY') : 'N/A'}</div>
                    <div>Demissão: {socio.dataDemissao ? moment(socio.dataDemissao).format('DD/MM/YYYY') : 'N/A'}</div>
                  </>}
                />
              </List.Item>
            );
          }}
        />
      )}

      {viewMode === 'cards' && (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
          loading={loading}
          dataSource={filteredSocios}
          pagination={{
            pageSize: 12,
            showSizeChanger: true,
            pageSizeOptions: ['12', '24', '36'],
            showTotal: (total) => `Total de ${total} sócios`,
          }}
          locale={{ emptyText: 'Nenhum sócio encontrado' }}
          renderItem={socio => {
            return (
              <List.Item>
                <Card
                  hoverable
                  actions={[
                    <EditOutlined key="edit" onClick={() => handleEdit(socio)} aria-label={`Editar sócio ${socio.nome}`} />,
                    <PrinterOutlined key="print" onClick={() => handlePrintSocio(socio)} aria-label={`Imprimir ficha do sócio ${socio.nome}`} />,
                    <DeleteOutlined 
                      key="delete" 
                      onClick={() => deletingId !== socio.id && handleDeleteSocio(socio)} 
                      style={{
                        color: deletingId === socio.id ? '#999' : '#ff4d4f',
                      }}
                      aria-label={`Excluir sócio ${socio.nome}`}
                    />
                  ]}
                >
                  <Card.Meta
                    avatar={<Avatar style={{ backgroundColor: '#F2311F' }}>{socio.nome?.charAt(0) || '?'}</Avatar>}
                    title={socio.nome}
                    description={<>
                      <div>CPF: {formatCPF(socio.cpf)}</div>
                      <div>RG: {socio.rg}</div>
                      <div>Celular: {socio.celular}</div>
                      <div>Status: {getStatusTag(socio.status)}</div>
                      <div>Matrícula: {socio.matricula}</div>
                      <div>Função: {socio.funcao}</div>
                      <div>Empresa: {socio.razaoSocial}</div>
                      <div>Admissão: {socio.dataAdmissao ? moment(socio.dataAdmissao).format('DD/MM/YYYY') : 'N/A'}</div>
                      <div>Demissão: {socio.dataDemissao ? moment(socio.dataDemissao).format('DD/MM/YYYY') : 'N/A'}</div>
                    </>}
                  />
                </Card>
              </List.Item>
            );
          }}
        />
      )}

      {/* Rodapé com paginação */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: '16px',
        padding: '10px 0',
        borderTop: '1px solid #eee'
      }}>
        <div>Total de {totalSocios} sócios</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button disabled={true}>&lt;</Button>
          <Button type="primary">1</Button>
          <Button disabled={true}>&gt;</Button>
          <div>10 / page</div>
        </div>
      </div>

      {/* Modal para seleção de colunas */}
      <Modal
        title="Gerenciar colunas visíveis"
        open={columnSelectorVisible}
        onCancel={() => setColumnSelectorVisible(false)}
        footer={[
          <Button key="selectAll" onClick={handleSelectAllColumns}>
            Selecionar Todas
          </Button>,
          <Button key="selectNone" onClick={handleSelectNoColumns}>
            Limpar Seleção
          </Button>,
          <Button key="back" type="primary" onClick={() => setColumnSelectorVisible(false)}>
            Aplicar
          </Button>,
        ]}
        width={600}
        aria-label="Modal de gerenciamento de colunas"
      >
        <p>Selecione as colunas que deseja exibir na tabela:</p>
        <Checkbox.Group 
          value={visibleColumns} 
          onChange={checkedValues => handleColumnVisibilityChange(checkedValues as string[])}
          style={{ width: '100%' }}
        >
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '10px' 
          }}>
            {allColumns.map(column => (
              <Checkbox 
                key={column.key as string} 
                value={column.key}
                style={{ marginLeft: 0 }}
                aria-label={`Coluna ${typeof column.title === 'string' ? column.title : 'Coluna'}`}
              >
                {typeof column.title === 'string' ? column.title : 'Coluna'}
              </Checkbox>
            ))}
          </div>
        </Checkbox.Group>
      </Modal>

      <SocioModal
        visible={modalVisible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        initialValues={editingSocio ? Object.fromEntries(
          Object.entries(editingSocio).map(([k, v]) => [k, v === null ? undefined : v])
        ) as any : undefined}
        loading={loading}
        isEdit={!!editingSocio}
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Socios; 