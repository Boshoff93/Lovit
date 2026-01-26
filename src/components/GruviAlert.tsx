import React from 'react';
import { Alert, AlertProps } from '@mui/material';

interface GruviAlertProps extends Omit<AlertProps, 'severity'> {
  severity: 'error' | 'success' | 'warning' | 'info';
  message?: string;
  children?: React.ReactNode;
}

const getStyles = (severity: GruviAlertProps['severity']) => {
  switch (severity) {
    case 'error':
      return { bg: '#DC2626', border: '#EF4444', text: '#FFFFFF' };
    case 'success':
      return { bg: '#16A34A', border: '#22C55E', text: '#FFFFFF' };
    case 'warning':
      return { bg: '#D97706', border: '#F59E0B', text: '#FFFFFF' };
    case 'info':
    default:
      return { bg: 'rgba(59, 130, 246, 0.9)', border: '#3B82F6', text: '#FFFFFF' };
  }
};

const GruviAlert: React.FC<GruviAlertProps> = ({ severity, message, children, sx, ...props }) => {
  const styles = getStyles(severity);

  return (
    <Alert
      severity={severity}
      sx={{
        backgroundColor: styles.bg,
        border: `1px solid ${styles.border}`,
        color: styles.text,
        borderRadius: '12px',
        '& .MuiAlert-icon': { color: styles.text },
        '& .MuiAlert-message': { color: styles.text, fontWeight: 500 },
        '& .MuiAlert-action': { color: styles.text },
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        ...sx,
      }}
      {...props}
    >
      {message || children}
    </Alert>
  );
};

export default GruviAlert;
