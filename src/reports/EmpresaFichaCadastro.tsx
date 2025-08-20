import { Empresa } from '../types/empresaTypes';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const gerarFichaCadastralEmpresa = (empresa: Empresa) => {
  try {
    // Criar um novo documento PDF com orientação retrato
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Configurar fonte Arial (helvetica é o mais próximo disponível)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    // Adicionar cabeçalho com a cor vermelha do SINDPLAST
    doc.setFillColor(242, 49, 31); // Cor vermelha do sistema (#F2311F)
    doc.rect(0, 0, 210, 20, 'F'); // Retângulo vermelho no topo (largura total da página A4)
    
    // Adicionar informações do SINDPLAST no cabeçalho (alinhado à esquerda)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255); // Texto branco
    doc.text('SINDPLAST-AM', 15, 12);
    
    doc.setFontSize(8);
    doc.text('SINDICATO DOS TRABALHADORES NAS INDÚSTRIAS DE MATERIAL PLÁSTICO DE MANAUS E DO ESTADO DO AMAZONAS', 15, 16);
    
    // Resetar cor e fonte
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    // Adicionar título centralizado
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0); // Preto
    doc.text('FICHA CADASTRAL', 105, 38, { align: 'center' });
    
    // Adicionar informações da empresa
    let yPos = 52;
    
    // Função para adicionar informações com quebra de linha se necessário
    const addInfo = (label: string, value: string | number | undefined) => {
      const labelWidth = 55; // Aumentei de 50 para 55 para mais espaçamento
      const maxWidth = 130; // Diminuí de 135 para 130 para manter o alinhamento
      const xPos = 20;
      
      doc.setFont('helvetica', 'bold');
      const upperLabel = `${label.toUpperCase()}:`;
      doc.text(upperLabel, xPos, yPos); // Converter label para maiúsculo
      
      doc.setFont('helvetica', 'normal');
      const text = value?.toString() || 'NÃO INFORMADO';
      const upperText = text.toUpperCase(); // Converter para maiúsculo
      
      // Quebrar texto se for muito longo
      const lines = doc.splitTextToSize(upperText, maxWidth);
      doc.text(lines, xPos + labelWidth, yPos);
      
      // Ajustar posição Y com base no número de linhas
      yPos += lines.length * 5 + 1;
    };
    
    // Informações básicas
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(242, 49, 31);
    doc.text('DADOS DA EMPRESA', 20, yPos);
    
    // Linha vermelha após o título
    doc.setDrawColor(242, 49, 31);
    doc.setLineWidth(0.3);
    doc.line(15, yPos + 2, 195, yPos + 2);
    yPos += 10; // Mais espaço após a linha
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    addInfo('Código Empresa', empresa.codEmpresa);
    addInfo('CNPJ', formatCNPJ(empresa.cnpj || ''));
    addInfo('Razão Social', empresa.razaoSocial);
    addInfo('Nome Fantasia', empresa.nomeFantasia);
    
    // Mais espaço antes da próxima seção
    yPos += 10; // Padronizado para 10 (espaçamento padrão)
    
    // Contatos
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(242, 49, 31);
    doc.text('CONTATOS', 20, yPos);
    
    // Linha vermelha após o título
    doc.setDrawColor(242, 49, 31);
    doc.setLineWidth(0.3);
    doc.line(15, yPos + 2, 195, yPos + 2);
    yPos += 10; // Padronizado para 10 (espaçamento padrão)
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    addInfo('Telefone 1', empresa.telefone01);
    addInfo('Telefone 2', empresa.telefone02);
    addInfo('Celular', empresa.celular);
    addInfo('Fax', empresa.fax);
    addInfo('WhatsApp', empresa.whatsapp);
    addInfo('Instagram', empresa.instagram);
    addInfo('LinkedIn', empresa.linkedin);
    
    // Mais espaço antes da próxima seção
    yPos += 10; // Padronizado para 10 (espaçamento padrão)
    
    // Endereço
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(242, 49, 31);
    doc.text('ENDEREÇO', 20, yPos);
    
    // Linha vermelha após o título
    doc.setDrawColor(242, 49, 31);
    doc.setLineWidth(0.3);
    doc.line(15, yPos + 2, 195, yPos + 2);
    yPos += 10; // Padronizado para 10 (espaçamento padrão)
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    addInfo('Endereço', empresa.endereco);
    addInfo('Número', empresa.numero);
    addInfo('Complemento', empresa.complemento);
    addInfo('Bairro', empresa.bairro);
    addInfo('CEP', empresa.cep);
    addInfo('Cidade', empresa.cidade);
    addInfo('UF', empresa.uf);
    
    // Mais espaço antes da próxima seção
    yPos += 10; // Padronizado para 10 (espaçamento padrão)
    
    // Dados adicionais
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(242, 49, 31);
    doc.text('DADOS ADICIONAIS', 20, yPos);
    
    // Linha vermelha após o título
    doc.setDrawColor(242, 49, 31);
    doc.setLineWidth(0.3);
    doc.line(15, yPos + 2, 195, yPos + 2);
    yPos += 10; // Padronizado para 10 (espaçamento padrão)
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    addInfo('Número de Funcionários', empresa.nFuncionarios?.toString());
    addInfo('Valor da Contribuição', empresa.valorContribuicao ? `R$ ${empresa.valorContribuicao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '');
    addInfo('Data de Contribuição', empresa.dataContribuicao ? new Date(empresa.dataContribuicao).toLocaleDateString('pt-BR') : '');
    addInfo('Data de Cadastro', empresa.dataCadastro ? new Date(empresa.dataCadastro).toLocaleDateString('pt-BR') : '');
    addInfo('Cadastrante', empresa.cadastrante);
    addInfo('Observações', empresa.observacao);
    
    // Adicionar rodapé com a cor vermelha do SINDPLAST
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Linha vermelha no rodapé
      doc.setDrawColor(242, 49, 31);
      doc.setLineWidth(0.5);
      doc.line(15, 280, 195, 280);
      
      // Informações do rodapé
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(`SINDPLAST-AM © ${new Date().getFullYear()} - Todos os direitos reservados`, 15, 287);
      doc.text(`${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')} | Página ${i} de ${pageCount}`, 195, 287, { align: 'right' });
    }
    
    // Abrir o PDF em uma nova aba para visualização e impressão
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
    
    return true;
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    return false;
  }
};

// Função auxiliar para formatar CNPJ
const formatCNPJ = (cnpj: string) => {
  if (!cnpj) return 'N/A';
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};