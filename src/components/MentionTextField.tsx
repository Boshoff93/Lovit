import React, { useRef, useEffect } from 'react';
import { Box, FormHelperText } from '@mui/material';

interface MentionTextFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  helperText?: React.ReactNode;
  rows?: number;
}

const MentionTextField: React.FC<MentionTextFieldProps> = ({
  value,
  onChange,
  placeholder,
  error,
  helperText,
  rows = 3,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastValueRef = useRef(value);

  // Update content when value changes externally (e.g., cleared)
  useEffect(() => {
    if (editorRef.current && value !== lastValueRef.current) {
      // Only update if it's an external change (like clearing the field)
      const currentText = editorRef.current.innerText;
      if (currentText !== value) {
        updateEditorContent(value);
      }
      lastValueRef.current = value;
    }
  }, [value]);

  const updateEditorContent = (text: string) => {
    if (!editorRef.current) return;
    
    // Save cursor position
    const selection = window.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    let cursorOffset = 0;
    
    if (range && editorRef.current.contains(range.startContainer)) {
      // Calculate cursor offset from start
      const preRange = document.createRange();
      preRange.selectNodeContents(editorRef.current);
      preRange.setEnd(range.startContainer, range.startOffset);
      cursorOffset = preRange.toString().length;
    }

    // Build HTML with highlighted @mentions
    const html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/(@[\w]+)/g, '<span style="color: #007AFF; font-weight: 600;">$1</span>')
      .replace(/\n/g, '<br>');
    
    editorRef.current.innerHTML = html || '';
    
    // Restore cursor position
    if (range && cursorOffset > 0) {
      try {
        const newRange = document.createRange();
        let charCount = 0;
        let found = false;

        const walkNodes = (node: Node): boolean => {
          if (node.nodeType === Node.TEXT_NODE) {
            const textLength = node.textContent?.length || 0;
            if (charCount + textLength >= cursorOffset) {
              newRange.setStart(node, cursorOffset - charCount);
              newRange.collapse(true);
              found = true;
              return true;
            }
            charCount += textLength;
          } else {
            for (const child of Array.from(node.childNodes)) {
              if (walkNodes(child)) return true;
            }
          }
          return false;
        };

        walkNodes(editorRef.current);
        
        if (found) {
          selection?.removeAllRanges();
          selection?.addRange(newRange);
        }
      } catch (e) {
        // Cursor restoration failed, that's okay
      }
    }
  };

  const handleInput = () => {
    if (!editorRef.current) return;
    
    const text = editorRef.current.innerText;
    lastValueRef.current = text;
    onChange(text);
    
    // Re-render with highlights
    updateEditorContent(text);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Allow Enter for new lines
    if (e.key === 'Enter' && !e.shiftKey) {
      // Let it create a new line naturally
    }
  };

  const minHeight = rows * 24; // Approximate line height

  return (
    <Box>
      <Box
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        sx={{
          minHeight: `${minHeight}px`,
          p: '16.5px 14px',
          borderRadius: '16px',
          border: error ? '1px solid #d32f2f' : '1px solid rgba(0,0,0,0.1)',
          background: '#fff',
          fontSize: '1rem',
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          lineHeight: 1.5,
          outline: 'none',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          transition: 'border-color 0.2s',
          '&:hover': {
            borderColor: error ? '#d32f2f' : 'rgba(0,122,255,0.3)',
          },
          '&:focus': {
            borderColor: error ? '#d32f2f' : '#007AFF',
            borderWidth: '2px',
            p: '15.5px 13px', // Adjust for thicker border
          },
          '&:empty::before': {
            content: 'attr(data-placeholder)',
            color: 'rgba(0,0,0,0.4)',
            pointerEvents: 'none',
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
