import React, { useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';

interface PermissaoForm {
  Nome: string;
  Descricao?: string;
  Cadastrante: string;
  DataCadastro?: string;
}

interface PermissoesModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: PermissaoForm) => void;
  initialValues?: Partial<PermissaoForm>;
}

const PermissoesModal: React.FC<PermissoesModalProps> = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.resetFields();
      if (initialValues) {
        form.setFieldsValue(initialValues);
      }
    }
  }, [visible, initialValues, form]);

  const handleFinish = (values: PermissaoForm) => {
    if (!values.Cadastrante) {
      values.Cadastrante = localStorage.getItem('usuarioLogado') || 'SISTEMA';
    }
    onSubmit(values);
  };

  return (
    <Modal
      open={visible}
      title={initialValues ? 'Editar Permissão' : 'Nova Permissão'}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={initialValues}
      >
        <Form.Item name="Nome" label="Nome" rules={[{ required: true, message: 'Informe o nome da permissão' }]}> 
          <Input placeholder="Nome da permissão" />
        </Form.Item>
        <Form.Item name="Descricao" label="Descrição">
          <Input placeholder="Descrição da permissão" />
        </Form.Item>
        <Form.Item name="Cadastrante" label="Cadastrante">
          <Input placeholder="Cadastrante" disabled value={initialValues?.Cadastrante || localStorage.getItem('usuarioLogado') || 'SISTEMA'} />
        </Form.Item>
        {initialValues?.DataCadastro && (
          <Form.Item label="Data de Cadastro">
            <Input value={new Date(initialValues.DataCadastro).toLocaleString()} disabled />
          </Form.Item>
        )}
        <Form.Item style={{ textAlign: 'right' }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>Cancelar</Button>
          <Button type="primary" htmlType="submit">Salvar</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PermissoesModal; 