import React from 'react';
import { Modal, Button } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface BaseModalProps {
  visible: boolean;
  onCancel: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  loading?: boolean;
  isEdit?: boolean;
  submitButtonText?: string;
  showFooter?: boolean;
  width?: number;
  showHeader?: boolean;
  homeRedirect?: boolean;
}

const BaseModal: React.FC<BaseModalProps> = ({
  visible,
  onCancel,
  title,
  children,
  onSubmit,
  loading = false,
  submitButtonText = 'SALVAR',
  showFooter = true,
  width = 900,
  showHeader = true,
  homeRedirect = true
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
      width={width}
      style={{ borderRadius: 0, padding: 0 }}
      styles={{ body: { padding: 0, backgroundColor: '#f5f7e9', border: 'none' } }}
      modalRender={(node) => node}
      wrapClassName="base-modal-wrapper"
      destroyOnClose
    >
      <div style={{ padding: 0 }}>
        {showHeader && (
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
              cursor: homeRedirect ? 'pointer' : 'default'
            }}
            onClick={homeRedirect ? () => navigate('/home') : undefined}
          >
            <div style={{ fontSize: '22px', fontWeight: 'bold', lineHeight: '1.2' }}>SINDPLAST-AM</div>
            <div style={{ fontSize: '11px', lineHeight: '1.2' }}>
              SINDICATO DOS TRABALHADORES NAS INDÚSTRIAS DE MATERIAL PLÁSTICO DE MANAUS E DO ESTADO DO AMAZONAS
            </div>
          </div>
        )}

        <div style={{ padding: '20px 30px' }}>
          <h3 style={{ 
            color: '#F2311F', 
            fontSize: '20px', 
            fontWeight: 'bold', 
            textAlign: 'center', 
            marginBottom: '20px' 
          }}>
            {title}
          </h3>
          
          {children}
          
          {showFooter && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '30px',
              marginTop: '30px',
              paddingBottom: '10px'
            }}>
              {onSubmit && (
                <Button
                  type="primary"
                  onClick={onSubmit}
                  loading={loading}
                  style={{ 
                    width: '180px', 
                    height: '45px',
                    fontSize: '16px',
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
                  {submitButtonText}
                </Button>
              )}
              
              <Button
                onClick={onCancel}
                style={{ 
                  width: '180px',
                  height: '45px',
                  fontSize: '16px',
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
                <CloseCircleFilled style={{ marginRight: '8px' }} /> CANCELAR
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default BaseModal;