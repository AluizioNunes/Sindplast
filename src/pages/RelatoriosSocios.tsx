import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Select, DatePicker, Table, Statistic, Space, Typography, Tag, Modal, Input, message } from 'antd';
import { 
  SolutionOutlined, 
  ExportOutlined, 
  PrinterOutlined, 
  FilterOutlined,
  TeamOutlined,
  DollarOutlined,
  CalendarOutlined,
  BankOutlined,
  ProfileOutlined
} from '@ant-design/icons';
import { Socio } from '../types/socioTypes';
import { apiService } from '../services/apiService';
import moment from 'moment';
import jsPDF from 'jspdf';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Função para carregar e converter imagem para base64
const carregarLogomarca = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/jpeg');
      resolve(dataURL);
    };
    img.onerror = () => {
      reject(new Error('Erro ao carregar logomarca'));
    };
    img.src = '/SINDPLAST.jpg';
  });
};

const RelatoriosSocios: React.FC = () => {
  const [socios, setSocios] = useState<Socio[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({
    status: 'todos',
    sexo: 'todos',
    estadoCivil: 'todos',
    naturalidadeUF: 'todos',
    dataInicio: null as Date | null,
    dataFim: null as Date | null
  });
  const [modalVotacaoVisible, setModalVotacaoVisible] = useState(false);
  const [tituloRelatorio, setTituloRelatorio] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState<string | undefined>(undefined);
  const [logoBase64, setLogoBase64] = useState<string>('');
  const [orientacaoPDF, setOrientacaoPDF] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    carregarSocios();
    carregarLogomarca().then(setLogoBase64).catch(console.error);
  }, []);

  const carregarSocios = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAll();
      setSocios(data);
    } catch (error) {
      console.error('Erro ao carregar sócios:', error);
    } finally {
      setLoading(false);
    }
  };

  // Estatísticas
  const totalSocios = socios.length;
  const sociosAtivos = socios.filter(s => s.status?.toUpperCase() === 'ATIVO').length;
  const sociosInativos = socios.filter(s => s.status?.toUpperCase() === 'INATIVO').length;
  const totalMensalidades = socios.reduce((sum, s) => sum + (s.valorMensalidade || 0), 0);
  const sociosComEmpresa = socios.filter(s => s.codEmpresa).length;

  // Colunas da tabela
  const columns = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
      ellipsis: true,
    },
    {
      title: 'CPF',
      dataIndex: 'cpf',
      key: 'cpf',
      width: 120,
      render: (cpf: string) => {
        if (!cpf) return 'N/A';
        const cleaned = cpf.replace(/\D/g, '');
        if (cleaned.length !== 11) return cpf;
        return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
      },
    },
    {
      title: 'Matrícula',
      dataIndex: 'matricula',
      key: 'matricula',
      width: 100,
      render: (value: string) => value || 'N/A',
    },
    {
      title: 'Função',
      dataIndex: 'funcao',
      key: 'funcao',
      width: 120,
      render: (value: string) => value || 'N/A',
    },
    {
      title: 'Empresa',
      dataIndex: 'razaoSocial',
      key: 'razaoSocial',
      width: 150,
      ellipsis: true,
      render: (value: string) => value || 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => {
        const color = status?.toUpperCase() === 'ATIVO' ? 'green' : 'red';
        return <Tag color={color}>{status?.toUpperCase() || 'N/A'}</Tag>;
      },
    },
    {
      title: 'Data Admissão',
      dataIndex: 'dataAdmissao',
      key: 'dataAdmissao',
      width: 120,
      render: (date: string) => date ? moment(date).format('DD/MM/YYYY') : 'N/A',
    },
    {
      title: 'Data Demissão',
      dataIndex: 'dataDemissao',
      key: 'dataDemissao',
      width: 120,
      render: (date: string) => date ? moment(date).format('DD/MM/YYYY') : 'N/A',
    },
    {
      title: 'Valor Mensalidade',
      dataIndex: 'valorMensalidade',
      key: 'valorMensalidade',
      width: 130,
      render: (value: number) => 
        value ? `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 0,00',
    },
    {
      title: 'Telefone',
      dataIndex: 'telefone',
      key: 'telefone',
      width: 120,
      render: (value: string) => value || 'N/A',
    },
  ];

  // Aplicar filtros
  const sociosFiltrados = socios.filter(socio => {
    if (filtros.status !== 'todos' && socio.status?.toUpperCase() !== filtros.status.toUpperCase()) return false;
    if (filtros.sexo !== 'todos' && socio.sexo?.toUpperCase() !== filtros.sexo.toUpperCase()) return false;
    if (filtros.estadoCivil !== 'todos' && socio.estadoCivil?.toUpperCase() !== filtros.estadoCivil.toUpperCase()) return false;
    if (filtros.naturalidadeUF !== 'todos' && socio.naturalidadeUF !== filtros.naturalidadeUF) return false;
    if (filtros.dataInicio && socio.dataAdmissao) {
      const dataAdmissao = moment(socio.dataAdmissao);
      if (dataAdmissao.isBefore(filtros.dataInicio)) return false;
    }
    if (filtros.dataFim && socio.dataAdmissao) {
      const dataAdmissao = moment(socio.dataAdmissao);
      if (dataAdmissao.isAfter(filtros.dataFim)) return false;
    }
    return true;
  });

  // Obter valores únicos para filtros
  const sexos = Array.from(new Set(socios.map(s => s.sexo).filter(Boolean)));
  const estadosCivis = Array.from(new Set(socios.map(s => s.estadoCivil).filter(Boolean)));
  const ufs = Array.from(new Set(socios.map(s => s.naturalidadeUF).filter(Boolean)));

  const handleExportar = () => {
    // Implementar exportação para Excel/PDF
    console.log('Exportando relatório de sócios...');
  };

  const handleImprimir = () => {
    // Implementar impressão
    window.print();
  };

  // Função para gerar PDF de sócios ativos por empresa
  const gerarRelatorioVotacao = () => {
    // Agrupar sócios ativos por empresa
    const ativosPorEmpresa: { [empresa: string]: string[] } = {};
    socios.filter(s => s.status?.toUpperCase() === 'ATIVO').forEach(socio => {
      const empresa = socio.razaoSocial || 'SEM EMPRESA';
      if (!ativosPorEmpresa[empresa]) ativosPorEmpresa[empresa] = [];
      ativosPorEmpresa[empresa].push(socio.nome || 'NOME NÃO INFORMADO');
    });
    // Ordenar os nomes de cada empresa
    Object.keys(ativosPorEmpresa).forEach(empresa => {
      ativosPorEmpresa[empresa].sort((a, b) => a.localeCompare(b, 'pt-BR'));
    });
    // Gerar PDF no formato A4 e orientação escolhida
    const doc = new jsPDF({ orientation: orientacaoPDF, unit: 'mm', format: 'a4' });
    let y = 20;
    doc.setFontSize(16);
    // Centralizar o título
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text(tituloRelatorio || 'Relatório para Votação', pageWidth / 2, y, { align: 'center' });
    y += 10;
    doc.setFontSize(12);
    Object.entries(ativosPorEmpresa).forEach(([empresa, nomes]) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'bold');
      doc.text(empresa, 10, y);
      y += 7;
      doc.setFont('helvetica', 'normal');
      nomes.forEach(nome => {
        if (y > 280) { doc.addPage(); y = 20; }
        doc.text('- ' + nome, 15, y);
        y += 6;
      });
      y += 4;
    });
    doc.save((tituloRelatorio || 'relatorio_votacao') + '.pdf');
    setModalVotacaoVisible(false);
    setTituloRelatorio('');
    message.success('Relatório gerado com sucesso!');
  };

  // Função utilitária para desenhar o relatório no padrão solicitado
  function gerarPDFPadrao({
    titulo, empresa, codigo, socios, totalGeral
  }: {
    titulo: string;
    empresa: string;
    codigo?: string;
    socios: { matricula?: string; nome?: string; cadastro?: string }[];
    totalGeral?: number;
  }, docParam?: jsPDF, orientacao: 'portrait' | 'landscape' = 'landscape') {
    // Usar a logomarca carregada do estado
    if (!logoBase64) {
      console.error('Logomarca não carregada');
      return new jsPDF();
    }

    const doc = docParam || new jsPDF({ orientation: orientacao, unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const now = moment().format('DD/MM/YYYY HH:mm');

    // Calcular o número de páginas antes de gerar
    const linhasPorPagina = 36;
    // const totalPaginas = Math.ceil(socios.length / linhasPorPagina) || 1;

    // Função para desenhar o cabeçalho em cada página
    function drawHeader(pageNum: number, totalPages: number) {
      doc.addImage(logoBase64, 'JPEG', 16, 12, 20, 20); // logomarca menor
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20); // SINDPLAST menor
      doc.text('SINDPLAST – AM', 40, 23);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('SINDICATO DOS TRABALHADORES NAS INDÚSTRIAS DE MATERIAL PLÁSTICO DE MANAUS', 40, 28);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      // Ajuste: recuar 10mm para a esquerda a data/hora e numeração da página
      doc.text(now, pageWidth - 20, 22, { align: 'right' });
      doc.text(`PÁG.${String(pageNum).padStart(2, '0')}/${String(totalPages).padStart(2, '0')}`, pageWidth - 20, 26, { align: 'right' });
      doc.setDrawColor(200, 0, 0);
      doc.setLineWidth(1);
      doc.line(10, 36, pageWidth - 10, 36);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(titulo, pageWidth / 2, 43, { align: 'center' });
    }

    // Gerar todas as páginas
    let y = 52;
    // Calcule o total de páginas real antes de gerar
    const totalPaginasReal = calcularTotalPaginas(socios, pageHeight, empresa, (() => {
      let yTemp = 52;
      if (empresa && empresa !== 'TODAS') yTemp += 6;
      yTemp += 6 + 4; // colunas + espaçamento
      return yTemp;
    })());
    let count = 0;
    let sociosPorPagina = [];
    let sociosRestantes = [...socios];
    while (sociosRestantes.length > 0) {
      sociosPorPagina.push(sociosRestantes.splice(0, linhasPorPagina));
    }
    // const totalPages = sociosPorPagina.length || 1;

    // Novo: contador global de páginas
    let paginaCorrente = 1;

    sociosPorPagina.forEach((sociosPag, idx) => {
      if (idx > 0) {
        doc.addPage();
        paginaCorrente++;
      }
      drawHeader(paginaCorrente, totalPaginasReal);
      y = 52;
      if (empresa && empresa !== 'TODAS') {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        // Ajuste: recuar 10mm para a esquerda o nome da empresa
        doc.text(empresa, pageWidth - 20, y, { align: 'right' });
        y += 6;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('MATRÍCULA', 13, y);
      doc.text('NOME DO SÓCIO', 35, y);
      doc.text('CADASTRO', 131, y);
      doc.text('ASSINATURA', 220, y);
      y += 6;
      y += 4;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      sociosPag.forEach((socio, socioIdx) => {
        if (y + 10 > pageHeight - 15) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(255, 0, 0);
          // Ajuste: recuar 10mm para a esquerda a linha de registros
          doc.text(`REGISTROS: ${socios.length}`, pageWidth - 20, pageHeight - 10, { align: 'right' });
          doc.setTextColor(0, 0, 0);
          doc.addPage();
          paginaCorrente++;
          drawHeader(paginaCorrente, totalPaginasReal);
          y = 52;
          if (empresa && empresa !== 'TODAS') {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);
            doc.text(empresa, pageWidth - 20, y, { align: 'right' });
            y += 6;
          }
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.text('MATRÍCULA', 13, y);
          doc.text('NOME DO SÓCIO', 35, y);
          doc.text('CADASTRO', 131, y);
          doc.text('ASSINATURA', 220, y);
          y += 6;
          y += 4;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
        }
        // Matrícula: avançar 1 caractere (~2mm)
        doc.text(socio.matricula || '', 15, y); // era 13, agora 15
        doc.text(socio.nome || '', 35, y, { maxWidth: 100 });
        doc.text(socio.cadastro || '', 140, y, { align: 'center' });
        const assinaturaStr = (doc.internal.pageSize.getWidth() > doc.internal.pageSize.getHeight())
          ? '....................................................................................................................................................'
          : '.............................................';
        doc.text(assinaturaStr, 160, y);
        y += 10;
        count++;
        // Se for o último sócio da página, desenhar REGISTROS no rodapé
        if (socioIdx === sociosPag.length - 1) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(255, 0, 0);
          // Ajuste: recuar 10mm para a esquerda a linha de registros
          doc.text(`REGISTROS: ${socios.length}`, pageWidth - 20, pageHeight - 10, { align: 'right' });
          doc.setTextColor(0, 0, 0);
        }
      });
    });
    doc.setTextColor(0, 0, 0);
    return doc;
  }

  // Função para calcular o total de páginas de forma precisa
  function calcularTotalPaginas(socios: any[], pageHeight: number, empresa: string, yInicial: number) {
    let y = yInicial;
    let totalPaginas = 1;
    for (let i = 0; i < socios.length; i++) {
      if (y + 10 > pageHeight - 15) {
        totalPaginas++;
        y = yInicial;
      }
      y += 10;
    }
    return totalPaginas;
  }

  // Função para gerar PDF com todos os sócios ativos (sem separar por empresa)
  const gerarListaCompleta = () => {
    const ativos = socios.filter(s => s.status?.toUpperCase() === 'ATIVO')
      .sort((a, b) => (a.nome || '').localeCompare(b.nome || '', 'pt-BR'));
    const doc = gerarPDFPadrao({
      titulo: tituloRelatorio || 'Lista Completa de Sócios Ativos',
      empresa: 'TODAS',
      socios: ativos.map(s => ({
        matricula: s.matricula || '',
        nome: s.nome || '',
        cadastro: s.dataCadastro ? moment(s.dataCadastro).format('DD/MM/YYYY') : ''
      })),
      totalGeral: ativos.length
    }, undefined, orientacaoPDF);
    doc.save((tituloRelatorio || 'lista_completa_socios') + '.pdf');
    setModalVotacaoVisible(false);
    setTituloRelatorio('');
    setEmpresaSelecionada(undefined);
    message.success('Relatório gerado com sucesso!');
  };

  // Função para gerar PDF de sócios ativos de uma empresa selecionada
  const gerarListaPorEmpresa = () => {
    if (!empresaSelecionada) return;
    const ativos = socios.filter(s => s.status?.toUpperCase() === 'ATIVO' && s.razaoSocial === empresaSelecionada)
      .sort((a, b) => (a.nome || '').localeCompare(b.nome || '', 'pt-BR'));
    // Buscar código da empresa (primeiro sócio encontrado)
    const codigo = ativos[0]?.codEmpresa || '';
    const doc = gerarPDFPadrao({
      titulo: tituloRelatorio || 'Lista de Sócios Ativos',
      empresa: empresaSelecionada,
      codigo,
      socios: ativos.map(s => ({
        matricula: s.matricula || '',
        nome: s.nome || '',
        cadastro: s.dataCadastro ? moment(s.dataCadastro).format('DD/MM/YYYY') : ''
      })),
      totalGeral: ativos.length
    }, undefined, orientacaoPDF);
    doc.save((tituloRelatorio || 'lista_socios_empresa') + '_' + empresaSelecionada + '.pdf');
    setModalVotacaoVisible(false);
    setTituloRelatorio('');
    setEmpresaSelecionada(undefined);
    message.success('Relatório gerado com sucesso!');
  };

  // Função para gerar PDF de todos os sócios ativos, agrupados por empresa (cada empresa em uma página)
  const gerarListaTodasEmpresas = () => {
    // Agrupar sócios ativos por empresa, descartando os que não têm empresa
    const ativosPorEmpresa: { [empresa: string]: { matricula?: string; nome?: string; cadastro?: string; codEmpresa?: string }[] } = {};
    socios.filter(s => s.status?.toUpperCase() === 'ATIVO' && s.razaoSocial && s.razaoSocial !== 'SEM EMPRESA')
      .forEach(socio => {
        const empresa = socio.razaoSocial!;
        if (!ativosPorEmpresa[empresa]) ativosPorEmpresa[empresa] = [];
        ativosPorEmpresa[empresa].push({
          matricula: socio.matricula || '',
          nome: socio.nome || '',
          cadastro: socio.dataCadastro ? moment(socio.dataCadastro).format('DD/MM/YYYY') : '',
          codEmpresa: socio.codEmpresa || ''
        });
      });
    // Ordenar os sócios de cada empresa por nome
    Object.keys(ativosPorEmpresa).forEach(empresa => {
      ativosPorEmpresa[empresa].sort((a, b) => (a.nome || '').localeCompare(b.nome || '', 'pt-BR'));
    });
    // Criar um único PDF
    const doc = new jsPDF({ orientation: orientacaoPDF, unit: 'mm', format: 'a4' });
    let primeira = true;
    Object.entries(ativosPorEmpresa).forEach(([empresa, lista]) => {
      if (!primeira) doc.addPage();
      primeira = false;
      const codigo = lista[0]?.codEmpresa || '';
      gerarPDFPadrao({
        titulo: tituloRelatorio || 'Relatório para Votação',
        empresa,
        codigo,
        socios: lista,
        totalGeral: lista.length
      }, doc, orientacaoPDF);
    });
    doc.save((tituloRelatorio || 'relatorio_todas_empresas') + '.pdf');
    setModalVotacaoVisible(false);
    setTituloRelatorio('');
    setEmpresaSelecionada(undefined);
    message.success('Relatório gerado com sucesso!');
  };

  return (
    <div style={{ padding: '20px' }}>
      

      {/* Estatísticas */}
      <Row gutter={16} style={{ marginBottom: '30px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total de Sócios"
              value={totalSocios}
              prefix={<SolutionOutlined />}
              valueStyle={{ color: '#F2311F' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Sócios Ativos"
              value={sociosAtivos}
              prefix={<SolutionOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Sócios Inativos"
              value={sociosInativos}
              prefix={<SolutionOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Valor Total Mensalidades"
              value={totalMensalidades}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#52c41a' }}
              formatter={(value) => `R$ ${value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            />
          </Card>
        </Col>
      </Row>

      {/* Cards de opções de relatório */}
      <Row gutter={16} style={{ marginBottom: 32, flexWrap: 'wrap' }} justify="start">
        <Col xs={24} sm={12} md={4}>
          <Card hoverable style={{ textAlign: 'center', cursor: 'pointer', borderColor: '#F2311F', minWidth: 180, width: '100%' }} onClick={() => {}}>
            <CalendarOutlined style={{ fontSize: 32, color: '#F2311F', marginBottom: 8 }} />
            <div style={{ fontWeight: 600, fontSize: 13 }}>SÓCIOS POR DATA CADASTRO</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card hoverable style={{ textAlign: 'center', cursor: 'pointer', borderColor: '#F2311F', minWidth: 180, width: '100%' }} onClick={() => {}}>
            <SolutionOutlined style={{ fontSize: 32, color: '#F2311F', marginBottom: 8 }} />
            <div style={{ fontWeight: 600, fontSize: 13 }}>SÓCIOS POR NOME</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card hoverable style={{ textAlign: 'center', cursor: 'pointer', borderColor: '#F2311F', minWidth: 180, width: '100%' }} onClick={() => {}}>
            <BankOutlined style={{ fontSize: 32, color: '#F2311F', marginBottom: 8 }} />
            <div style={{ fontWeight: 600, fontSize: 13 }}>SÓCIOS POR BAIRRO</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card hoverable style={{ textAlign: 'center', cursor: 'pointer', borderColor: '#F2311F', minWidth: 180, width: '100%' }} onClick={() => {}}>
            <TeamOutlined style={{ fontSize: 32, color: '#F2311F', marginBottom: 8 }} />
            <div style={{ fontWeight: 600, fontSize: 13 }}>SÓCIOS POR FÁBRICA</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card hoverable style={{ textAlign: 'center', cursor: 'pointer', borderColor: '#F2311F', minWidth: 180, width: '100%' }} onClick={() => setModalVotacaoVisible(true)}>
            <ProfileOutlined style={{ fontSize: 32, color: '#F2311F', marginBottom: 8 }} />
            <div style={{ fontWeight: 600, fontSize: 13 }}>RELATÓRIO PARA VOTAÇÃO</div>
          </Card>
        </Col>
      </Row>

      {/* Filtros */}
      <Card title="Filtros" style={{ marginBottom: '20px' }}>
        <Row gutter={16} align="middle">
          <Col span={4}>
            <Text strong>Status:</Text>
            <Select
              style={{ width: '100%', marginTop: '5px' }}
              value={filtros.status}
              onChange={(value) => setFiltros({ ...filtros, status: value })}
            >
              <Select.Option value="todos">Todos os Status</Select.Option>
              <Select.Option value="ATIVO">Ativo</Select.Option>
              <Select.Option value="INATIVO">Inativo</Select.Option>
            </Select>
          </Col>
          <Col span={4}>
            <Text strong>Sexo:</Text>
            <Select
              style={{ width: '100%', marginTop: '5px' }}
              value={filtros.sexo}
              onChange={(value) => setFiltros({ ...filtros, sexo: value })}
            >
              <Select.Option value="todos">Todos</Select.Option>
              {sexos.map(sexo => (
                <Select.Option key={sexo} value={sexo}>{sexo}</Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Text strong>Estado Civil:</Text>
            <Select
              style={{ width: '100%', marginTop: '5px' }}
              value={filtros.estadoCivil}
              onChange={(value) => setFiltros({ ...filtros, estadoCivil: value })}
            >
              <Select.Option value="todos">Todos</Select.Option>
              {estadosCivis.map(estado => (
                <Select.Option key={estado} value={estado}>{estado}</Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Text strong>UF Naturalidade:</Text>
            <Select
              style={{ width: '100%', marginTop: '5px' }}
              value={filtros.naturalidadeUF}
              onChange={(value) => setFiltros({ ...filtros, naturalidadeUF: value })}
            >
              <Select.Option value="todos">Todos os Estados</Select.Option>
              {ufs.map(uf => (
                <Select.Option key={uf} value={uf}>{uf}</Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            <Text strong>Período de Admissão:</Text>
            <RangePicker
              style={{ width: '100%', marginTop: '5px' }}
              onChange={(dates) => setFiltros({
                ...filtros,
                dataInicio: dates?.[0]?.toDate() || null,
                dataFim: dates?.[1]?.toDate() || null
              })}
            />
          </Col>
          <Col span={2}>
            <Space>
              <Button 
                type="primary" 
                icon={<FilterOutlined />}
                onClick={() => setFiltros({
                  status: 'todos',
                  sexo: 'todos',
                  estadoCivil: 'todos',
                  naturalidadeUF: 'todos',
                  dataInicio: null,
                  dataFim: null
                })}
              >
                Limpar
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Ações */}
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col>
          <Button 
            type="primary" 
            icon={<ExportOutlined />}
            onClick={handleExportar}
            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
          >
            Exportar
          </Button>
        </Col>
        <Col>
          <Button 
            icon={<PrinterOutlined />}
            onClick={handleImprimir}
          >
            Imprimir
          </Button>
        </Col>
      </Row>

      {/* Tabela */}
      <Card title={`Sócios (${sociosFiltrados.length} registros)`}>
        <Table
          columns={columns}
          dataSource={sociosFiltrados}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} de ${total} sócios`,
          }}
          scroll={{ x: 1400 }}
        />
      </Card>

      {/* Modal para título do relatório de votação */}
      <Modal
        open={modalVotacaoVisible}
        title={null}
        onCancel={() => { setModalVotacaoVisible(false); setTituloRelatorio(''); setEmpresaSelecionada(undefined); }}
        footer={null}
        closable={false}
        centered
        width={700}
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
          <div style={{ padding: '24px 32px' }}>
            <Input
              placeholder="Digite o título do relatório"
              value={tituloRelatorio}
              onChange={e => setTituloRelatorio(e.target.value)}
              maxLength={100}
              style={{ marginBottom: 16 }}
            />
            {/* Select para orientação do PDF */}
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontWeight: 500, marginRight: 8 }}>Orientação do PDF:</span>
              <Select
                value={orientacaoPDF}
                onChange={value => setOrientacaoPDF(value)}
                style={{ width: 160 }}
              >
                <Select.Option value="portrait">Retrato (padrão)</Select.Option>
                <Select.Option value="landscape">Paisagem</Select.Option>
              </Select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Button type="primary" block onClick={gerarListaCompleta} disabled={!tituloRelatorio}>
                GERAR LISTA COMPLETA
              </Button>
              <div style={{ display: 'flex', gap: 8 }}>
                <Select
                  showSearch
                  placeholder="Selecione a empresa"
                  value={empresaSelecionada}
                  onChange={setEmpresaSelecionada}
                  style={{ flex: 1 }}
                  optionFilterProp="children"
                  filterOption={(input, option) => String(option?.children).toLowerCase().includes(input.toLowerCase())}
                >
                  {Array.from(new Set(socios.filter(s => s.status?.toUpperCase() === 'ATIVO' && s.razaoSocial).map(s => s.razaoSocial!))).sort().map(empresa => (
                    <Select.Option key={empresa} value={empresa}>{empresa}</Select.Option>
                  ))}
                </Select>
                <Button type="primary" onClick={gerarListaPorEmpresa} disabled={!empresaSelecionada}>
                  GERAR LISTA POR EMPRESA
                </Button>
              </div>
              <Button block onClick={gerarListaTodasEmpresas} disabled={!tituloRelatorio}>
                GERAR LISTA DE TODAS AS EMPRESAS
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RelatoriosSocios; 