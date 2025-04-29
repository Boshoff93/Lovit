import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  Box, 
  Typography, 
  Button,
  IconButton 
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CloseIcon from '@mui/icons-material/Close';

interface ImageShareDialogProps {
  open: boolean;
  onClose: () => void;
  platform: string;
  imageUrl?: string;
  imageTitle?: string;
  onCopyUrl: () => void;
  onDownload: (imageUrl?: string, title?: string) => void;
  onOpenPlatform: (platform: string) => void;
}

const ImageShareDialog: React.FC<ImageShareDialogProps> = ({
  open,
  onClose,
  platform,
  imageUrl,
  imageTitle,
  onCopyUrl,
  onDownload,
  onOpenPlatform
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 1,
          backgroundColor: 'background.paper',
          boxShadow: '0 8px 20px rgba(43, 45, 66, 0.15)',
        }
      }}
    >
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5" sx={{ mb: 1, textAlign: 'center', color: 'primary.main', fontWeight: 700 }}>
            Share on {platform === 'instagram' ? 'Instagram' : 'TikTok'}
          </Typography>
          
          <Box sx={{ 
            border: '1.5px solid', 
            borderColor: 'secondary.main', 
            borderRadius: 2, 
            p: 2, 
            bgcolor: 'secondary.light',
            width: '100%'
          }}>
            <Typography variant="body1" sx={{ mb: 2, color: 'text.primary', fontWeight: 500 }}>
              {platform === 'instagram' 
                ? 'Instagram doesn\'t allow direct link sharing. To share this image:' 
                : 'TikTok doesn\'t allow direct link sharing. To share this image:'}
            </Typography>
            
            <Box component="ol" sx={{ pl: 2 }}>
              <Typography component="li" sx={{ mb: 1, color: 'text.secondary', fontWeight: 500 }}>
                Copy the image URL
              </Typography>
              <Typography component="li" sx={{ mb: 1, color: 'text.secondary', fontWeight: 500 }}>
                Open {platform === 'instagram' ? 'Instagram' : 'TikTok'}
              </Typography>
              <Typography component="li" sx={{ mb: 1, color: 'text.secondary', fontWeight: 500 }}>
                {platform === 'instagram' 
                  ? 'Create a new post and paste the URL or download the image and upload it'
                  : 'Create a new video and paste the URL or download the image to use it'}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 2 }, 
            mt: 1, 
            width: '100%', 
            justifyContent: 'center' 
          }}>
            <Button 
              variant="outlined" 
              startIcon={<ContentCopyIcon />}
              onClick={onCopyUrl}
              size="small"
              sx={{ 
                borderRadius: 2,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
              }}
            >
              Copy URL
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => onDownload(imageUrl, imageTitle)}
              size="small"
              sx={{ 
                borderRadius: 2,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
              }}
            >
              Download
            </Button>
            
            <Button 
              variant="contained" 
              startIcon={<OpenInNewIcon />}
              onClick={() => onOpenPlatform(platform)}
              size="small"
              sx={{ 
                borderRadius: 2,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
              }}
            >
              Open {platform === 'instagram' ? 'Instagram' : 'TikTok'}
            </Button>
          </Box>
          
          <Button 
            onClick={onClose}
            variant="contained"
            size="small"
            startIcon={<CloseIcon />}
            sx={{ 
              mt: 2, 
              borderRadius: 2,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            }}
          >
            Cancel
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ImageShareDialog; 