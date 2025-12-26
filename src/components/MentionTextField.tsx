import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface MentionTextFieldProps extends Omit<TextFieldProps, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
}

const MentionTextField: React.FC<MentionTextFieldProps> = ({
  value,
  onChange,
  placeholder,
  error,
  helperText,
  rows = 3,
  ...rest
}) => {
  // Handle text change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <TextField
      fullWidth
      multiline
      rows={rows}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      error={error}
      helperText={helperText}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '16px',
          background: '#fff',
          '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' },
          '&:hover fieldset': { borderColor: 'rgba(0,122,255,0.3)' },
          '&.Mui-focused fieldset': { borderColor: '#007AFF' },
        },
        '& .MuiInputBase-input': {
          '&::placeholder': {
            color: 'rgba(0,0,0,0.4)',
            opacity: 1,
          },
        },
      }}
      {...rest}
    />
  );
};

export default MentionTextField;
