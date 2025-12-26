import React, { useRef } from 'react';
import { Box, TextField, TextFieldProps } from '@mui/material';

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
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Handle text change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Render text with highlighted @mentions
  const renderHighlightedText = (text: string) => {
    if (!text) return null;
    
    // Match @word patterns
    const parts = text.split(/(@\w+)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        return (
          <span key={index} style={{ color: '#007AFF', fontWeight: 600 }}>
            {part}
          </span>
        );
      }
      // Regular text in normal color
      return <span key={index} style={{ color: '#1D1D1F' }}>{part}</span>;
    });
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Highlight overlay - positioned over the textarea */}
      <Box
        sx={{
          position: 'absolute',
          top: 1,
          left: 1,
          right: 1,
          p: '16.5px 14px',
          borderRadius: '16px',
          pointerEvents: 'none',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          fontSize: '1rem',
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          lineHeight: 1.5,
          letterSpacing: '0.00938em',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        {renderHighlightedText(value)}
      </Box>
      <TextField
        fullWidth
        multiline
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        inputRef={inputRef}
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
            color: 'transparent',
            caretColor: '#1D1D1F',
            position: 'relative',
            zIndex: 2,
            '&::placeholder': {
              color: 'rgba(0,0,0,0.4)',
              opacity: 1,
            },
          },
        }}
        {...rest}
      />
    </Box>
  );
};

export default MentionTextField;
