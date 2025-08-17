import { toast } from 'react-toastify';

/**
 * Toast customizado para exclusão com cor vermelha
 */
export const showDeleteSuccessToast = (itemName: string) => {
  toast.success(`Registro "${itemName}" excluído com sucesso!`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: {
      backgroundColor: '#fff2f0',
      border: '1px solid #ffccc7',
      color: '#cf1322',
    },
  });
};

/**
 * Toast customizado para cancelamento de exclusão
 */
export const showDeleteCancelToast = (itemName: string) => {
  toast.info(`Exclusão do registro "${itemName}" cancelada.`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: {
      backgroundColor: '#e6f7ff',
      border: '1px solid #91d5ff',
      color: '#1890ff',
    },
  });
};

/**
 * Toast customizado para erro de exclusão
 */
export const showDeleteErrorToast = () => {
  toast.error('Erro ao excluir registro. Tente novamente.', {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
}; 