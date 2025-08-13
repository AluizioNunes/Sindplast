import React, { useEffect, useState } from 'react';
import { Modal, Tabs, Tree, Select, Card, Input, Form, Switch, Spin, Row, Col, Button } from 'antd';
import { CheckCircleFilled, CloseCircleFilled, SaveOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { TabPane } = Tabs;
const { Option } = Select;

// Interfaces
interface PerfilType {
  IdPerfil: number;
  Perfil: string;
  Descricao?: string;
}

interface Usuario {
  IdUsuarios: number;
  Nome: string;
  Usuario: string;
  Perfil: string;
}

// Estrutura de permissões agrupadas por módulo
interface PermissaoNode {
  title: string;
  key: string;
  children?: PermissaoNode[];
  isLeaf?: boolean;
}

const Permissoes: React.FC = () => {
  // Estados
  const [activeTab, setActiveTab] = useState('perfil');
  const [perfis, setPerfis] = useState<PerfilType[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [permissoes, setPermissoes] = useState<PermissaoNode[]>([]);
  const [perfilSelecionado, setPerfilSelecionado] = useState<number | null>(null);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<number | null>(null);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [loadingPerfis, setLoadingPerfis] = useState(false);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [loadingPermissoes, setLoadingPermissoes] = useState(false);
  const [sobreescreverPermissoes, setSobreescreverPermissoes] = useState(false);
  const [pesquisa, setPesquisa] = useState('');

  // Carregar todos os perfis
  const fetchPerfis = async () => {
    setLoadingPerfis(true);
    try {
      const response = await axios.get<PerfilType[]>('http://localhost:5000/api/perfis');
      setPerfis(response.data);
    } catch (error) {
      toast.error('Erro ao carregar perfis');
    } finally {
      setLoadingPerfis(false);
    }
  };

  // Carregar todos os usuários
  const fetchUsuarios = async () => {
    setLoadingUsuarios(true);
    try {
      const response = await axios.get<Usuario[]>('http://localhost:5000/api/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoadingUsuarios(false);
    }
  };

  // Inicializar dados - usamos um mock por enquanto, mas depois isso virá da API
  useEffect(() => {
    fetchPerfis();
    fetchUsuarios();
    
    // Mock de permissões para demonstração
    // Em produção, isso virá da API
    const mockPermissoes: PermissaoNode[] = [
      {
        title: 'Dashboard',
        key: 'dashboard',
        children: [
          { title: 'Visualizar', key: 'dashboard.view', isLeaf: true },
        ]
      },
      {
        title: 'Cadastros',
        key: 'cadastros',
        children: [
          { 
            title: 'Empresas', 
            key: 'empresas',
            children: [
              { title: 'Visualizar', key: 'empresas.view', isLeaf: true },
              { title: 'Adicionar', key: 'empresas.add', isLeaf: true },
              { title: 'Editar', key: 'empresas.edit', isLeaf: true },
              { title: 'Excluir', key: 'empresas.delete', isLeaf: true },
            ]
          },
          { 
            title: 'Funcionários', 
            key: 'funcionarios',
            children: [
              { title: 'Visualizar', key: 'funcionarios.view', isLeaf: true },
              { title: 'Adicionar', key: 'funcionarios.add', isLeaf: true },
              { title: 'Editar', key: 'funcionarios.edit', isLeaf: true },
              { title: 'Excluir', key: 'funcionarios.delete', isLeaf: true },
            ]
          },
          { 
            title: 'Sócios', 
            key: 'socios',
            children: [
              { title: 'Visualizar', key: 'socios.view', isLeaf: true },
              { title: 'Adicionar', key: 'socios.add', isLeaf: true },
              { title: 'Editar', key: 'socios.edit', isLeaf: true },
              { title: 'Excluir', key: 'socios.delete', isLeaf: true },
            ]
          },
          { 
            title: 'Dependentes', 
            key: 'dependentes',
            children: [
              { title: 'Visualizar', key: 'dependentes.view', isLeaf: true },
              { title: 'Adicionar', key: 'dependentes.add', isLeaf: true },
              { title: 'Editar', key: 'dependentes.edit', isLeaf: true },
              { title: 'Excluir', key: 'dependentes.delete', isLeaf: true },
            ]
          },
        ]
      },
      {
        title: 'Financeiro',
        key: 'financeiro',
        children: [
          { 
            title: 'Contas a Pagar', 
            key: 'contas-pagar',
            children: [
              { title: 'Visualizar', key: 'contas-pagar.view', isLeaf: true },
              { title: 'Adicionar', key: 'contas-pagar.add', isLeaf: true },
              { title: 'Editar', key: 'contas-pagar.edit', isLeaf: true },
              { title: 'Excluir', key: 'contas-pagar.delete', isLeaf: true },
            ]
          },
          { 
            title: 'Contas a Receber', 
            key: 'contas-receber',
            children: [
              { title: 'Visualizar', key: 'contas-receber.view', isLeaf: true },
              { title: 'Adicionar', key: 'contas-receber.add', isLeaf: true },
              { title: 'Editar', key: 'contas-receber.edit', isLeaf: true },
              { title: 'Excluir', key: 'contas-receber.delete', isLeaf: true },
            ]
          },
          { 
            title: 'Receitas', 
            key: 'receitas',
            children: [
              { title: 'Visualizar', key: 'receitas.view', isLeaf: true },
              { title: 'Adicionar', key: 'receitas.add', isLeaf: true },
              { title: 'Editar', key: 'receitas.edit', isLeaf: true },
              { title: 'Excluir', key: 'receitas.delete', isLeaf: true },
            ]
          },
          { 
            title: 'Despesas', 
            key: 'despesas',
            children: [
              { title: 'Visualizar', key: 'despesas.view', isLeaf: true },
              { title: 'Adicionar', key: 'despesas.add', isLeaf: true },
              { title: 'Editar', key: 'despesas.edit', isLeaf: true },
              { title: 'Excluir', key: 'despesas.delete', isLeaf: true },
            ]
          },
          { 
            title: 'Mensalidades', 
            key: 'mensalidades',
            children: [
              { title: 'Visualizar', key: 'mensalidades.view', isLeaf: true },
              { title: 'Adicionar', key: 'mensalidades.add', isLeaf: true },
              { title: 'Editar', key: 'mensalidades.edit', isLeaf: true },
              { title: 'Excluir', key: 'mensalidades.delete', isLeaf: true },
            ]
          },
        ]
      },
      {
        title: 'Sistema',
        key: 'sistema',
        children: [
          { 
            title: 'Usuários', 
            key: 'usuarios',
            children: [
              { title: 'Visualizar', key: 'usuarios.view', isLeaf: true },
              { title: 'Adicionar', key: 'usuarios.add', isLeaf: true },
              { title: 'Editar', key: 'usuarios.edit', isLeaf: true },
              { title: 'Excluir', key: 'usuarios.delete', isLeaf: true },
            ]
          },
          { 
            title: 'Permissões', 
            key: 'permissoes',
            children: [
              { title: 'Visualizar', key: 'permissoes.view', isLeaf: true },
              { title: 'Gerenciar', key: 'permissoes.manage', isLeaf: true },
            ]
          },
          { 
            title: 'Perfil', 
            key: 'perfil',
            children: [
              { title: 'Visualizar', key: 'perfil.view', isLeaf: true },
              { title: 'Adicionar', key: 'perfil.add', isLeaf: true },
              { title: 'Editar', key: 'perfil.edit', isLeaf: true },
              { title: 'Excluir', key: 'perfil.delete', isLeaf: true },
            ]
          },
        ]
      },
      {
        title: 'Relatórios',
        key: 'relatorios',
        children: [
          { title: 'Visualizar', key: 'relatorios.view', isLeaf: true },
          { title: 'Exportar', key: 'relatorios.export', isLeaf: true },
        ]
      },
    ];
    
    setPermissoes(mockPermissoes);
  }, []);

  // Simula o carregamento de permissões para um perfil ou usuário
  const carregarPermissoes = async (tipo: 'perfil' | 'usuario', id: number) => {
    setLoadingPermissoes(true);
    setCheckedKeys([]);
    
    // Simula um delay de carregamento - em produção, isso seria uma chamada à API
    setTimeout(() => {
      // Mock de permissões - deve ser substituído pela chamada real à API
      // Por exemplo, poderíamos carregar com:
      // const response = await axios.get(`http://localhost:5000/api/${tipo === 'perfil' ? 'perfis' : 'usuarios'}/${id}/permissoes`);
      // setCheckedKeys(response.data);
      
      // Para demonstração, vamos simular permissões diferentes para perfis e usuários
      if (tipo === 'perfil') {
        if (id === 1) { // Admin
          setCheckedKeys([
            'dashboard.view', 
            'empresas.view', 'empresas.add', 'empresas.edit', 'empresas.delete',
            'usuarios.view', 'usuarios.add', 'usuarios.edit', 'usuarios.delete',
            'permissoes.view', 'permissoes.manage',
            'perfil.view', 'perfil.add', 'perfil.edit', 'perfil.delete',
            'relatorios.view', 'relatorios.export'
          ]);
        } else if (id === 2) { // Gerente
          setCheckedKeys([
            'dashboard.view', 
            'empresas.view', 'empresas.add', 'empresas.edit',
            'funcionarios.view', 'funcionarios.add', 'funcionarios.edit',
            'usuarios.view',
            'relatorios.view', 'relatorios.export'
          ]);
        } else {
          // Para outros perfis, sem permissões iniciais
          setCheckedKeys([]);
        }
      } else { // Usuário
        if (id === 1) { // Um usuário específico
          setCheckedKeys([
            'dashboard.view',
            'empresas.view',
            'funcionarios.view',
            'socios.view',
            'relatorios.view'
          ]);
        } else {
          // Para outros usuários, sem permissões específicas
          setCheckedKeys([]);
        }
      }
      
      setLoadingPermissoes(false);
    }, 800);
  };

  // Quando a seleção de perfil muda
  const handlePerfilChange = (value: number) => {
    setPerfilSelecionado(value);
    carregarPermissoes('perfil', value);
  };

  // Quando a seleção de usuário muda
  const handleUsuarioChange = (value: number) => {
    setUsuarioSelecionado(value);
    carregarPermissoes('usuario', value);
  };

  // Quando as permissões marcadas mudam
  const onCheckChange = (checkedKeysValue: React.Key[]) => {
    setCheckedKeys(checkedKeysValue);
  };

  // Salvar as permissões configuradas
  const salvarPermissoes = () => {
    setConfirmModalVisible(true);
  };

  // Confirmar salvamento de permissões
  const confirmarSalvarPermissoes = async () => {
    setLoadingPermissoes(true);
    
    try {
      // Simulação do salvamento - substituir pelo endpoint real da API
      // await axios.post(`http://localhost:5000/api/${activeTab === 'perfil' ? 'perfis' : 'usuarios'}/${activeTab === 'perfil' ? perfilSelecionado : usuarioSelecionado}/permissoes`, {
      //   permissoes: checkedKeys,
      //   sobreescrever: sobreescreverPermissoes
      // });
      
      // Simulação bem-sucedida
      setTimeout(() => {
        setLoadingPermissoes(false);
        setConfirmModalVisible(false);
        
        // Notificar o usuário do sucesso
        toast.success(`Permissões ${activeTab === 'perfil' ? 'do perfil' : 'do usuário'} atualizadas com sucesso!`);
      }, 800);
    } catch (error) {
      setLoadingPermissoes(false);
      setConfirmModalVisible(false);
      toast.error(`Erro ao salvar permissões. Tente novamente.`);
    }
  };

  // Filtrar permissões baseado na pesquisa
  const filtrarPermissoes = (nodes: PermissaoNode[], termo: string): PermissaoNode[] => {
    if (!termo) return nodes;
    
    return nodes.map(node => {
      const matched = node.title.toLowerCase().includes(termo.toLowerCase());
      
      if (node.children) {
        const filteredChildren = filtrarPermissoes(node.children, termo);
        if (filteredChildren.length > 0) {
          return { ...node, children: filteredChildren };
        }
      }
      
      return matched ? { ...node, children: node.children } : null;
    }).filter(Boolean) as PermissaoNode[];
  };

  // Permissões filtradas com base no termo de pesquisa
  const permissoesFiltradas = filtrarPermissoes(permissoes, pesquisa);

  return (
    <div style={{ padding: '10px' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <h2 style={{ marginBottom: '20px' }}>GERENCIAMENTO DE PERMISSÕES</h2>
      
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane 
            tab={<span><TeamOutlined /> Permissões por Perfil</span>} 
            key="perfil"
          >
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={12}>
                <Form.Item label="Selecione o Perfil">
                  <Select
                    placeholder="Selecione um perfil"
                    style={{ width: '100%' }}
                    onChange={handlePerfilChange}
                    loading={loadingPerfis}
                    disabled={loadingPerfis}
                  >
                    {perfis.map(perfil => (
                      <Option key={perfil.IdPerfil} value={perfil.IdPerfil}>
                        {perfil.Perfil}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Pesquisar Permissão">
                  <Input 
                    placeholder="Digite para filtrar permissões" 
                    value={pesquisa}
                    onChange={e => setPesquisa(e.target.value)}
                    allowClear
                  />
                </Form.Item>
              </Col>
            </Row>
            
            {perfilSelecionado && (
              <Button 
                type="primary" 
                onClick={salvarPermissoes} 
                style={{ marginBottom: '16px' }}
                disabled={loadingPermissoes}
              >
                <SaveOutlined /> Salvar Permissões
              </Button>
            )}
            
            {loadingPermissoes ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Spin size="large" />
                <p style={{ marginTop: '16px' }}>Carregando permissões...</p>
              </div>
            ) : (
              perfilSelecionado ? (
                <Tree
                  checkable
                  checkStrictly
                  checkedKeys={checkedKeys}
                  onCheck={(checked) => onCheckChange(checked as React.Key[])}
                  treeData={permissoesFiltradas}
                  defaultExpandAll
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p>Selecione um perfil para gerenciar suas permissões</p>
                </div>
              )
            )}
          </TabPane>
          
          <TabPane 
            tab={<span><UserOutlined /> Permissões por Usuário</span>} 
            key="usuario"
          >
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={12}>
                <Form.Item label="Selecione o Usuário">
                  <Select
                    placeholder="Selecione um usuário"
                    style={{ width: '100%' }}
                    onChange={handleUsuarioChange}
                    loading={loadingUsuarios}
                    disabled={loadingUsuarios}
                    showSearch
                    optionFilterProp="children"
                  >
                    {usuarios.map(usuario => (
                      <Option key={usuario.IdUsuarios} value={usuario.IdUsuarios}>
                        {usuario.Nome} ({usuario.Usuario}) - Perfil: {usuario.Perfil}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Pesquisar Permissão">
                  <Input 
                    placeholder="Digite para filtrar permissões" 
                    value={pesquisa}
                    onChange={e => setPesquisa(e.target.value)}
                    allowClear
                  />
                </Form.Item>
              </Col>
            </Row>
            
            {usuarioSelecionado && (
              <>
                <Form.Item>
                  <Switch 
                    checked={sobreescreverPermissoes} 
                    onChange={setSobreescreverPermissoes}
                    style={{ marginRight: '8px' }}
                  />
                  <span>Sobreescrever permissões do perfil (por padrão as permissões são herdadas do perfil)</span>
                </Form.Item>
                
                <Button 
                  type="primary" 
                  onClick={salvarPermissoes} 
                  style={{ marginBottom: '16px' }}
                  disabled={loadingPermissoes}
                >
                  <SaveOutlined /> Salvar Permissões
                </Button>
              </>
            )}
            
            {loadingPermissoes ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Spin size="large" />
                <p style={{ marginTop: '16px' }}>Carregando permissões...</p>
              </div>
            ) : (
              usuarioSelecionado ? (
                <Tree
                  checkable
                  checkStrictly
                  checkedKeys={checkedKeys}
                  onCheck={(checked) => onCheckChange(checked as React.Key[])}
                  treeData={permissoesFiltradas}
                  defaultExpandAll
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p>Selecione um usuário para gerenciar suas permissões</p>
                </div>
              )
            )}
          </TabPane>
        </Tabs>
      </Card>
      
      {/* Modal de confirmação */}
      <Modal
        title={null}
        open={confirmModalVisible}
        onCancel={() => setConfirmModalVisible(false)}
        footer={null}
        closable={false}
        centered
        width={650}
        style={{ borderRadius: 0, padding: 0 }}
        bodyStyle={{ padding: 0, backgroundColor: '#f5f7e9', border: 'none' }}
        modalRender={(node) => node}
        wrapClassName="delete-modal-wrapper"
      >
        <div style={{ padding: 0 }}>
          <div style={{ 
            backgroundColor: '#F2311F', 
            color: 'white', 
            padding: '10px 20px',
            textAlign: 'left',
            height: '60px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ fontSize: '22px', fontWeight: 'bold', lineHeight: '1.2' }}>SINDPLÁST-AM</div>
            <div style={{ fontSize: '11px', lineHeight: '1.2' }}>
              SINDICATO DOS TRABALHADORES NAS INDÚSTRIAS DE MATERIAL PLÁSTICO DE MANAUS E DO ESTADO DO AMAZONAS
            </div>
          </div>
          
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <h3 style={{ color: '#F2311F', fontSize: '22px', fontWeight: 'bold' }}>
              CONFIRMAR ALTERAÇÕES NAS PERMISSÕES?
            </h3>
            <p style={{ marginTop: '16px' }}>
              Todas as permissões selecionadas serão aplicadas 
              {activeTab === 'perfil' 
                ? ' para o perfil selecionado' 
                : ` para o usuário selecionado${sobreescreverPermissoes ? ' (sobreescrevendo as permissões do perfil)' : ''}`
              }.
            </p>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '30px',
            padding: '20px 40px 60px'
          }}>
            <Button
              onClick={confirmarSalvarPermissoes}
              loading={loadingPermissoes}
              style={{ 
                width: '180px', 
                height: '50px',
                fontSize: '18px',
                fontWeight: 'bold',
                backgroundColor: '#4caf50',
                borderColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CheckCircleFilled style={{ marginRight: '8px' }} /> SIM
            </Button>
            
            <Button
              onClick={() => setConfirmModalVisible(false)}
              style={{ 
                width: '180px',
                height: '50px',
                fontSize: '18px',
                fontWeight: 'bold',
                backgroundColor: '#f44336',
                borderColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CloseCircleFilled style={{ marginRight: '8px' }} /> NAO
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Permissoes; 