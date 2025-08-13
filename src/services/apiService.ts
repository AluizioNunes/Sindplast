import axios from 'axios';
import { toast } from 'react-toastify';
import { Socio } from '../types/socioTypes';
import { Empresa } from '../types/empresaTypes';

const API_URL = 'http://localhost:5000/api';

// Configurações do axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptador para logs detalhados
api.interceptors.request.use(
  config => {
    console.log(`[API] Requisição: ${config.method?.toUpperCase()} ${config.url}`, config);
    return config;
  },
  error => {
    console.error('[API] Erro na requisição:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    console.log(`[API] Resposta: ${response.status}`, response.data);
    return response;
  },
  error => {
    if (error.response) {
      console.error(`[API] Erro ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.error('[API] Sem resposta:', error.request);
    } else {
      console.error('[API] Erro:', error.message);
    }
    return Promise.reject(error);
  }
);

// Função genérica para tratamento de erros
const handleApiError = (error: any, defaultMessage: string): string => {
  if (error.response) {
    return `Erro ${error.response.status}: ${error.response.data?.message || defaultMessage}`;
  } else if (error.request) {
    return 'Sem resposta do servidor. Verifique se o backend está online.';
  } else {
    return error.message || defaultMessage;
  }
};

// Funções específicas para cada operação
export const apiService = {
  // Listar todos os sócios
  getAll: async (): Promise<Socio[]> => {
    try {
      const response = await api.get('/socios');
      return response.data as Socio[];
    } catch (error: any) {
      const errorMessage = handleApiError(error, 'Falha ao carregar a lista de sócios');
      toast.error(errorMessage);
      throw error;
    }
  },

  // Obter um único sócio
  getById: async (id: number): Promise<Socio> => {
    try {
      const response = await api.get(`/socios/${id}`);
      return response.data as Socio;
    } catch (error: any) {
      const errorMessage = handleApiError(error, 'Falha ao carregar os dados do sócio');
      toast.error(errorMessage);
      throw error;
    }
  },

  // Criar um novo sócio
  create: async (data: any) => {
    try {
      // Preparar dados com todos os campos da tabela Socios
      const socioData = {
        nome: data.nome,
        rg: data.rg,
        emissor: data.emissor,
        cpf: data.cpf,
        nascimento: data.nascimento,
        sexo: data.sexo,
        naturalidade: data.naturalidade,
        naturalidadeUF: data.naturalidadeUF,
        nacionalidade: data.nacionalidade,
        estadoCivil: data.estadoCivil,
        endereco: data.endereco,
        complemento: data.complemento,
        bairro: data.bairro,
        cep: data.cep,
        celular: data.celular,
        redeSocial: data.redeSocial,
        pai: data.pai,
        mae: data.mae,
        cadastrante: data.cadastrante,
        status: data.status,
        // Campos adicionais
        matricula: data.matricula,
        dataMensalidade: data.dataMensalidade,
        valorMensalidade: data.valorMensalidade,
        dataAdmissao: data.dataAdmissao,
        ctps: data.ctps,
        funcao: data.funcao,
        codEmpresa: data.codEmpresa,
        cnpj: data.cnpj,
        razaoSocial: data.razaoSocial,
        nomeFantasia: data.nomeFantasia,
        dataDemissao: data.dataDemissao,
        motivoDemissao: data.motivoDemissao,
        carta: data.carta,
        carteira: data.carteira,
        ficha: data.ficha,
        observacao: data.observacao,
        telefone: data.telefone
      };

      const response = await api.post('/socios', socioData);
      toast.success('Sócio cadastrado com sucesso!');
      return response.data;
    } catch (error: any) {
      const errorMessage = handleApiError(error, 'Falha ao cadastrar o sócio');
      toast.error(errorMessage);
      throw error;
    }
  },

  // Atualizar um sócio
  update: async (id: number, data: any) => {
    try {
      // Preparar dados com todos os campos da tabela Socios
      const socioData = {
        nome: data.nome,
        rg: data.rg,
        emissor: data.emissor,
        cpf: data.cpf,
        nascimento: data.nascimento,
        sexo: data.sexo,
        naturalidade: data.naturalidade,
        naturalidadeUF: data.naturalidadeUF,
        nacionalidade: data.nacionalidade,
        estadoCivil: data.estadoCivil,
        endereco: data.endereco,
        complemento: data.complemento,
        bairro: data.bairro,
        cep: data.cep,
        celular: data.celular,
        redeSocial: data.redeSocial,
        pai: data.pai,
        mae: data.mae,
        cadastrante: data.cadastrante,
        status: data.status,
        // Campos adicionais
        matricula: data.matricula,
        dataMensalidade: data.dataMensalidade,
        valorMensalidade: data.valorMensalidade,
        dataAdmissao: data.dataAdmissao,
        ctps: data.ctps,
        funcao: data.funcao,
        codEmpresa: data.codEmpresa,
        cnpj: data.cnpj,
        razaoSocial: data.razaoSocial,
        nomeFantasia: data.nomeFantasia,
        dataDemissao: data.dataDemissao,
        motivoDemissao: data.motivoDemissao,
        carta: data.carta,
        carteira: data.carteira,
        ficha: data.ficha,
        observacao: data.observacao,
        telefone: data.telefone
      };

      const response = await api.put(`/socios/${id}`, socioData);
      toast.success('Sócio atualizado com sucesso!');
      return response.data;
    } catch (error: any) {
      const errorMessage = handleApiError(error, 'Falha ao atualizar o sócio');
      toast.error(errorMessage);
      throw error;
    }
  },

  // Excluir um sócio
  delete: async (id: number) => {
    try {
      console.log(`[DEBUG] Iniciando exclusão do sócio ID: ${id}`);
      
      // Verificar se o registro existe antes de tentar excluir
      const checkExists = await api.get(`/socios/${id}`)
        .catch(err => {
          if (err.response?.status === 404) {
            console.log(`[DEBUG] Sócio ID: ${id} não encontrado`);
            throw new Error('Sócio não encontrado na base de dados');
          }
          throw err;
        });
      
      console.log(`[DEBUG] Sócio ID: ${id} encontrado, procedendo com exclusão`);
      
      // Proceder com a exclusão
      const response = await api.delete(`/socios/${id}`);
      
      console.log(`[DEBUG] Exclusão bem-sucedida, status: ${response.status}`);
      toast.success('Sócio excluído com sucesso!');
      return response.data;
    } catch (error: any) {
      const errorMessage = handleApiError(error, 'Falha ao excluir o sócio');
      toast.error(errorMessage);
      
      // Log detalhado para depuração
      console.error('[DELETE ERROR] Detalhes completos:', {
        errorObject: error,
        message: error.message,
        stack: error.stack,
        response: error.response,
        request: error.request
      });
      
      throw error;
    }
  },
  
  // Verificar conexão com o backend
  checkConnection: async () => {
    try {
      await api.get('/socios', { timeout: 3000 });
      return true;
    } catch (error) {
      return false;
    }
  },

  // Empresas
  getAllEmpresas: async (): Promise<Empresa[]> => {
    try {
      const response = await api.get('/empresas');
      return response.data as Empresa[];
    } catch (error: any) {
      const errorMessage = handleApiError(error, 'Falha ao carregar a lista de empresas');
      toast.error(errorMessage);
      throw error;
    }
  },

  getEmpresaById: async (id: number): Promise<Empresa> => {
    try {
      const response = await api.get(`/empresas/${id}`);
      return response.data as Empresa;
    } catch (error: any) {
      const errorMessage = handleApiError(error, 'Falha ao carregar os dados da empresa');
      toast.error(errorMessage);
      throw error;
    }
  },

  createEmpresa: async (data: Partial<Empresa>) => {
    try {
      const payload = { ...data };
      const response = await api.post('/empresas', payload);
      toast.success('Empresa cadastrada com sucesso!');
      return response.data;
    } catch (error: any) {
      const errorMessage = handleApiError(error, 'Falha ao cadastrar a empresa');
      toast.error(errorMessage);
      throw error;
    }
  },

  updateEmpresa: async (id: number, data: Partial<Empresa>) => {
    try {
      const payload = { ...data };
      const response = await api.put(`/empresas/${id}`, payload);
      toast.success('Empresa atualizada com sucesso!');
      return response.data;
    } catch (error: any) {
      const errorMessage = handleApiError(error, 'Falha ao atualizar a empresa');
      toast.error(errorMessage);
      throw error;
    }
  },

  deleteEmpresa: async (id: number) => {
    try {
      const response = await api.delete(`/empresas/${id}`);
      toast.success('Empresa excluída com sucesso!');
      return response.data;
    } catch (error: any) {
      const errorMessage = handleApiError(error, 'Falha ao excluir a empresa');
      toast.error(errorMessage);
      throw error;
    }
  },
}; 