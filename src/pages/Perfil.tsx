import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PerfilModal from '../components/PerfilModal';

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

  const handleDelete = async (perfil: PerfilType) => {
    try {
      await axios.delete(`http://localhost:5000/api/perfis/${perfil.IdPerfil}`);
      toast.success(`Perfil "${perfil.Perfil}" excluído com sucesso!`);
      fetchPerfis();
      setConfirmModalVisible(false);
      setPerfilToDelete(null);
    } catch (error) {
      toast.error(`Não foi possível excluir o perfil. Verifique se não há registros vinculados.`);
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
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>Perfis</h2>
      <Button type="primary" onClick={handleNovo} style={{ marginBottom: 16 }}>Novo Perfil</Button>
      <Table rowKey="IdPerfil" columns={columns} dataSource={perfis} loading={loading} />
      
      <PerfilModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleModalOk}
        initialValues={editingPerfil || undefined}
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
              DESEJA EXCLUIR O PERFIL "{perfilToDelete?.Perfil}"?
            </h3>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '30px',
            padding: '20px 40px 60px'
          }}>
            <Button
              onClick={() => perfilToDelete && handleDelete(perfilToDelete)}
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

export default Perfil; 