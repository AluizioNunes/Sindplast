import React, { useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { SaveOutlined, CloseCircleFilled } from '@ant-design/icons';

interface PerfilForm {
  Perfil: string;
  Descricao?: string;
  Cadastrante: string;
  DataCadastro?: string;
}

interface PerfilModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: PerfilForm) => void;
  initialValues?: Partial<PerfilForm>;
}

const PerfilModal: React.FC<PerfilModalProps> = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.resetFields();
      if (initialValues) {
        form.setFieldsValue(initialValues);
      }
    }
  }, [visible, initialValues, form]);

  const handleFinish = (values: PerfilForm) => {
    // Preencher Cadastrante automaticamente se não estiver presente
    values.Cadastrante = localStorage.getItem('usuarioLogado') || 'SISTEMA';
    onSubmit(values);
  };

  return (
    <Modal
      open={visible}
      title={null}
      onCancel={onCancel}
      footer={null}
      closable={false}
      centered
      width={650}
      style={{ borderRadius: 0, padding: 0 }}
      bodyStyle={{ padding: 0, backgroundColor: '#f5f7e9', border: 'none' }}
      modalRender={(node) => node}
      wrapClassName="delete-modal-wrapper"
      destroyOnClose
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
        
        <div style={{ padding: '20px 30px' }}>
          <h3 style={{ color: '#F2311F', fontSize: '20px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
            {initialValues ? 'EDITAR PERFIL' : 'CADASTRAR NOVO PERFIL'}
          </h3>
          
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={initialValues}
          >
            <Form.Item name="Perfil" label="Perfil" rules={[{ required: true, message: 'Informe o nome do perfil' }]}> 
              <Input 
                placeholder="Nome do perfil" 
                onChange={(e) => {
                  const upperValue = e.target.value.toUpperCase();
                  form.setFieldValue('Perfil', upperValue);
                }}
              />
            </Form.Item>
            <Form.Item name="Descricao" label="Descrição">
              <Input 
                placeholder="Descrição do perfil" 
                onChange={(e) => {
                  const upperValue = e.target.value.toUpperCase();
                  form.setFieldValue('Descricao', upperValue);
                }}
              />
            </Form.Item>
            {initialValues?.DataCadastro && (
              <Form.Item label="Data de Cadastro">
                <Input value={new Date(initialValues.DataCadastro).toLocaleString()} disabled />
              </Form.Item>
            )}
            <Form.Item style={{ marginTop: '30px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '30px',
              }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ 
                    width: '180px', 
                    height: '45px',
                    fontSize: '16px',
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
                  <SaveOutlined style={{ marginRight: '8px' }} /> SALVAR
                </Button>
                
                <Button
                  onClick={onCancel}
                  style={{ 
                    width: '180px',
                    height: '45px',
                    fontSize: '16px',
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
                  <CloseCircleFilled style={{ marginRight: '8px' }} /> CANCELAR
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default PerfilModal; 