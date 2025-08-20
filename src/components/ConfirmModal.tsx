import React from 'react';
import { Modal, Button } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

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
  title = 'CONFIRMAR AÇÃO',
  content,
  okText = 'SIM',
  cancelText = 'NÃO',
  onOk,
  onCancel,
  loading = false
}) => {
  const navigate = useNavigate();

  return (
    <Modal
      open={visible}
      title={null}
      onCancel={onCancel}
      footer={null}
      closable={false}
      centered
      width={650}
      style={{ borderRadius: 0, padding: 0 }}
      styles={{ body: { padding: 0, backgroundColor: '#f5f7e9', border: 'none' } }}
      modalRender={(node) => node}
      wrapClassName="confirm-modal-wrapper"
      destroyOnClose
    >
      <div style={{ padding: 0 }}>
        <div 
          style={{ 
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
        
        <div style={{ padding: '60px 20px', textAlign: 'center' }}>
          <h3 style={{ color: '#F2311F', fontSize: '22px', fontWeight: 'bold' }}>
            {title}
          </h3>
          <p style={{ marginTop: '16px' }}>{content}</p>
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '30px',
          padding: '20px 40px 60px'
        }}>
          <Button
            onClick={onOk}
            loading={loading}
            style={{ 
              width: '180px', 
              height: '50px',
              fontSize: '18px',
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
            <CheckCircleFilled style={{ marginRight: '8px' }} /> {okText}
          </Button>
          
          <Button
            onClick={onCancel}
            style={{ 
              width: '180px',
              height: '50px',
              fontSize: '18px',
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
            <CloseCircleFilled style={{ marginRight: '8px' }} /> {cancelText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal; 