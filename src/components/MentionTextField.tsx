import React, { useEffect, useRef } from 'react';
import { Box, FormHelperText, TextField } from '@mui/material';

interface MentionTextFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  helperText?: React.ReactNode;
  rows?: number;
  characterNames?: string[];
  onCharacterMatched?: (characterName: string) => void;
}

const MentionTextField: React.FC<MentionTextFieldProps> = ({
  value,
  onChange,
  placeholder,
  error,
  helperText,
  rows = 3,
  characterNames = [],
  onCharacterMatched,
}) => {
  const prevMatchedRef = useRef<Set<string>>(new Set());

  // Detect newly matched characters and trigger callback
  useEffect(() => {
    if (!onCharacterMatched || characterNames.length === 0) return;
    
    const currentMatched = new Set<string>();
    
    for (const name of characterNames) {
      const regex = new RegExp(`(^|[\\s,\\.!\\?])${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=$|[\\s,\\.!\\?])`, 'i');
      if (regex.test(value)) {
        currentMatched.add(name);
        
        // If this is a new match (wasn't matched before), trigger callback
        if (!prevMatchedRef.current.has(name)) {
          onCharacterMatched(name);
        }
      }
    }
    
    prevMatchedRef.current = currentMatched;
  }, [value, characterNames, onCharacterMatched]);

  return (
    <Box>
      <TextField
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        error={error}
        multiline
        rows={rows}
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '16px',
            background: '#fff',
            '& fieldset': {
              borderColor: 'rgba(0,0,0,0.1)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0,122,255,0.3)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#007AFF',
              borderWidth: '2px',
            },
          },
          '& .MuiInputBase-input': {
            fontSize: '1rem',
            lineHeight: 1.5,
          },
        }}
      />
      {helperText && (
        <FormHelperText error={error} sx={{ mx: '14px', mt: '3px' }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
};

export default MentionTextField;
