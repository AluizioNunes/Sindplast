import React, { useEffect } from 'react';
import { Modal, Form, Input, Row, Col, Button, Select } from 'antd';
import { SaveOutlined, CloseCircleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export interface UsuarioForm {
  Nome: string;
  CPF: string;
  Funcao: string;
  Email: string;
  Usuario: string;
  Senha?: string;
  Perfil: string;
  Cadastrante: string;
}

interface UsuarioModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: UsuarioForm) => void;
  initialValues?: Partial<UsuarioForm>;
  loading?: boolean;
  isEdit?: boolean;
  perfis: { IdPerfil: number; Perfil: string }[];
}

const formatCPF = (value: string) => {
  const cpf = value.replace(/\D/g, '');
  if (cpf.length <= 3) return cpf;
  if (cpf.length <= 6) return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
  if (cpf.length <= 9) return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
  return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
};

const UsuarioModal: React.FC<UsuarioModalProps> = ({ visible, onCancel, onSubmit, initialValues, loading, isEdit, perfis }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (visible) {
      form.resetFields();
      // Preenche o campo Cadastrante automaticamente com o usuário logado
      const usuarioLogado = localStorage.getItem('usuarioLogado') || '';
      if (initialValues) {
        form.setFieldsValue({ ...initialValues, Cadastrante: initialValues.Cadastrante || usuarioLogado });
      } else {
        form.setFieldsValue({ Cadastrante: usuarioLogado });
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async (values: UsuarioForm) => {
    try {
      // Converter campos para maiúsculo (exceto email e senha)
      const processedValues = {
        ...values,
        Nome: values.Nome.toUpperCase(),
        CPF: values.CPF.replace(/\D/g, ''), // Remove máscara do CPF
        Funcao: values.Funcao.toUpperCase(),
        Usuario: values.Usuario.toUpperCase(),
        Perfil: values.Perfil.toUpperCase(),
        Cadastrante: values.Cadastrante.toUpperCase(),
      };

      // Preencher Usuario com CPF sem máscara se não informado
      if (!processedValues.Usuario && processedValues.CPF) {
        processedValues.Usuario = processedValues.CPF;
      }
      // Preencher Senha padrão se não informado (apenas na criação)
      if (!isEdit && !processedValues.Senha) {
        processedValues.Senha = '123456';
      }
      onSubmit(processedValues);
    } catch (error) {
      console.error('Erro ao processar formulário:', error);
    }
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
      styles={{ body: { padding: 0, backgroundColor: '#f5f7e9', border: 'none' } }}
      modalRender={(node) => node}
      wrapClassName="usuario-modal-wrapper"
      destroyOnClose
    >
      <div style={{ padding: 0 }}>
        <div 
          style={{ 
            backgroundColor: '#F2311F', 
            color: 'white', 
            padding: '10px 20px',
            textAlign: 'left',
            height: '60px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/home')}
        >
          <div style={{ fontSize: '22px', fontWeight: 'bold', lineHeight: '1.2' }}>SINDPLAST-AM</div>
          <div style={{ fontSize: '11px', lineHeight: '1.2' }}>
            SINDICATO DOS TRABALHADORES NAS INDÚSTRIAS DE MATERIAL PLÁSTICO DE MANAUS E DO ESTADO DO AMAZONAS
          </div>
        </div>
        
        <div style={{ padding: '20px 30px' }}>
          <h3 style={{ 
            color: '#F2311F', 
            fontSize: '20px', 
            fontWeight: 'bold', 
            textAlign: 'center', 
            marginBottom: '20px' 
          }}>
            {isEdit ? 'EDITAR USUÁRIO' : 'CADASTRAR NOVO USUÁRIO'}
          </h3>
          
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item 
                  name="Nome" 
                  label="Nome" 
                  rules={[
                    { required: true, message: 'Informe o nome' },
                    { min: 3, message: 'Nome deve ter no mínimo 3 caracteres' }
                  ]}
                >
                  <Input 
                    placeholder="NOME COMPLETO" 
                    size="large" 
                    style={{ textTransform: 'uppercase' }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  name="CPF" 
                  label="CPF" 
                  rules={[
                    { required: true, message: 'Informe o CPF' },
                    { pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/, message: 'CPF inválido' }
                  ]}
                >
                  <Input 
                    placeholder="000.000.000-00" 
                    size="large"
                    maxLength={14}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 11) {
                        e.target.value = formatCPF(value);
                        form.setFieldValue('CPF', formatCPF(value));
                      }
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item 
                  name="Funcao" 
                  label="Função" 
                  rules={[
                    { required: true, message: 'Informe a função' },
                    { min: 3, message: 'Função deve ter no mínimo 3 caracteres' }
                  ]}
                >
                  <Input 
                    placeholder="FUNÇÃO DO USUÁRIO" 
                    size="large"
                    style={{ textTransform: 'uppercase' }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  name="Email" 
                  label="Email" 
                  rules={[
                    { required: true, message: 'Informe o email' },
                    { type: 'email', message: 'Email inválido' }
                  ]}
                >
                  <Input placeholder="E-mail válido" size="large" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item 
                  name="Usuario" 
                  label="Usuário" 
                  rules={[
                    { required: true, message: 'Informe o usuário' },
                    { min: 3, message: 'Usuário deve ter no mínimo 3 caracteres' }
                  ]}
                >
                  <Input 
                    placeholder="SE VAZIO, SERÁ O CPF SEM MÁSCARA" 
                    size="large"
                    style={{ textTransform: 'uppercase' }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                {!isEdit && (
                  <Form.Item 
                    name="Senha" 
                    label="Senha" 
                    rules={[
                      { min: 6, message: 'Senha deve ter no mínimo 6 caracteres' }
                    ]}
                  >
                    <Input.Password placeholder="Se vazio, será 123456" size="large" />
                  </Form.Item>
                )}
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item 
                  name="Perfil" 
                  label="Perfil" 
                  rules={[
                    { required: true, message: 'Selecione o perfil' }
                  ]}
                >
                  <Select placeholder="Selecione o perfil">
                    {perfis.map((perfil) => (
                      <Select.Option key={perfil.IdPerfil} value={perfil.Perfil}>
                        {perfil.Perfil}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  name="Cadastrante" 
                  label="Cadastrante" 
                  style={{ display: 'none' }}
                >
                  <Input 
                    disabled
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '30px',
              marginTop: '30px',
              paddingBottom: '10px'
            }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
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
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default UsuarioModal; 