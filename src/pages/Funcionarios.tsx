import React, { useState, useEffect } from 'react';
import { Typography, Card, Table, Button, Space, message, Input, Modal, Form, Select, DatePicker } from 'antd';
import type { Key } from 'antd/es/table/interface';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { animations } from '../utils/animations';
import axios from 'axios';

const { Title, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

interface Funcionario {
  id: number;
  nome: string;
  cpf: string;
  cargo: string;
  empresa: string;
  dataAdmissao: string;
  salario: number;
  status: string;
}

const Funcionarios: React.FC = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFuncionario, setEditingFuncionario] = useState<Funcionario | null>(null);
  const [form] = Form.useForm();

  // Dados mockados para demonstração
  const mockFuncionarios: Funcionario[] = [
    {
      id: 1,
      nome: 'João Silva',
      cpf: '123.456.789-00',
      cargo: 'Operador',
      empresa: 'Empresa A',
      dataAdmissao: '2023-01-15',
      salario: 2500.00,
      status: 'Ativo'
    },
    {
      id: 2,
      nome: 'Maria Santos',
      cpf: '987.654.321-00',
      cargo: 'Supervisor',
      empresa: 'Empresa B',
      dataAdmissao: '2022-08-20',
      salario: 3500.00,
      status: 'Ativo'
    },
    {
      id: 3,
      nome: 'Pedro Costa',
      cpf: '456.789.123-00',
      cargo: 'Auxiliar',
      empresa: 'Empresa A',
      dataAdmissao: '2023-03-10',
      salario: 2000.00,
      status: 'Inativo'
    }
  ];

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  const fetchFuncionarios = async () => {
    setLoading(true);
    try {
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 500));
      setFuncionarios(mockFuncionarios);
    } catch (error) {
      message.error('Erro ao carregar funcionários');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingFuncionario(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Funcionario) => {
    setEditingFuncionario(record);
    form.setFieldsValue({
      nome: record.nome,
      cpf: record.cpf,
      cargo: record.cargo,
      empresa: record.empresa,
      dataAdmissao: record.dataAdmissao,
      salario: record.salario,
      status: record.status
    });
    setModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Confirmar exclusão',
      content: 'Tem certeza que deseja excluir este funcionário?',
      onOk: () => {
        setFuncionarios(funcionarios.filter(f => f.id !== id));
        message.success('Funcionário excluído com sucesso');
      }
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingFuncionario) {
        // Editar funcionário existente
        const updated = funcionarios.map(f => 
          f.id === editingFuncionario.id 
            ? { ...f, ...values }
            : f
        );
        setFuncionarios(updated);
        message.success('Funcionário atualizado com sucesso');
      } else {
        // Adicionar novo funcionário
        const newFuncionario: Funcionario = {
          id: Math.max(...funcionarios.map(f => f.id)) + 1,
          ...values
        };
        setFuncionarios([...funcionarios, newFuncionario]);
        message.success('Funcionário adicionado com sucesso');
      }
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Erro ao salvar funcionário');
    }
  };

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
      sorter: (a: Funcionario, b: Funcionario) => a.nome.localeCompare(b.nome),
    },
    {
      title: 'CPF',
      dataIndex: 'cpf',
      key: 'cpf',
    },
    {
      title: 'Cargo',
      dataIndex: 'cargo',
      key: 'cargo',
      filters: [
        { text: 'Operador', value: 'Operador' },
        { text: 'Supervisor', value: 'Supervisor' },
        { text: 'Auxiliar', value: 'Auxiliar' },
      ],
      onFilter: (value: boolean | Key, record: Funcionario) => record.cargo === value,
    },
    {
      title: 'Empresa',
      dataIndex: 'empresa',
      key: 'empresa',
    },
    {
      title: 'Data Admissão',
      dataIndex: 'dataAdmissao',
      key: 'dataAdmissao',
      render: (date: string) => new Date(date).toLocaleDateString('pt-BR'),
    },
    {
      title: 'Salário',
      dataIndex: 'salario',
      key: 'salario',
      render: (salario: number) => `R$ ${salario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      sorter: (a: Funcionario, b: Funcionario) => a.salario - b.salario,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span style={{ 
          color: status === 'Ativo' ? '#52c41a' : '#ff4d4f',
          fontWeight: 'bold'
        }}>
          {status}
        </span>
      ),
      filters: [
        { text: 'Ativo', value: 'Ativo' },
        { text: 'Inativo', value: 'Inativo' },
      ],
      onFilter: (value: boolean | Key, record: Funcionario) => record.status === value,
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: Funcionario) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Editar
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Excluir
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={animations.container}
    >
      <motion.div variants={animations.fadeIn}>
        <Title level={2}>FUNCIONÁRIOS</Title>
        <Paragraph>
          Gerencie os funcionários das empresas associadas ao SINDPLAST-AM
        </Paragraph>
      </motion.div>

      <motion.div variants={animations.card}>
        <Card>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Search
              placeholder="Buscar funcionários..."
              style={{ width: 300 }}
              allowClear
            />
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              NOVO FUNCIONÁRIO
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={funcionarios}
            rowKey="id"
            loading={loading}
            pagination={{
              total: funcionarios.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} funcionários`,
            }}
          />
        </Card>
      </motion.div>

      <Modal
        title={editingFuncionario ? 'Editar Funcionário' : 'Novo Funcionário'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="nome"
            label="Nome Completo"
            rules={[{ required: true, message: 'Por favor, insira o nome' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="cpf"
            label="CPF"
            rules={[{ required: true, message: 'Por favor, insira o CPF' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="cargo"
            label="Cargo"
            rules={[{ required: true, message: 'Por favor, selecione o cargo' }]}
          >
            <Select placeholder="Selecione o cargo">
              <Option value="Operador">Operador</Option>
              <Option value="Supervisor">Supervisor</Option>
              <Option value="Auxiliar">Auxiliar</Option>
              <Option value="Gerente">Gerente</Option>
              <Option value="Diretor">Diretor</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="empresa"
            label="Empresa"
            rules={[{ required: true, message: 'Por favor, selecione a empresa' }]}
          >
            <Select placeholder="Selecione a empresa">
              <Option value="Empresa A">Empresa A</Option>
              <Option value="Empresa B">Empresa B</Option>
              <Option value="Empresa C">Empresa C</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="dataAdmissao"
            label="Data de Admissão"
            rules={[{ required: true, message: 'Por favor, insira a data de admissão' }]}
          >
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="salario"
            label="Salário"
            rules={[{ required: true, message: 'Por favor, insira o salário' }]}
          >
            <Input type="number" prefix="R$" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Por favor, selecione o status' }]}
          >
            <Select placeholder="Selecione o status">
              <Option value="Ativo">Ativo</Option>
              <Option value="Inativo">Inativo</Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit">
                {editingFuncionario ? 'Atualizar' : 'Salvar'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default Funcionarios; 