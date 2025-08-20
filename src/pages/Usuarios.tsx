import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Space, Modal, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UsuarioModal from '../components/UsuarioModal';
import CustomLoader from '../components/CustomLoader';
import ConfirmModal from '../components/ConfirmModal';

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
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!usuarioToDelete) return;
    
    setDeleting(true);
    try {
      await axios.delete(`http://localhost:5000/api/usuarios/${usuarioToDelete.IdUsuarios}`);
      toast.success(`Usuário "${usuarioToDelete.Nome}" excluído com sucesso!`);
      fetchUsuarios();
      setConfirmModalVisible(false);
      setUsuarioToDelete(null);
    } catch (error) {
      toast.error('Erro ao excluir usuário. Verifique se não há registros vinculados.');
    } finally {
      setDeleting(false);
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
            aria-label={`Editar usuário ${record.Nome}`}
          />
          <Button 
            icon={<DeleteOutlined />} 
            type="primary" 
            danger 
            size="small"
            onClick={() => confirmDelete(record)}
            aria-label={`Excluir usuário ${record.Nome}`}
          />
        </Space>
      ),
    },
  ];

  // Loading state personalizado para tabela
  const tableLoading = {
    spinning: loading,
    indicator: <CustomLoader message="Carregando usuários..." size="default" />
  };

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
            aria-label="Cadastrar novo usuário"
          >
            Novo Usuário
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={usuarios}
          rowKey="IdUsuarios"
          loading={tableLoading}
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

      <ConfirmModal
        visible={confirmModalVisible}
        title="Confirmar exclusão"
        content={`Deseja excluir o usuário "${usuarioToDelete?.Nome}"?`}
        okText="Sim, confirmar exclusão"
        cancelText="Não"
        onOk={handleDelete}
        onCancel={() => {
          setConfirmModalVisible(false);
          setUsuarioToDelete(null);
        }}
        loading={deleting}
      />
    </div>
  );
};

export default Usuarios; 