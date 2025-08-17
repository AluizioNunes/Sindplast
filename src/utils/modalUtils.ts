import { Modal } from 'antd';

interface ConfirmModalOptions {
  title?: string;
  content: string;
  okText?: string;
  cancelText?: string;
  okType?: 'primary' | 'ghost' | 'dashed' | 'link' | 'text' | 'default' | 'danger';
  onOk: () => void | Promise<void>;
  onCancel?: () => void;
}

/**
 * Função utilitária para criar modais de confirmação do Ant Design
 * Resolve problemas comuns de renderização e timing
 */
export const showConfirmModal = (options: ConfirmModalOptions) => {
  const {
    title = 'Confirmar ação',
    content,
    okText = 'Sim',
    cancelText = 'Não',
    onOk,
    onCancel
  } = options;

  // Usar setTimeout para garantir que o Modal seja renderizado corretamente
  setTimeout(() => {
    Modal.confirm({
      title,
      content,
      okText,
      cancelText,
      centered: true,
      maskClosable: false,
      keyboard: false,
      onOk: async () => {
        try {
          await onOk();
        } catch (error) {
          console.error('Erro na ação confirmada:', error);
        }
      },
      onCancel,
    });
  }, 100);
};

/**
 * Função específica para confirmação de exclusão
 */
export const showDeleteConfirmModal = (
  itemName: string,
  onConfirm: () => void | Promise<void>,
  onCancel?: () => void
) => {
  console.log('showDeleteConfirmModal chamado para:', itemName);
  
  // Solução robusta com fallback
  const showModal = async () => {
    try {
      // Forçar re-renderização antes de abrir o modal
      await new Promise(resolve => setTimeout(resolve, 0));
      
      Modal.confirm({
        title: 'Confirmar exclusão',
        content: `Deseja excluir o registro "${itemName}" da base de dados SINDPLAST?`,
        okText: 'Sim, confirmar exclusão',
        cancelText: 'Não',
        okType: 'danger',
        centered: true,
        maskClosable: false,
        keyboard: false,
        zIndex: 9999,
        onOk: async () => {
          try {
            await onConfirm();
          } catch (error) {
            console.error('Erro na ação confirmada:', error);
          }
        },
        onCancel,
      });
    } catch (error) {
      console.error('Erro ao abrir modal do Ant Design, usando fallback:', error);
      // Fallback para window.confirm
      const confirmacao = window.confirm(`Deseja excluir o registro "${itemName}" da base de dados SINDPLAST?`);
      if (confirmacao) {
        try {
          await onConfirm();
        } catch (error) {
          console.error('Erro na ação confirmada (fallback):', error);
        }
      } else if (onCancel) {
        onCancel();
      }
    }
  };
  
  showModal();
}; 