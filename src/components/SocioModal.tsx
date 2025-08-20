import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Row, Col, Button, Select, DatePicker, Switch, Steps } from 'antd';
import { SaveOutlined, CloseCircleFilled, CheckOutlined, CloseOutlined, ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import moment, { Moment } from 'moment';
import { useNavigate } from 'react-router-dom';

export interface SocioForm {
  nome?: string;
  rg?: string;
  emissor?: string;
  cpf?: string;
  nascimento?: string | Moment;
  sexo?: string;
  naturalidade?: string;
  naturalidadeUF?: string;
  nacionalidade?: string;
  estadoCivil?: string;
  endereco?: string;
  complemento?: string;
  bairro?: string;
  cep?: string;
  celular?: string;
  redeSocial?: string;
  pai?: string;
  mae?: string;
  cadastrante?: string;
  status?: string;
  // Novos campos
  matricula?: string;
  dataMensalidade?: string | Moment;
  valorMensalidade?: number;
  dataAdmissao?: string | Moment;
  ctps?: string;
  funcao?: string;
  codEmpresa?: string;
  cnpj?: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  dataDemissao?: string | Moment;
  motivoDemissao?: string;
  carta?: boolean;
  carteira?: boolean;
  ficha?: boolean;
  observacao?: string;
  telefone?: string;
}

interface SocioModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: SocioForm) => void;
  initialValues?: Partial<SocioForm>;
  loading?: boolean;
  isEdit?: boolean;
}

const estados = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const formatCPF = (value: string) => {
  const cpf = value.replace(/\D/g, '');
  if (cpf.length <= 3) return cpf;
  if (cpf.length <= 6) return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
  if (cpf.length <= 9) return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
  return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
};

const formatCEP = (value: string) => {
  const cep = value.replace(/\D/g, '');
  if (cep.length <= 5) return cep;
  return `${cep.slice(0, 5)}-${cep.slice(5, 8)}`;
};

const SocioModal: React.FC<SocioModalProps> = ({ visible, onCancel, onSubmit, initialValues, loading, isEdit }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [statusAtivo, setStatusAtivo] = useState<boolean>(true);

  const steps = [
    {
      title: 'Dados Pessoais',
      description: 'Informações básicas',
    },
    {
      title: 'Endereço',
      description: 'Localização',
    },
    {
      title: 'Contato',
      description: 'Comunicação',
    },
    {
      title: 'Dados Sindicais',
      description: 'Informações profissionais',
    },
  ];

  useEffect(() => {
    if (visible) {
      form.resetFields();
      setCurrentStep(0);
      if (initialValues) {
        const values: any = { ...initialValues };
        if (values.nascimento) values.nascimento = moment(values.nascimento);
        if (values.dataMensalidade) values.dataMensalidade = moment(values.dataMensalidade);
        if (values.dataAdmissao) values.dataAdmissao = moment(values.dataAdmissao);
        if (values.dataDemissao) values.dataDemissao = moment(values.dataDemissao);
        setStatusAtivo(values.status?.toUpperCase() !== 'INATIVO');
        form.setFieldsValue(values);
      } else {
        form.setFieldsValue({ 
          status: 'ATIVO',
          nacionalidade: 'BRASILEIRA',
          carta: false,
          carteira: false,
          ficha: false
        });
        setStatusAtivo(true);
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async (values: any) => {
    try {
      const usuarioLogado = localStorage.getItem('usuarioLogado') || 'Sistema';
      const processedValues: SocioForm = {
        nome: values.nome?.toUpperCase(),
        rg: values.rg,
        emissor: values.emissor?.toUpperCase(),
        cpf: values.cpf?.replace(/\D/g, ''),
        nascimento: values.nascimento ? moment(values.nascimento).format('YYYY-MM-DD') : undefined,
        sexo: values.sexo?.toUpperCase(),
        naturalidade: values.naturalidade?.toUpperCase(),
        naturalidadeUF: values.naturalidadeUF?.toUpperCase(),
        nacionalidade: values.nacionalidade?.toUpperCase(),
        estadoCivil: values.estadoCivil?.toUpperCase(),
        endereco: values.endereco?.toUpperCase(),
        complemento: values.complemento?.toUpperCase(),
        bairro: values.bairro?.toUpperCase(),
        cep: values.cep?.replace(/\D/g, ''),
        celular: values.celular,
        redeSocial: values.redeSocial,
        pai: values.pai?.toUpperCase(),
        mae: values.mae?.toUpperCase(),
        cadastrante: usuarioLogado,
        status: statusAtivo ? 'ATIVO' : 'INATIVO',
        // Novos campos
        matricula: values.matricula,
        dataMensalidade: values.dataMensalidade ? moment(values.dataMensalidade).format('YYYY-MM-DD') : undefined,
        valorMensalidade: values.valorMensalidade,
        dataAdmissao: values.dataAdmissao ? moment(values.dataAdmissao).format('YYYY-MM-DD') : undefined,
        ctps: values.ctps,
        funcao: values.funcao,
        codEmpresa: values.codEmpresa,
        cnpj: values.cnpj,
        razaoSocial: values.razaoSocial,
        nomeFantasia: values.nomeFantasia,
        dataDemissao: values.dataDemissao ? moment(values.dataDemissao).format('YYYY-MM-DD') : undefined,
        motivoDemissao: values.motivoDemissao,
        carta: values.carta,
        carteira: values.carteira,
        ficha: values.ficha,
        observacao: values.observacao,
        telefone: values.telefone
      };
      onSubmit(processedValues);
    } catch (error) {
      console.error('Erro ao processar formulário:', error);
    }
  };

  const handleStatusChange = (checked: boolean) => {
    setStatusAtivo(checked);
    form.setFieldsValue({ status: checked ? 'ATIVO' : 'INATIVO' });
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
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <h4 style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px', margin: 0, flex: 1 }}>
                Dados Pessoais
              </h4>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
              }}>
                <span style={{ marginRight: '8px', fontWeight: 'bold' }}>STATUS:</span>
                <Switch
                  checked={statusAtivo}
                  onChange={handleStatusChange}
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  style={{ 
                    backgroundColor: statusAtivo ? '#4caf50' : '#f44336',
                    width: '80px',
                    height: '32px',
                    marginRight: '8px'
                  }}
                />
                <span style={{ 
                  fontWeight: 'bold', 
                  color: statusAtivo ? '#4caf50' : '#f44336'
                }}>
                  {statusAtivo ? 'ATIVO' : 'INATIVO'}
                </span>
                <Form.Item name="status" hidden>
                  <Input />
                </Form.Item>
              </div>
            </div>
            
            <Row gutter={16}>
              <Col span={9}>
                <Form.Item 
                  name="nome" 
                  label="Nome" 
                  rules={[
                    { required: true, message: 'Informe o nome' },
                    { min: 3, message: 'Nome deve ter no mínimo 3 caracteres' }
                  ]}
                >
                  <Input 
                    placeholder="NOME COMPLETO" 
                    style={{ textTransform: 'uppercase' }}
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item 
                  name="cpf" 
                  label="CPF"
                >
                  <Input 
                    placeholder="000.000.000-00" 
                    maxLength={14}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 11) {
                        e.target.value = formatCPF(value);
                        form.setFieldValue('cpf', formatCPF(value));
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item 
                  name="nascimento" 
                  label="Data de Nascimento"
                >
                  <DatePicker
                    style={{ width: '100%', height: '32px' }}
                    placeholder="Selecione a data"
                    format="DD/MM/YYYY"
                    size="middle"
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item 
                  name="rg" 
                  label="RG"
                >
                  <Input placeholder="DOCUMENTO DE IDENTIDADE" />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item 
                  name="emissor" 
                  label="Órgão Emissor"
                >
                  <Input placeholder="SSP/AM" style={{ textTransform: 'uppercase' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={3}>
                <Form.Item 
                  name="sexo" 
                  label="Sexo"
                >
                  <Select placeholder="Selecione" size="middle">
                    <Select.Option value="MASCULINO">MASCULINO</Select.Option>
                    <Select.Option value="FEMININO">FEMININO</Select.Option>
                    <Select.Option value="OUTRO">OUTRO</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item 
                  name="estadoCivil" 
                  label="Estado Civil"
                >
                  <Select placeholder="Selecione" size="middle">
                    <Select.Option value="SOLTEIRO(A)">SOLTEIRO(A)</Select.Option>
                    <Select.Option value="CASADO(A)">CASADO(A)</Select.Option>
                    <Select.Option value="DIVORCIADO(A)">DIVORCIADO(A)</Select.Option>
                    <Select.Option value="VIÚVO(A)">VIÚVO(A)</Select.Option>
                    <Select.Option value="UNIÃO ESTÁVEL">UNIÃO ESTÁVEL</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item 
                  name="naturalidade" 
                  label="Naturalidade"
                >
                  <Input placeholder="CIDADE DE NASCIMENTO" style={{ textTransform: 'uppercase' }} />
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item 
                  name="naturalidadeUF" 
                  label="UF"
                >
                  <Select placeholder="UF" size="middle">
                    {estados.map(estado => (
                      <Select.Option key={estado} value={estado}>{estado}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item 
                  name="nacionalidade" 
                  label="Nacionalidade"
                >
                  <Input placeholder="BRASILEIRA" style={{ textTransform: 'uppercase' }} />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item 
                  name="celular" 
                  label="Celular"
                >
                  <Input placeholder="(92) 98888-8888" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item 
                  name="pai" 
                  label="Nome do Pai"
                >
                  <Input placeholder="NOME COMPLETO DO PAI" style={{ textTransform: 'uppercase' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  name="mae" 
                  label="Nome da Mãe"
                >
                  <Input placeholder="NOME COMPLETO DA MÃE" style={{ textTransform: 'uppercase' }} />
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
              <Col span={13}>
                <Form.Item 
                  name="endereco" 
                  label="Endereço"
                >
                  <Input placeholder="RUA, AVENIDA, ETC" style={{ textTransform: 'uppercase' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item 
                  name="complemento" 
                  label="Complemento"
                >
                  <Input placeholder="NÚMERO, BLOCO, APTO" style={{ textTransform: 'uppercase' }} />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item 
                  name="bairro" 
                  label="Bairro"
                >
                  <Input placeholder="BAIRRO" style={{ textTransform: 'uppercase' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={4}>
                <Form.Item 
                  name="cep" 
                  label="CEP"
                >
                  <Input 
                    placeholder="00000-000" 
                    maxLength={9}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 8) {
                        e.target.value = formatCEP(value);
                        form.setFieldValue('cep', formatCEP(value));
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item 
                  name="redeSocial" 
                  label="Rede Social"
                >
                  <Input placeholder="@perfil" />
                </Form.Item>
              </Col>
            </Row>
          </div>
        );

      case 2:
        return (
          <div>
            <h4 style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px', marginBottom: '20px' }}>
              Contato
            </h4>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item 
                  name="celular" 
                  label="Celular"
                >
                  <Input placeholder="(92) 98888-8888" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item 
                  name="telefone" 
                  label="Telefone"
                >
                  <Input placeholder="(92) 3333-3333" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item 
                  name="redeSocial" 
                  label="Rede Social"
                >
                  <Input placeholder="@perfil" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item 
                  name="pai" 
                  label="Nome do Pai"
                >
                  <Input placeholder="NOME COMPLETO DO PAI" style={{ textTransform: 'uppercase' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  name="mae" 
                  label="Nome da Mãe"
                >
                  <Input placeholder="NOME COMPLETO DA MÃE" style={{ textTransform: 'uppercase' }} />
                </Form.Item>
              </Col>
            </Row>
          </div>
        );

      case 3:
        return (
          <div>
            <h4 style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px', marginBottom: '20px' }}>
              Dados Sindicais e Profissionais
            </h4>
            <Row gutter={16}>
              <Col span={4}>
                <Form.Item name="matricula" label="Matrícula">
                  <Input placeholder="MATRÍCULA" />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item name="dataMensalidade" label="Data Mensalidade">
                  <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item name="valorMensalidade" label="Valor Mensalidade">
                  <Input type="number" placeholder="0,00" min={0} step={0.01} />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item name="dataAdmissao" label="Data de Admissão">
                  <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item name="dataDemissao" label="Data de Demissão">
                  <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={4}>
                <Form.Item name="ctps" label="CTPS">
                  <Input placeholder="CTPS" />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item name="funcao" label="Função">
                  <Input placeholder="FUNÇÃO" />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item name="codEmpresa" label="Código Empresa">
                  <Input placeholder="CÓDIGO" />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item name="cnpj" label="CNPJ Empresa">
                  <Input placeholder="CNPJ" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item name="razaoSocial" label="Razão Social">
                  <Input placeholder="RAZÃO SOCIAL" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="nomeFantasia" label="Nome Fantasia">
                  <Input placeholder="NOME FANTASIA" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="motivoDemissao" label="Motivo Demissão">
                  <Input placeholder="MOTIVO DA DEMISSÃO" />
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item name="carta" label="Carta" valuePropName="checked">
                  <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item name="carteira" label="Carteira" valuePropName="checked">
                  <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item name="ficha" label="Ficha" valuePropName="checked">
                  <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="observacao" label="Observação">
                  <Input.TextArea placeholder="Observações gerais" rows={3} />
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
      width={1100}
      style={{ borderRadius: 0, padding: 0 }}
      styles={{ body: { padding: 0, backgroundColor: '#f5f7e9', border: 'none' } }}
      modalRender={(node) => node}
      wrapClassName="socio-modal-wrapper"
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
          
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
          >
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

export default SocioModal; 