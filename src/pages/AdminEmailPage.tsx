import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { API_BASE_URL } from '../config';

const AdminEmailPage: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [userIds, setUserIds] = useState('');
  const [productId, setProductId] = useState('');
  const [priceId, setPriceId] = useState('');
  const [emailHtml, setEmailHtml] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const handleSendEmail = async () => {
    setLoading(true);
    try {
      const userIdList = userIds.split(',').map(id => id.trim());
      
      const response = await fetch(`${API_BASE_URL}/api/send-retargeting-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userIds: userIdList,
          productId,
          priceId,
          emailHtml
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send emails');
      }

      setSnackbar({
        open: true,
        message: 'Emails sent successfully!',
        severity: 'success'
      });

      // Clear form
      setUserIds('');
      setProductId('');
      setPriceId('');
      setEmailHtml('');
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to send emails',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setConfirmDialogOpen(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Email Management
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <TextField
              fullWidth
              label="User IDs (comma-separated)"
              value={userIds}
              onChange={(e) => setUserIds(e.target.value)}
              multiline
              rows={4}
              placeholder="Enter user IDs separated by commas"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Product ID"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                placeholder="e.g., prod_xyz123"
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Price ID"
                value={priceId}
                onChange={(e) => setPriceId(e.target.value)}
                placeholder="e.g., price_xyz123"
              />
            </Box>
          </Box>

          <Box>
            <TextField
              fullWidth
              label="Email HTML Template"
              value={emailHtml}
              onChange={(e) => setEmailHtml(e.target.value)}
              multiline
              rows={10}
              placeholder="Enter email HTML template"
            />
          </Box>

          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setConfirmDialogOpen(true)}
              disabled={!userIds || !productId || !priceId || loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Send Emails'}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Email Send</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to send retargeting emails to these users?
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            Number of recipients: {userIds.split(',').filter(id => id.trim()).length}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSendEmail} color="primary" variant="contained">
            Confirm Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminEmailPage; 