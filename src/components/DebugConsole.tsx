import React, { useState, useEffect } from 'react';
import { Button, Drawer, Typography, Space } from 'antd';

const { Text } = Typography;

// Component to help debug issues
const DebugConsole: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Override console.log, console.error, etc.
  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.log = (...args) => {
      originalLog(...args);
      setLogs(prev => [...prev, `[LOG] ${args.map(arg => JSON.stringify(arg)).join(' ')}`]);
    };
    
    console.error = (...args) => {
      originalError(...args);
      setLogs(prev => [...prev, `[ERROR] ${args.map(arg => JSON.stringify(arg)).join(' ')}`]);
    };
    
    console.warn = (...args) => {
      originalWarn(...args);
      setLogs(prev => [...prev, `[WARN] ${args.map(arg => JSON.stringify(arg)).join(' ')}`]);
    };
    
    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);
  
  return (
    <>
      <Button 
        type="primary" 
        style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}
        onClick={() => setVisible(true)}
      >
        Debug Console
      </Button>
      <Drawer
        title="Debug Console"
        placement="right"
        width={500}
        onClose={() => setVisible(false)}
        open={visible}
      >
        <Button style={{ marginBottom: 16 }} onClick={() => setLogs([])}>
          Clear Logs
        </Button>
        <Space direction="vertical" style={{ width: '100%' }}>
          {logs.map((log, index) => (
            <Text key={index} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {log}
            </Text>
          ))}
        </Space>
      </Drawer>
    </>
  );
};

export default DebugConsole; 