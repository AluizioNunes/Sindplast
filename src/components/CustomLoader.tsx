import React from 'react';
import { Spin, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface CustomLoaderProps {
  message?: string;
  size?: 'small' | 'default' | 'large';
  style?: React.CSSProperties;
}

const CustomLoader: React.FC<CustomLoaderProps> = ({ 
  message = 'Carregando...', 
  size = 'large',
  style 
}) => {
  const antIcon = (
    <LoadingOutlined 
      style={{ 
        fontSize: size === 'large' ? 48 : size === 'default' ? 32 : 24,
        color: '#F2311F'
      }} 
      spin 
    />
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      ...style
    }}>
      <Spin indicator={antIcon} />
      <Text 
        style={{ 
          marginTop: '16px',
          color: '#666',
          fontSize: size === 'large' ? '16px' : size === 'default' ? '14px' : '12px'
        }}
      >
        {message}
      </Text>
    </div>
  );
};

export default CustomLoader;