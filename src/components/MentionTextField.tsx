import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Paper, Typography, TextFieldProps } from '@mui/material';

interface Character {
  characterId: string;
  characterName: string;
  imageUrls?: string[];
}

interface MentionTextFieldProps extends Omit<TextFieldProps, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
  characters: Character[];
  isLoadingCharacters?: boolean;
}

const MentionTextField: React.FC<MentionTextFieldProps> = ({
  value,
  onChange,
  characters,
  isLoadingCharacters = false,
  placeholder,
  error,
  helperText,
  rows = 3,
  ...rest
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Handle text change with @ detection
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const selectionStart = e.target.selectionStart || 0;
    
    onChange(newValue);
    setCursorPosition(selectionStart);
    
    // Check if user just typed @ or is typing after @
    const textBeforeCursor = newValue.slice(0, selectionStart);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1);
      // Show suggestions if there's no space after @ (still typing the mention)
      if (!textAfterAt.includes(' ')) {
        setSearchQuery(textAfterAt.toLowerCase());
        setShowSuggestions(true);
        return;
      }
    }
    setShowSuggestions(false);
    setSearchQuery('');
  };

  // Insert character from autocomplete
  const insertCharacter = (name: string) => {
    const textBeforeCursor = value.slice(0, cursorPosition);
    const textAfterCursor = value.slice(cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const newText = textBeforeCursor.slice(0, lastAtIndex) + `@${name} ` + textAfterCursor;
      onChange(newText);
    } else {
      onChange(value + `@${name} `);
    }
    
    setShowSuggestions(false);
    setSearchQuery('');
    
    // Focus back on textarea
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // Filter characters based on search query
  const filteredCharacters = characters.filter(char => 
    char.characterName.toLowerCase().includes(searchQuery)
  );

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
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
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
      
      {/* Character suggestions popup */}
      {showSuggestions && filteredCharacters.length > 0 && (
        <Paper
          elevation={8}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 0.5,
            zIndex: 1000,
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(0,0,0,0.1)',
            maxHeight: 200,
            overflowY: 'auto',
          }}
        >
          <Box sx={{ p: 1 }}>
            <Typography variant="caption" sx={{ color: '#86868B', px: 1, display: 'block', mb: 0.5 }}>
              Select a character
            </Typography>
            {filteredCharacters.slice(0, 5).map((char) => (
              <Box
                key={char.characterId}
                onClick={() => insertCharacter(char.characterName)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(0,122,255,0.08)',
                  },
                }}
              >
                {char.imageUrls?.[0] ? (
                  <Box
                    component="img"
                    src={char.imageUrls[0]}
                    alt={char.characterName}
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      borderRadius: '8px', 
                      objectFit: 'cover',
                      border: '1px solid rgba(0,0,0,0.1)',
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '8px',
                      backgroundColor: 'rgba(0,122,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography sx={{ color: '#007AFF', fontWeight: 600, fontSize: '0.8rem' }}>
                      {char.characterName.charAt(0).toUpperCase()}
                    </Typography>
                  </Box>
                )}
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#1D1D1F' }}>
                    @{char.characterName}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default MentionTextField;

