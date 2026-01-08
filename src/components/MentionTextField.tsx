import React, { useEffect, useRef } from 'react';
import { Box, FormHelperText, TextField, IconButton, CircularProgress } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface MentionTextFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  helperText?: React.ReactNode;
  rows?: number;
  characterNames?: string[];
  onCharacterMatched?: (characterName: string) => void;
  // AI Enhance button props
  onEnhance?: () => void;
  isEnhancing?: boolean;
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
  onEnhance,
  isEnhancing = false,
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
      {/* Bottom row: helper text and/or enhance button */}
      {(helperText || (onEnhance && value.trim())) && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          {helperText ? (
            <FormHelperText error={error} sx={{ mx: '14px', mt: 0 }}>
              {helperText}
            </FormHelperText>
          ) : (
            <Box />
          )}
          {onEnhance && value.trim() && (
            <IconButton
              onClick={onEnhance}
              disabled={isEnhancing}
              size="small"
              title="Enhance with AI"
              sx={{
                background: 'linear-gradient(135deg, rgba(0,122,255,0.1) 0%, rgba(147,51,234,0.1) 100%)',
                border: '1px solid',
                borderColor: 'rgba(0,122,255,0.3)',
                borderRadius: '20px',
                px: 1.5,
                py: 0.5,
                gap: 0.5,
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(0,122,255,0.15) 0%, rgba(147,51,234,0.15) 100%)',
                  borderColor: 'rgba(0,122,255,0.5)',
                  transform: 'scale(1.02)',
                },
                '&.Mui-disabled': {
                  background: 'rgba(0,0,0,0.04)',
                  borderColor: 'rgba(0,0,0,0.1)',
                },
              }}
            >
              {isEnhancing ? (
                <CircularProgress size={14} sx={{ color: '#007AFF' }} />
              ) : (
                <AutoAwesomeIcon sx={{ fontSize: 14, color: '#007AFF' }} />
              )}
              <Box
                component="span"
                sx={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: '#007AFF',
                  letterSpacing: '0.02em',
                }}
              >
                Enhance
              </Box>
            </IconButton>
          )}
        </Box>
      )}
    </Box>
  );
};

export default MentionTextField;
