import React, { useRef, useEffect, useState } from 'react';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  // Sync scroll position between textarea and overlay
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleScroll = () => {
      setScrollTop(textarea.scrollTop);
    };

    textarea.addEventListener('scroll', handleScroll);
    return () => textarea.removeEventListener('scroll', handleScroll);
  }, []);

  // Update overlay scroll when textarea scrolls
  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.scrollTop = scrollTop;
    }
  }, [scrollTop]);

  // Handle text change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Render text with highlighted @mentions
  const renderHighlightedText = (text: string) => {
    if (!text) return <span style={{ color: 'transparent' }}>{placeholder}</span>;
    
    // Match @word patterns (including underscores and numbers)
    const parts = text.split(/(@[\w]+)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        return (
          <span key={index} style={{ color: '#007AFF', fontWeight: 600 }}>
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Highlight overlay - exactly matches textarea */}
      <Box
        ref={overlayRef}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          p: '16.5px 14px',
          border: '1px solid transparent',
          borderRadius: '16px',
          pointerEvents: 'none',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          overflow: 'hidden',
          fontSize: '1rem',
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          lineHeight: '1.4375em',
          letterSpacing: '0.00938em',
          color: '#1D1D1F',
          zIndex: 1,
          boxSizing: 'border-box',
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
        inputRef={textareaRef}
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
            background: 'transparent',
            // Match the overlay exactly
            lineHeight: '1.4375em',
            '&::placeholder': {
              color: 'transparent',
              opacity: 0,
            },
          },
        }}
        {...rest}
      />
    </Box>
  );
};

export default MentionTextField;
