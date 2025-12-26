import React, { useRef, useEffect } from 'react';
import { Box, FormHelperText } from '@mui/material';

interface MentionTextFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  helperText?: React.ReactNode;
  rows?: number;
  characterNames?: string[];
}

const MentionTextField: React.FC<MentionTextFieldProps> = ({
  value,
  onChange,
  placeholder,
  error,
  helperText,
  rows = 3,
  characterNames = [],
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastValueRef = useRef(value);

  // Update content when value changes externally (e.g., cleared or character added)
  useEffect(() => {
    if (editorRef.current && value !== lastValueRef.current) {
      let currentText = editorRef.current.innerText;
      // Normalize trailing newline
      if (currentText.endsWith('\n')) {
        currentText = currentText.slice(0, -1);
      }
      if (currentText !== value) {
        updateEditorContent(value);
      }
      lastValueRef.current = value;
    }
  }, [value]);

  // Also update when characterNames change (to re-highlight)
  useEffect(() => {
    if (editorRef.current && value) {
      updateEditorContent(value);
    }
  }, [characterNames]);

  const updateEditorContent = (text: string) => {
    if (!editorRef.current) return;
    
    // Save cursor position
    const selection = window.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    let cursorOffset = 0;
    
    if (range && editorRef.current.contains(range.startContainer)) {
      const preRange = document.createRange();
      preRange.selectNodeContents(editorRef.current);
      preRange.setEnd(range.startContainer, range.startOffset);
      cursorOffset = preRange.toString().length;
    }

    // Escape HTML
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Only highlight @mentions that exactly match a character name (case-insensitive)
    if (characterNames.length > 0) {
      html = html.replace(/(@[\w]+)/g, (match) => {
        const mentionName = match.slice(1).toLowerCase(); // Remove @ and lowercase
        const isMatch = characterNames.some(name => name.toLowerCase() === mentionName);
        if (isMatch) {
          return `<span style="color: #007AFF; font-weight: 600;">${match}</span>`;
        }
        return match;
      });
    }

    html = html.replace(/\n/g, '<br>');
    
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
    
    // innerText can have trailing newlines, normalize them
    let text = editorRef.current.innerText;
    // Remove trailing newline that contentEditable adds
    if (text.endsWith('\n')) {
      text = text.slice(0, -1);
    }
    lastValueRef.current = text;
    onChange(text);
    
    updateEditorContent(text);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const minHeight = rows * 24;

  return (
    <Box>
      <Box
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
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
            p: '15.5px 13px',
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
