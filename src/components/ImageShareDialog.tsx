import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  Box, 
  Typography, 
  Button,
  IconButton,
  Grid,
  useTheme
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CloseIcon from '@mui/icons-material/Close';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/X';
import PinterestIcon from '@mui/icons-material/Pinterest';
import InstagramIcon from '@mui/icons-material/Instagram';
import TikTokIcon from '@mui/icons-material/MusicNote';
import LinkIcon from '@mui/icons-material/Link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface ImageShareDialogProps {
  open: boolean;
  onClose: () => void;
  imageUrl?: string;
  imageTitle?: string;
  onCopyUrl: () => void;
  onDownload: (imageUrl?: string, title?: string) => void;
  onOpenPlatform: (platform: string) => void;
  onShare: (platform: string) => void;
}

const ImageShareDialog: React.FC<ImageShareDialogProps> = ({
  open,
  onClose,
  imageUrl,
  imageTitle,
  onCopyUrl,
  onDownload,
  onOpenPlatform,
  onShare
}) => {
  const theme = useTheme();
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const shareOptions = [
    { id: 'facebook', icon: <FacebookIcon />, label: 'Facebook', color: '#1877F2' },
    { id: 'twitter', icon: <TwitterIcon />, label: 'X', color: '#000' },
    { id: 'pinterest', icon: <PinterestIcon />, label: 'Pinterest', color: '#E60023' },
    { id: 'instagram', icon: <InstagramIcon />, label: 'Instagram', color: '#E4405F' },
    { id: 'tiktok', icon: <TikTokIcon />, label: 'TikTok', color: '#000' },
    { id: 'copy', icon: <LinkIcon />, label: 'Copy Link', color: theme.palette.primary.main }
  ];

  const handleShareClick = (platform: string) => {
    if (platform === 'instagram' || platform === 'tiktok') {
      setSelectedPlatform(platform);
    } else {
      onShare(platform);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedPlatform(null);
    onClose();
  };

  const renderMainContent = () => (
    <>
      <Typography variant="h5" sx={{ mb: 1, textAlign: 'center', color: 'primary.main', fontWeight: 700 }}>
        Share Image
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {shareOptions.map((option) => (
          <Grid size={{ xs: 12, sm: 4 }} key={option.id}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={option.icon}
              onClick={() => handleShareClick(option.id)}
              sx={{
                borderRadius: 2,
                py: 1.5,
                borderColor: option.color,
                color: option.color,
                '&:hover': {
                  borderColor: option.color,
                  backgroundColor: `${option.color}15`,
                }
              }}
            >
              {option.label}
            </Button>
          </Grid>
        ))}
      </Grid>
    </>
  );

  const renderPlatformInstructions = () => (
    <>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        width: '100%',
        mb: 2
      }}>
        <IconButton 
          onClick={() => setSelectedPlatform(null)}
          sx={{ 
            mr: 2,
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.light'
            }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 700 }}>
          Share on {selectedPlatform === 'instagram' ? 'Instagram' : 'TikTok'}
        </Typography>
      </Box>
      
      <Box sx={{ 
        border: '1.5px solid', 
        borderColor: 'secondary.main', 
        borderRadius: 2, 
        p: 2, 
        bgcolor: 'secondary.light',
        width: '100%'
      }}>
        <Typography variant="body1" sx={{ mb: 2, color: 'text.primary', fontWeight: 500 }}>
          {selectedPlatform === 'instagram' 
            ? 'Instagram doesn\'t allow direct link sharing. To share this image:' 
            : 'TikTok doesn\'t allow direct link sharing. To share this image:'}
        </Typography>
        
        <Box component="ol" sx={{ pl: 2 }}>
          <Typography component="li" sx={{ mb: 1, color: 'text.secondary', fontWeight: 500 }}>
            Copy the image URL
          </Typography>
          <Typography component="li" sx={{ mb: 1, color: 'text.secondary', fontWeight: 500 }}>
            Open {selectedPlatform === 'instagram' ? 'Instagram' : 'TikTok'}
          </Typography>
          <Typography component="li" sx={{ mb: 1, color: 'text.secondary', fontWeight: 500 }}>
            {selectedPlatform === 'instagram' 
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
          onClick={() => onOpenPlatform(selectedPlatform!)}
          size="small"
          sx={{ 
            borderRadius: 2,
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
          }}
        >
          Open {selectedPlatform === 'instagram' ? 'Instagram' : 'TikTok'}
        </Button>
      </Box>
    </>
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
          {selectedPlatform ? renderPlatformInstructions() : renderMainContent()}
          
          {!selectedPlatform && (
            <Button 
              onClick={handleClose}
              variant="contained"
              size="small"
              startIcon={<CloseIcon />}
              sx={{ 
                mt: 2, 
                borderRadius: 2,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
              }}
            >
              Close
            </Button>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ImageShareDialog; 