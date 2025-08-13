import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Space, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UsuarioModal from '../components/UsuarioModal';

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

interface PerfilType {
  IdPerfil: number;
  Perfil: string;
}

const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [perfis, setPerfis] = useState<PerfilType[]>([]);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState<Usuario | null>(null);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Usuario[]>('http://localhost:5000/api/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  useEffect(() => {
    const fetchPerfis = async () => {
      try {
        const response = await axios.get<PerfilType[]>('http://localhost:5000/api/perfis');
        setPerfis(response.data);
      } catch (error) {
        toast.error('Erro ao carregar perfis');
      }
    };
    
    fetchPerfis();
  }, []);

  const confirmDelete = (usuario: Usuario) => {
    setUsuarioToDelete(usuario);
    setConfirmModalVisible(true);
  };

  const handleDelete = async (usuario: Usuario) => {
    try {
      await axios.delete(`http://localhost:5000/api/usuarios/${usuario.IdUsuarios}`);
      toast.success(`Usuário "${usuario.Nome}" excluído com sucesso!`);
      fetchUsuarios();
      setConfirmModalVisible(false);
      setUsuarioToDelete(null);
    } catch (error) {
      toast.error('Erro ao excluir usuário. Verifique se não há registros vinculados.');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'IdUsuarios', key: 'IdUsuarios' },
    { title: 'PERFIL', dataIndex: 'Perfil', key: 'Perfil' },
    { title: 'CPF', dataIndex: 'CPF', key: 'CPF' },
    { title: 'FUNÇÃO', dataIndex: 'Funcao', key: 'Funcao' },
    { title: 'EMAIL', dataIndex: 'Email', key: 'Email' },
    { title: 'USUÁRIO', dataIndex: 'Usuario', key: 'Usuario' },
    { title: 'CADASTRANTE', dataIndex: 'Cadastrante', key: 'Cadastrante' },
    { 
      title: 'DATA DE CADASTRO', 
      dataIndex: 'DataCadastro', 
      key: 'DataCadastro',
      render: (data: string) => data ? new Date(data).toLocaleString('pt-BR') : ''
    },
    {
      title: 'AÇÕES',
      key: 'acoes',
      render: (_: any, record: Usuario) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            type="primary" 
            size="small" 
            onClick={() => {
              setEditingUsuario(record);
              setModalVisible(true);
            }}
          />
          <Button 
            icon={<DeleteOutlined />} 
            type="primary" 
            danger 
            size="small"
            onClick={() => confirmDelete(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Card 
        title="Lista de Usuários" 
        style={{ marginTop: 16 }}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingUsuario(null);
              setModalVisible(true);
            }}
          >
            Novo Usuário
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={usuarios}
          rowKey="IdUsuarios"
          loading={loading}
        />
      </Card>

      <UsuarioModal
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingUsuario(null);
        }}
        onSubmit={async (values) => {
          try {
            if (editingUsuario) {
              await axios.put(`http://localhost:5000/api/usuarios/${editingUsuario.IdUsuarios}`, values);
              toast.success(`Usuário "${values.Nome}" atualizado com sucesso!`);
            } else {
              await axios.post('http://localhost:5000/api/usuarios', values);
              toast.success(`Usuário "${values.Nome}" criado com sucesso!`);
            }
            setModalVisible(false);
            setEditingUsuario(null);
            fetchUsuarios();
          } catch (error: any) {
            if (error.response?.data?.message) {
              toast.error(error.response.data.message);
            } else {
              toast.error('Erro ao salvar usuário');
            }
          }
        }}
        initialValues={editingUsuario || undefined}
        loading={loading}
        isEdit={!!editingUsuario}
        perfis={perfis}
      />

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
            <div style={{ fontSize: '22px', fontWeight: 'bold', lineHeight: '1.2' }}>SINDPLAST-AM</div>
            <div style={{ fontSize: '11px', lineHeight: '1.2' }}>
              SINDICATO DOS TRABALHADORES NAS INDÚSTRIAS DE MATERIAL PLÁSTICO DE MANAUS E DO ESTADO DO AMAZONAS
            </div>
          </div>
          
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <h3 style={{ color: '#F2311F', fontSize: '22px', fontWeight: 'bold' }}>
              DESEJA EXCLUIR O USUÁRIO "{usuarioToDelete?.Nome}"?
            </h3>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '30px',
            padding: '20px 40px 60px'
          }}>
            <Button
              onClick={() => handleDelete(usuarioToDelete!)}
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

export default Usuarios; 