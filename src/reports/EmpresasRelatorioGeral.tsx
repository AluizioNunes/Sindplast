import { Empresa } from '../types/empresaTypes';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const gerarRelatorioGeralEmpresas = (empresas: Empresa[]) => {
  try {
    // Criar um novo documento PDF com orientação paisagem
    const doc = new jsPDF('l', 'mm', 'a4');
    
    // Configurar fonte Arial (helvetica é o mais próximo disponível)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    
    // Adicionar cabeçalho com a cor vermelha do SINDPLAST
    doc.setFillColor(242, 49, 31); // Cor vermelha do sistema (#F2311F)
    doc.rect(0, 0, 297, 15, 'F'); // Retângulo vermelho no topo (largura total da página A4 paisagem)
    
    // Adicionar informações do SINDPLAST no cabeçalho (alinhado à esquerda)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255); // Texto branco
    doc.text('SINDPLAST-AM', 15, 10);
    
    doc.setFontSize(8);
    doc.text('SINDICATO DOS TRABALHADORES NAS INDÚSTRIAS DE MATERIAL PLÁSTICO DE MANAUS E DO ESTADO DO AMAZONAS', 15, 13);
    
    // Adicionar título alinhado à direita dentro do retângulo vermelho
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255); // Texto branco
    doc.text('RELATÓRIO GERAL DE EMPRESAS', 282, 10, { align: 'right' });
    
    // Função auxiliar para formatar CNPJ
    const formatCNPJ = (cnpj: string) => {
      if (!cnpj) return 'N/A';
      return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    };
    
    // Função auxiliar para formatar valor monetário
    const formatMoeda = (valor: number | undefined) => {
      if (!valor) return 'N/A';
      return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    };
    
    // Adicionar tabela com as empresas
    const tableData = empresas.map(empresa => [
      empresa.codEmpresa || 'N/A',
      empresa.razaoSocial || 'N/A',
      formatCNPJ(empresa.cnpj || ''),
      empresa.cidade || 'N/A',
      empresa.uf || 'N/A',
      empresa.nFuncionarios?.toString() || '0',
      formatMoeda(empresa.valorContribuicao)
    ]);
    
    autoTable(doc, {
      head: [['CÓDIGO', 'RAZÃO SOCIAL', 'CNPJ', 'CIDADE', 'UF', 'FUNCIONÁRIOS', 'CONTRIBUIÇÃO']],
      body: tableData,
      startY: 20,
      margin: { left: 0, right: 0 }, // Definindo margens para alinhar com o cabeçalho
      styles: {
        font: 'helvetica',
        fontSize: 9, // Diminuindo a fonte para 9
        cellPadding: 2
      },
      headStyles: {
        fillColor: [242, 49, 31],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9  // Diminuindo a fonte dos headers para 9
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      columnStyles: {
        0: { cellWidth: 20 },   // Código (mantido)
        1: { cellWidth: 132 },  // Razão Social (aumentado de 120 para 130)
        2: { cellWidth: 35 },   // CNPJ (mantido)
        3: { cellWidth: 35 },   // Cidade (reduzido de 40 para 35)
        4: { cellWidth: 15 },   // UF (mantido)
        5: { cellWidth: 30 },   // Funcionários (reduzido de 32 para 27)
        6: { cellWidth: 30 }    // Contribuição (mantido)
      }
    });
    
    // Adicionar total de empresas (ajustando posição para não sobrepor o rodapé)
    const finalY = (doc as any).lastAutoTable.finalY || 38;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(`Total de empresas cadastradas: ${empresas.length}`, 15, finalY + 10);
    
    // Adicionar rodapé com a cor vermelha do SINDPLAST
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Linha vermelha no rodapé (subindo mais ainda)
      doc.setDrawColor(242, 49, 31);
      doc.setLineWidth(0.5);
      doc.line(10, 185, 287, 185); // Linha mais curta, afastada das bordas
      
      // Informações do rodapé (subindo mais ainda e afastadas das bordas)
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(`SINDPLAST-AM © ${new Date().getFullYear()} - Todos os direitos reservados`, 10, 189);
      doc.text(`${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')} | Página ${i} de ${pageCount}`, 287, 189, { align: 'right' });
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