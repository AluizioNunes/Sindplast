import React from 'react';
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface ConfirmModalProps {
  visible: boolean;
  title?: string;
  content: string;
  okText?: string;
  cancelText?: string;
  onOk: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title = 'Confirmar ação',
  content,
  okText = 'Sim',
  cancelText = 'Não',
  onOk,
  onCancel,
  loading = false
}) => {
  return (
    <Modal
      open={visible}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: '18px' }} />
          {title}
        </div>
      }
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {cancelText}
        </Button>,
        <Button 
          key="ok" 
          type="primary" 
          danger 
          loading={loading}
          onClick={onOk}
        >
          {okText}
        </Button>
      ]}
      centered
      maskClosable={false}
      keyboard={false}
      zIndex={9999}
      destroyOnHidden
    >
      <p>{content}</p>
    </Modal>
  );
};

export default ConfirmModal; 