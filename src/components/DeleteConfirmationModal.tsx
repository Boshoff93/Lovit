import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { GhostButton } from './GhostButton';

interface DeleteConfirmationModalProps {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  title,
  message,
  onClose,
  onConfirm,
  isDeleting = false
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          bgcolor: '#141418',
          maxWidth: 400,
        }
      }}
    >
      <DialogTitle id="delete-dialog-title" sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            bgcolor: 'rgba(255,59,48,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <DeleteIcon sx={{ fontSize: 24, color: '#FF3B30' }} />
          </Box>
          <Typography sx={{ fontWeight: 600, fontSize: '1.25rem', color: '#fff' }}>{title}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
        <GhostButton
          onClick={onClose}
          disabled={isDeleting}
          sx={{ flex: 1, py: 1.25 }}
        >
          Cancel
        </GhostButton>
        <Button
          onClick={onConfirm}
          variant="contained"
          autoFocus
          disabled={isDeleting}
          fullWidth
          sx={{
            flex: 1,
            py: 1.25,
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #FF3B30 0%, #FF6B6B 100%)',
            boxShadow: '0 4px 12px rgba(255, 59, 48, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #E53528 0%, #FF5252 100%)',
              boxShadow: '0 6px 16px rgba(255, 59, 48, 0.4)',
            },
            '&:disabled': { opacity: 0.7 },
          }}
        >
          {isDeleting ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
