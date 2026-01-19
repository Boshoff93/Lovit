import React, { useEffect, useRef } from 'react';
import { Box, FormHelperText, TextField, IconButton, CircularProgress, Typography, Tooltip, Divider } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CasinoIcon from '@mui/icons-material/Casino';

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
  // Gruvi Roulette props
  rouletteMode?: boolean;
  onRouletteToggle?: (enabled: boolean) => void;
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
  rouletteMode = false,
  onRouletteToggle,
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
      {rouletteMode ? (
        // Roulette mode - show confidence UI
        <Box
          sx={{
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(0,122,255,0.08) 0%, rgba(88,86,214,0.08) 50%, rgba(255,45,85,0.08) 100%)',
            border: '2px solid transparent',
            backgroundClip: 'padding-box',
            position: 'relative',
            p: 3,
            minHeight: rows * 24 + 32,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              borderRadius: '16px',
              padding: '2px',
              background: 'linear-gradient(135deg, #007AFF, #5856D6, #FF2D55)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            },
            '&:hover': {
              transform: 'scale(1.01)',
            },
          }}
          onClick={() => onRouletteToggle?.(false)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <CasinoIcon sx={{ fontSize: 32, color: '#5856D6' }} />
            <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>
              Gruvi Roulette Active
            </Typography>
          </Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', textAlign: 'center', maxWidth: 320 }}>
            We'll create an epic video concept based on your track. Sit back and let the magic happen!
          </Typography>
          <Typography sx={{ color: '#007AFF', fontSize: '0.75rem', mt: 2, fontWeight: 500 }}>
            Click to enter your own prompt instead
          </Typography>
        </Box>
      ) : (
        // Normal text field with integrated bottom bar
        <Box
          sx={{
            borderRadius: '16px',
            background: 'rgba(255,255,255,0.05)',
            border: error ? '2px solid #f44336' : value.trim() ? '2px solid #007AFF' : '1px solid rgba(255,255,255,0.1)',
            overflow: 'hidden',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: error ? '#f44336' : value.trim() ? '#007AFF' : 'rgba(0,122,255,0.3)',
              background: 'rgba(255,255,255,0.08)',
            },
            '&:focus-within': {
              borderColor: error ? '#f44336' : '#007AFF',
              borderWidth: '2px',
            },
          }}
        >
          {/* Text input area */}
          <TextField
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            multiline
            rows={rows}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 0,
                background: 'transparent',
                '& fieldset': {
                  border: 'none',
                },
                '&:hover fieldset': {
                  border: 'none',
                },
                '&.Mui-focused fieldset': {
                  border: 'none',
                },
              },
              '& .MuiInputBase-input': {
                fontSize: '1rem',
                lineHeight: 1.5,
                color: '#fff',
                '&::placeholder': {
                  color: 'rgba(255,255,255,0.5)',
                  opacity: 1,
                },
              },
            }}
          />

          {/* Bottom bar with divider */}
          {onRouletteToggle && (
            <>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 2,
                  py: 1.5,
                }}
              >
                {/* Left side - helper text or empty */}
                <Box sx={{ flex: 1 }}>
                  {helperText && (
                    <FormHelperText error={error} sx={{ m: 0, color: error ? '#f44336' : 'rgba(255,255,255,0.5)' }}>
                      {helperText}
                    </FormHelperText>
                  )}
                </Box>

                {/* Right side - buttons */}
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  {onEnhance && value.trim() && (
                    <IconButton
                      onClick={onEnhance}
                      disabled={isEnhancing}
                      size="small"
                      title="Enhance with AI"
                      sx={{
                        background: 'transparent',
                        border: '1.5px solid #007AFF',
                        borderRadius: '20px',
                        px: 1.5,
                        py: 0.5,
                        gap: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                          borderColor: 'transparent',
                          '& .enhance-icon, & .enhance-text': {
                            color: '#fff',
                          },
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
                        <AutoAwesomeIcon className="enhance-icon" sx={{ fontSize: 14, color: '#007AFF', transition: 'color 0.2s ease' }} />
                      )}
                      <Box
                        component="span"
                        className="enhance-text"
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#007AFF',
                          transition: 'color 0.2s ease',
                        }}
                      >
                        Enhance
                      </Box>
                    </IconButton>
                  )}

                  <Tooltip
                    title={
                      <Box sx={{ p: 0.5, textAlign: 'center' }}>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', mb: 0.5, color: '#fff' }}>
                          Feeling lucky?
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.9)' }}>
                          Let Gruvi AI pick for you
                        </Typography>
                      </Box>
                    }
                    arrow
                    placement="top"
                    componentsProps={{
                      tooltip: {
                        sx: {
                          background: 'linear-gradient(135deg, #5856D6 0%, #FF2D55 100%)',
                          borderRadius: '12px',
                          px: 2,
                          py: 1.5,
                          maxWidth: 220,
                          '& .MuiTooltip-arrow': {
                            color: '#5856D6',
                          },
                        },
                      },
                    }}
                  >
                    <Box
                      onClick={() => onRouletteToggle(true)}
                      sx={{
                        background: '#5856D6',
                        border: 'none',
                        borderRadius: '20px',
                        px: 1.5,
                        py: 0.5,
                        gap: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5856D6 0%, #FF2D55 100%)',
                          '& .roulette-icon, & .roulette-text': {
                            color: '#fff',
                          },
                        },
                      }}
                    >
                      <CasinoIcon className="roulette-icon" sx={{ fontSize: 14, color: '#fff', transition: 'color 0.2s ease' }} />
                      <Box
                        component="span"
                        className="roulette-text"
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#fff',
                          transition: 'color 0.2s ease',
                        }}
                      >
                        Gruvi Roulette
                      </Box>
                    </Box>
                  </Tooltip>
                </Box>
              </Box>
            </>
          )}
        </Box>
      )}

      {/* Helper text outside the box when no roulette toggle */}
      {!rouletteMode && !onRouletteToggle && helperText && (
        <FormHelperText error={error} sx={{ mx: '14px', mt: 1 }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
};

export default MentionTextField;
