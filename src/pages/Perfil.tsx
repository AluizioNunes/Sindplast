import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Spin } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PerfilModal from '../components/PerfilModal';
import CustomLoader from '../components/CustomLoader';
import ConfirmModal from '../components/ConfirmModal';

export interface PerfilType {
  IdPerfil: number;
  Perfil: string;
  Descricao?: string;
  Cadastrante: string;
  DataCadastro?: string;
}

const Perfil: React.FC = () => {
  const [perfis, setPerfis] = useState<PerfilType[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPerfil, setEditingPerfil] = useState<PerfilType | null>(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [perfilToDelete, setPerfilToDelete] = useState<PerfilType | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPerfis = async () => {
    setLoading(true);
    try {
      const response = await axios.get<PerfilType[]>('http://localhost:5000/api/perfis');
      setPerfis(response.data);
    } catch (error) {
      toast.error('Erro ao carregar perfis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerfis();
  }, []);

  const handleNovo = () => {
    setEditingPerfil(null);
    setModalVisible(true);
  };

  const handleEdit = (perfil: PerfilType) => {
    setEditingPerfil(perfil);
    setModalVisible(true);
  };

  const handleDelete = async () => {
    if (!perfilToDelete) return;
    
    setDeleting(true);
    try {
      await axios.delete(`http://localhost:5000/api/perfis/${perfilToDelete.IdPerfil}`);
      toast.success(`Perfil "${perfilToDelete.Perfil}" excluído com sucesso!`);
      fetchPerfis();
      setConfirmModalVisible(false);
      setPerfilToDelete(null);
    } catch (error) {
      toast.error(`Não foi possível excluir o perfil. Verifique se não há registros vinculados.`);
    } finally {
      setDeleting(false);
    }
  };

  const confirmDelete = (perfil: PerfilType) => {
    setPerfilToDelete(perfil);
    setConfirmModalVisible(true);
  };

  const handleModalOk = async (values: any) => {
    try {
      if (editingPerfil) {
        await axios.put(`http://localhost:5000/api/perfis/${editingPerfil.IdPerfil}`, values);
        toast.success(`Perfil "${values.Perfil}" atualizado com sucesso!`);
      } else {
        await axios.post('http://localhost:5000/api/perfis', values);
        toast.success(`Perfil "${values.Perfil}" criado com sucesso!`);
      }
      setModalVisible(false);
      fetchPerfis();
    } catch {
      toast.error('Erro ao salvar perfil');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'IdPerfil', key: 'IdPerfil' },
    { title: 'PERFIL', dataIndex: 'Perfil', key: 'Perfil' },
    { title: 'DESCRIÇÃO', dataIndex: 'Descricao', key: 'Descricao' },
    { title: 'CADASTRANTE', dataIndex: 'Cadastrante', key: 'Cadastrante' },
    { title: 'DATA CADASTRO', dataIndex: 'DataCadastro', key: 'DataCadastro', render: (text: string) => text ? new Date(text).toLocaleString() : '' },
    {
      title: 'AÇÕES',
      key: 'acoes',
      render: (_: any, record: PerfilType) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            type="primary" 
            size="small" 
            onClick={() => handleEdit(record)} 
            aria-label={`Editar perfil ${record.Perfil}`}
          />
          <Button 
            icon={<DeleteOutlined />} 
            type="primary" 
            danger 
            size="small"
            onClick={() => confirmDelete(record)}
            aria-label={`Excluir perfil ${record.Perfil}`}
          />
        </Space>
      ),
    },
  ];

  // Loading state personalizado para tabela
  const tableLoading = {
    spinning: loading,
    indicator: <CustomLoader message="Carregando perfis..." size="default" />
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>Perfis</h2>
      <Button 
        type="primary" 
        onClick={handleNovo} 
        style={{ marginBottom: 16 }}
        aria-label="Cadastrar novo perfil"
      >
        Novo Perfil
      </Button>
      <Table 
        rowKey="IdPerfil" 
        columns={columns} 
        dataSource={perfis} 
        loading={tableLoading} 
      />
      
      <PerfilModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleModalOk}
        initialValues={editingPerfil || undefined}
      />

      <ConfirmModal
        visible={confirmModalVisible}
        title="Confirmar exclusão"
        content={`Deseja excluir o perfil "${perfilToDelete?.Perfil}"?`}
        okText="Sim, confirmar exclusão"
        cancelText="Não"
        onOk={handleDelete}
        onCancel={() => {
          setConfirmModalVisible(false);
          setPerfilToDelete(null);
        }}
        loading={deleting}
      />
    </div>
  );
};

export default Perfil; 