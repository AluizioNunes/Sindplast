import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import { Socio } from '../types/socioTypes';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generateSocioPDF = (socio: Socio): void => {
  // Criar novo documento PDF
  const doc = new jsPDF();
  
  // Adicionar cabeçalho
  doc.setFontSize(18);
  doc.setTextColor(242, 49, 31); // Cor vermelha do Sindplast
  doc.text("SINDPLAST-AM", 105, 20, { align: "center" });
  
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text("SINDICATO DOS TRABALHADORES NAS INDÚSTRIAS DE MATERIAL", 105, 28, { align: "center" });
  doc.text("PLÁSTICO DE MANAUS E DO ESTADO DO AMAZONAS", 105, 33, { align: "center" });
  
  // Adicionar título
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("FICHA COMPLETA DO SÓCIO", 105, 45, { align: "center" });
  
  // Adicionar linha divisória
  doc.setDrawColor(242, 49, 31);
  doc.setLineWidth(0.5);
  doc.line(14, 50, 196, 50);
  
  // Imagem para avatar (substitua pela foto real se disponível)
  doc.setFillColor(242, 49, 31);
  doc.circle(30, 70, 15, 'F');
  doc.setTextColor(255);
  doc.setFontSize(16);
  doc.text(socio.nome?.charAt(0) || '?', 30, 74, { align: 'center' });
  
  // Dados do sócio
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  doc.text("Dados Pessoais", 60, 65);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  // Nome e Status
  doc.setFont('helvetica', 'bold');
  doc.text("Nome:", 60, 75);
  doc.setFont('helvetica', 'normal');
  doc.text(socio.nome || "N/A", 85, 75);
  
  doc.setFont('helvetica', 'bold');
  doc.text("Status:", 150, 75);
  doc.setFont('helvetica', 'normal');
  doc.text(socio.status || "N/A", 175, 75);
  
  // CPF e RG
  doc.setFont('helvetica', 'bold');
  doc.text("CPF:", 60, 85);
  doc.setFont('helvetica', 'normal');
  doc.text(formatCPF(socio.cpf) || "N/A", 85, 85);
  
  doc.setFont('helvetica', 'bold');
  doc.text("RG:", 150, 85);
  doc.setFont('helvetica', 'normal');
  doc.text(`${socio.rg || "N/A"} - ${socio.emissor || "N/A"}`, 175, 85);
  
  // Nascimento e Sexo
  doc.setFont('helvetica', 'bold');
  doc.text("Nascimento:", 60, 95);
  doc.setFont('helvetica', 'normal');
  doc.text(socio.nascimento ? moment(socio.nascimento).format('DD/MM/YYYY') : "N/A", 95, 95);
  
  doc.setFont('helvetica', 'bold');
  doc.text("Sexo:", 150, 95);
  doc.setFont('helvetica', 'normal');
  doc.text(socio.sexo || "N/A", 175, 95);
  
  // Naturalidade e Estado Civil
  doc.setFont('helvetica', 'bold');
  doc.text("Naturalidade:", 60, 105);
  doc.setFont('helvetica', 'normal');
  doc.text(
    socio.naturalidade
      ? `${socio.naturalidade}${socio.naturalidadeUF ? '/' + socio.naturalidadeUF : ''}`
      : "N/A",
    95,
    105
  );
  
  doc.setFont('helvetica', 'bold');
  doc.text("Estado Civil:", 150, 105);
  doc.setFont('helvetica', 'normal');
  doc.text(socio.estadoCivil || "N/A", 182, 105);
  
  // Nacionalidade
  doc.setFont('helvetica', 'bold');
  doc.text("Nacionalidade:", 60, 115);
  doc.setFont('helvetica', 'normal');
  doc.text(socio.nacionalidade || "N/A", 100, 115);
  
  // Linha divisória
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(14, 125, 196, 125);
  
  // Contato
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text("Contato e Endereço", 14, 135);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text("Celular:", 14, 145);
  doc.setFont('helvetica', 'normal');
  doc.text(socio.celular || "N/A", 40, 145);
  
  doc.setFont('helvetica', 'bold');
  doc.text("Rede Social:", 100, 145);
  doc.setFont('helvetica', 'normal');
  doc.text(socio.redeSocial || "N/A", 135, 145);
  
  doc.setFont('helvetica', 'bold');
  doc.text("Endereço:", 14, 155);
  doc.setFont('helvetica', 'normal');
  doc.text(socio.endereco || "N/A", 40, 155);
  
  doc.setFont('helvetica', 'bold');
  doc.text("Complemento:", 14, 165);
  doc.setFont('helvetica', 'normal');
  doc.text(socio.complemento || "N/A", 50, 165);
  
  doc.setFont('helvetica', 'bold');
  doc.text("Bairro:", 100, 165);
  doc.setFont('helvetica', 'normal');
  doc.text(socio.bairro || "N/A", 125, 165);
  
  doc.setFont('helvetica', 'bold');
  doc.text("CEP:", 14, 175);
  doc.setFont('helvetica', 'normal');
  doc.text(formatCEP(socio.cep) || "N/A", 40, 175);
  
  // Linha divisória
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(14, 185, 196, 185);
  
  // Dados familiares
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text("Filiação", 14, 195);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text("Pai:", 14, 205);
  doc.setFont('helvetica', 'normal');
  doc.text(socio.pai || "N/A", 30, 205);
  
  doc.setFont('helvetica', 'bold');
  doc.text("Mãe:", 14, 215);
  doc.setFont('helvetica', 'normal');
  doc.text(socio.mae || "N/A", 30, 215);
  
  // Linha divisória
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(14, 225, 196, 225);
  
  // Dados de cadastro
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text("Dados do Cadastro", 14, 235);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text("Data de Cadastro:", 14, 245);
  doc.setFont('helvetica', 'normal');
  doc.text(socio.dataCadastro ? moment(socio.dataCadastro).format('DD/MM/YYYY HH:mm') : "N/A", 60, 245);
  
  doc.setFont('helvetica', 'bold');
  doc.text("Cadastrado por:", 100, 245);
  doc.setFont('helvetica', 'normal');
  doc.text(socio.cadastrante || "N/A", 145, 245);
  
  // Adicionar rodapé
  doc.setFontSize(8);
  doc.setTextColor(100);
  const today = moment().format('DD/MM/YYYY HH:mm');
  doc.text(`Documento gerado em ${today}`, 14, 280);
  doc.text("SINDPLAST-AM", 196, 280, { align: "right" });
  
  // Salvar o PDF
  doc.save(`ficha_socio_${socio.id}.pdf`);
};

// Função helper para formatar CPF
const formatCPF = (cpf: string | null): string => {
  if (!cpf) return '';
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return cpf;
  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
};

// Função helper para formatar CEP
const formatCEP = (cep: string | null): string => {
  if (!cep) return '';
  const cleaned = cep.replace(/\D/g, '');
  if (cleaned.length !== 8) return cep;
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
}; 