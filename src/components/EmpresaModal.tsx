import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Row, Col, Button, Select, DatePicker, InputNumber, Steps } from 'antd';
import { SaveOutlined, CloseCircleFilled, ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import moment, { Moment } from 'moment';
import { useNavigate } from 'react-router-dom';
import { Empresa } from '../types/empresaTypes';

export interface EmpresaForm {
  codEmpresa?: string;
  cnpj?: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cep?: string;
  cidade?: string;
  uf?: string;
  telefone01?: string;
  telefone02?: string;
  fax?: string;
  celular?: string;
  whatsapp?: string;
  instagram?: string;
  linkedin?: string;
  nFuncionarios?: number;
  dataContribuicao?: string | Moment;
  valorContribuicao?: number;
  dataCadastro?: string | Moment;
  cadastrante?: string;
  observacao?: string;
}

interface EmpresaModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: EmpresaForm) => void;
  initialValues?: Partial<Empresa>;
  loading?: boolean;
  isEdit?: boolean;
}

const estados = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'
];

const formatCNPJ = (value: string) => {
  const cnpj = value.replace(/\D/g, '');
  if (cnpj.length <= 2) return cnpj;
  if (cnpj.length <= 5) return `${cnpj.slice(0, 2)}.${cnpj.slice(2)}`;
  if (cnpj.length <= 8) return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5)}`;
  if (cnpj.length <= 12) return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8)}`;
  return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12, 14)}`;
};

const formatCEP = (value: string) => {
  const cep = value.replace(/\D/g, '');
  if (cep.length <= 5) return cep;
  return `${cep.slice(0, 5)}-${cep.slice(5, 8)}`;
};

const EmpresaModal: React.FC<EmpresaModalProps> = ({ visible, onCancel, onSubmit, initialValues, loading, isEdit }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Dados da Empresa',
      description: 'Informações básicas',
    },
    {
      title: 'Endereço',
      description: 'Localização',
    },
    {
      title: 'Contatos e Redes',
      description: 'Comunicação',
    },
    {
      title: 'Contribuição',
      description: 'Financeiro',
    },
  ];

  useEffect(() => {
    if (visible) {
      form.resetFields();
      setCurrentStep(0);
      if (initialValues) {
        const values: any = { ...initialValues };
        if (values.dataContribuicao) values.dataContribuicao = moment(values.dataContribuicao);
        if (values.dataCadastro) values.dataCadastro = moment(values.dataCadastro);
        form.setFieldsValue(values);
      } else {
        const cadastrante = localStorage.getItem('usuarioLogado') || 'Sistema';
        form.setFieldsValue({ dataCadastro: moment(), cadastrante });
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async (values: any) => {
    const usuarioLogado = localStorage.getItem('usuarioLogado') || 'Sistema';
    const processed: EmpresaForm = {
      codEmpresa: values.codEmpresa?.toUpperCase(),
      cnpj: values.cnpj?.replace(/\D/g, ''),
      razaoSocial: values.razaoSocial?.toUpperCase(),
      nomeFantasia: values.nomeFantasia?.toUpperCase(),
      endereco: values.endereco?.toUpperCase(),
      numero: values.numero?.toString(),
      complemento: values.complemento?.toUpperCase(),
      bairro: values.bairro?.toUpperCase(),
      cep: values.cep?.replace(/\D/g, ''),
      cidade: values.cidade?.toUpperCase(),
      uf: values.uf,
      telefone01: values.telefone01,
      telefone02: values.telefone02,
      fax: values.fax,
      celular: values.celular,
      whatsapp: values.whatsapp,
      instagram: values.instagram,
      linkedin: values.linkedin,
      nFuncionarios: values.nFuncionarios,
      dataContribuicao: values.dataContribuicao ? moment(values.dataContribuicao).format('YYYY-MM-DD') : undefined,
      valorContribuicao: values.valorContribuicao,
      dataCadastro: values.dataCadastro ? moment(values.dataCadastro).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
      cadastrante: usuarioLogado,
      observacao: values.observacao,
    };
    onSubmit(processed);
  };

  const next = async () => {
    try {
      const values = await form.validateFields();
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.log('Validation failed:', error);
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <h4 style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px', marginBottom: '20px' }}>
              Dados da Empresa
            </h4>
            <Row gutter={16}>
              <Col span={5}>
                <Form.Item name="codEmpresa" label="Código">
                  <Input placeholder="CÓDIGO" style={{ textTransform: 'uppercase' }} />
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item name="cnpj" label="CNPJ" rules={[{ required: true, message: 'Informe o CNPJ' }]}>
                  <Input 
                    placeholder="00.000.000/0000-00" 
                    maxLength={18}
                    onChange={(e) => {
                      const only = e.target.value.replace(/\D/g, '');
                      if (only.length <= 14) {
                        e.target.value = formatCNPJ(only);
                        form.setFieldValue('cnpj', formatCNPJ(only));
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="razaoSocial" label="Razão Social" rules={[{ required: true, message: 'Informe a razão social' }]}>
                  <Input placeholder="RAZÃO SOCIAL" style={{ textTransform: 'uppercase' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="nomeFantasia" label="Nome Fantasia">
                  <Input placeholder="NOME FANTASIA" style={{ textTransform: 'uppercase' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="telefone01" label="Telefone 1">
                  <Input placeholder="(00) 0000-0000" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="telefone02" label="Telefone 2">
                  <Input placeholder="(00) 0000-0000" />
                </Form.Item>
              </Col>
            </Row>
          </div>
        );

      case 1:
        return (
          <div>
            <h4 style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px', marginBottom: '20px' }}>
              Endereço
            </h4>
            <Row gutter={16}>
              <Col span={10}>
                <Form.Item name="endereco" label="Endereço">
                  <Input placeholder="RUA, AVENIDA, ETC" style={{ textTransform: 'uppercase' }} />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="numero" label="Número">
                  <Input placeholder="NÚMERO" />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item name="complemento" label="Complemento">
                  <Input placeholder="COMPLEMENTO" style={{ textTransform: 'uppercase' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item name="bairro" label="Bairro">
                  <Input placeholder="BAIRRO" style={{ textTransform: 'uppercase' }} />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item name="cep" label="CEP">
                  <Input 
                    placeholder="00000-000" 
                    maxLength={9}
                    onChange={(e) => {
                      const only = e.target.value.replace(/\D/g, '');
                      if (only.length <= 8) {
                        e.target.value = formatCEP(only);
                        form.setFieldValue('cep', formatCEP(only));
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="cidade" label="Cidade">
                  <Input placeholder="CIDADE" style={{ textTransform: 'uppercase' }} />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item name="uf" label="UF">
                  <Select placeholder="UF">
                    {estados.map(uf => (
                      <Select.Option key={uf} value={uf}>{uf}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>
        );

      case 2:
        return (
          <div>
            <h4 style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px', marginBottom: '20px' }}>
              Contatos e Redes Sociais
            </h4>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="fax" label="Fax">
                  <Input placeholder="FAX" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="celular" label="Celular">
                  <Input placeholder="(00) 00000-0000" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="whatsapp" label="Whatsapp">
                  <Input placeholder="(00) 00000-0000" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="instagram" label="Instagram">
                  <Input placeholder="@perfil" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="linkedin" label="LinkedIn">
                  <Input placeholder="URL ou @perfil" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="observacao" label="Observação">
                  <Input.TextArea rows={3} placeholder="Observações gerais" />
                </Form.Item>
              </Col>
            </Row>
          </div>
        );

      case 3:
        return (
          <div>
            <h4 style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px', marginBottom: '20px' }}>
              Contribuição
            </h4>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="nFuncionarios" label="Nº Funcionários">
                  <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="dataContribuicao" label="Data Contribuição">
                  <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="valorContribuicao" label="Valor Contribuição">
                  <InputNumber 
                    style={{ width: '100%' }} 
                    min={0} 
                    step={0.01} 
                    formatter={(value) => `R$ ${value ?? ''}`} 
                    parser={(value) => (value ? value.replace(/R\$\s?/g, '') : '') as any} 
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="dataCadastro" label="Data Cadastro">
                  <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="cadastrante" label="Cadastrante">
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
          </div>
        );

      default:
        return null;
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
      width={900}
      style={{ borderRadius: 0, padding: 0 }}
      styles={{ body: { padding: 0, backgroundColor: '#f5f7e9', border: 'none' } }}
      modalRender={(node) => node}
      wrapClassName="empresa-modal-wrapper"
      destroyOnHidden
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
          <Steps current={currentStep} items={steps} style={{ marginBottom: '30px' }} />
          
          <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
            {renderStepContent()}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', paddingBottom: '10px' }}>
              <div>
                {currentStep > 0 && (
                  <Button 
                    onClick={prev}
                    icon={<ArrowLeftOutlined />}
                    style={{ 
                      height: '40px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      backgroundColor: '#666',
                      borderColor: '#666',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ANTERIOR
                  </Button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                {currentStep < steps.length - 1 && (
                  <Button 
                    onClick={next}
                    icon={<ArrowRightOutlined />}
                    style={{ 
                      height: '40px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      backgroundColor: '#1890ff',
                      borderColor: '#1890ff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    PRÓXIMO
                  </Button>
                )}

                {currentStep === steps.length - 1 && (
                  <Button 
                    htmlType="submit" 
                    loading={loading}
                    icon={<SaveOutlined />}
                    style={{ 
                      height: '40px',
                      fontSize: '14px',
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
                    SALVAR
                  </Button>
                )}

                <Button
                  onClick={onCancel}
                  icon={<CloseCircleFilled />}
                  style={{ 
                    height: '40px',
                    fontSize: '14px',
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
                  CANCELAR
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default EmpresaModal; 