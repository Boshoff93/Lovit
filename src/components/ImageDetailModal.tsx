import React, { useState, useCallback } from 'react';
import { saveAs } from 'file-saver';
import { 
  Dialog, 
  DialogContent, 
  Box, 
  Typography, 
  Chip, 
  useTheme,
  Snackbar,
  Alert
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CloseIcon from '@mui/icons-material/Close';
import CircularIconButton from './CircularIconButton';
import ImageShareDialog from './ImageShareDialog';
import { GeneratedImage } from '../store/gallerySlice';
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ImageDetailModalProps {
  open: boolean;
  onClose: () => void;
  selectedImage: GeneratedImage | null;
  onImageError: () => string;
}

const ImageDetailModal: React.FC<ImageDetailModalProps> = ({
  open,
  onClose,
  selectedImage,
  onImageError
}) => {
  const theme = useTheme();
  
  // State for share dialog
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  
  // Add state for snackbar notifications
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Function to show a snackbar notification
  const showNotification = useCallback((message: string, severity: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  }, []);

  // Function to handle image download
  const handleDownloadImage = useCallback(async (imageUrl: string | undefined, title: string | undefined) => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const filename = `${title || 'lovit-image'}-${Date.now()}.jpg`;
      saveAs(blob, filename);
      showNotification('Image download started');
    } catch (error: any) {
      console.error('Error downloading image:', error);
      showNotification(error.message, 'error');
    }
  }, [showNotification]);

  // Function to handle opening the share dialog
  const handleShareClick = useCallback(() => {
    setShareDialogOpen(true);
  }, []);

  // Function to handle closing the share dialog
  const handleShareClose = useCallback(() => {
    setShareDialogOpen(false);
  }, []);

  // Handle closing the snackbar
  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  // Function to copy image URL to clipboard
  const handleCopyImageUrl = useCallback(() => {
    if (!selectedImage?.imageUrl) return;
    
    navigator.clipboard.writeText(selectedImage.imageUrl)
      .then(() => {
        showNotification('Image URL copied to clipboard!');
      })
      .catch(err => {
        console.error('Error copying URL: ', err);
        showNotification('Failed to copy URL', 'error');
      });
  }, [selectedImage, showNotification]);

  // Function to open platform app/website
  const handleOpenPlatform = useCallback((platform: string) => {
    let platformUrl = '';
    
    switch (platform) {
      case 'instagram':
        platformUrl = 'https://www.instagram.com/';
        break;
      case 'tiktok':
        platformUrl = 'https://www.tiktok.com/upload/';
        break;
      default:
        break;
    }
    
    if (platformUrl) {
      window.open(platformUrl, '_blank', 'noopener,noreferrer');
    }
  }, []);

  // Function to handle sharing to various platforms
  const handleShare = useCallback((platform: string) => {
    if (!selectedImage?.imageUrl) return;
    
    const shareUrl = selectedImage.imageUrl;
    const shareTitle = selectedImage.title || 'Check out this fashion look';
    
    let shareLink = '';
    
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
        break;
      case 'pinterest':
        shareLink = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareTitle)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl)
          .then(() => {
            showNotification('Link copied to clipboard!');
          })
          .catch(err => {
            console.error('Error copying link: ', err);
            showNotification('Failed to copy link', 'error');
          });
        return;
      default:
        break;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank', 'noopener,noreferrer');
    }
  }, [selectedImage, showNotification]);

  const handleShopTheLook = useCallback(() => {
    if (selectedImage?.imageUrl) {
      // Use Google Lens URL format that opens the side panel
      window.location.assign(`https://lens.google.com/uploadbyurl?url=${encodeURIComponent(selectedImage.imageUrl)}&ep=gisbubu&hl=en`);
    }
  }, [selectedImage?.imageUrl]);

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
        onClick={useCallback((e: React.MouseEvent<HTMLDivElement>) => {
          // This ensures clicks anywhere outside the content container will close the modal
          const target = e.target as HTMLElement;
          if (target.classList.contains('MuiDialog-container')) {
            onClose();
          }
        }, [onClose])}
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            overflow: 'hidden' // Prevent scrolling in the dialog
          }
        }}
      >
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 0,
            overflow: 'hidden',
            height: '100vh',
            position: 'relative'
          }}
        >
          {selectedImage && (
            <Box sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: { xs: 2, sm: 4 }
            }}>
              {/* Background blur effect */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `url(${selectedImage?.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'blur(30px)',
                  transform: 'scale(1.2)',
                  opacity: 0.3,
                }}
              />
              
              {/* Clickable backdrop - this will close the modal when clicked */}
              <Box
                onClick={onClose}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 5,
                  cursor: 'pointer'
                }}
              />
              
              {/* Main content container */}
              <Box 
                sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  maxWidth: '90%',
                  maxHeight: '90%',
                  position: 'relative',
                  zIndex: 10,
                  borderRadius: 3,
                  overflow: 'hidden',
                  backgroundColor: 'background.paper',
                  p: 2,
                  boxShadow: '0 10px 20px rgba(238, 217, 182, 0.2)'
                }}
              >
                {/* Image */}
                <Box sx={{ 
                  flexGrow: 1, 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  overflow: 'hidden',
                  mb: 2,
                  position: 'relative'
                }}>
                  <img
                    src={selectedImage?.imageUrl}
                    alt={selectedImage?.title || 'Full-size image'}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '70vh',
                      objectFit: 'contain',
                      display: 'block',
                      borderRadius: '8px'
                    }}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.src = onImageError();
                    }}
                  />
                </Box>
                
                {/* Title and tags below the image */}
                <Box sx={{ 
                  width: '100%',
                  p: 2,
                  backgroundColor: 'primary.main',
                  borderRadius: 2
                }}>
                  <Typography variant="h5" sx={{ color: '#faf4e9', mb: 2 }}>
                    {selectedImage?.title}
                  </Typography>
                  
                  {selectedImage?.dripRating && selectedImage.dripRating.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selectedImage.dripRating.map((tag, idx) => (
                        <Chip
                          key={idx}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            height: 24,
                            ml: 0.5,
                            mb: 0.5,
                            color: theme.palette.primary.main,
                            borderColor: theme.palette.secondary.light
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
                
                {/* Buttons row */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mt: 2,
                  width: '100%'
                }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {/* Download button */}
                    <CircularIconButton
                      variant="outlined"
                      icon={<DownloadIcon />}
                      textLabel="Download"
                      onClick={() => handleDownloadImage(selectedImage?.imageUrl, selectedImage?.title)}
                    />
                    
                    {/* Share button */}
                    <CircularIconButton
                      variant="outlined"
                      icon={<ShareIcon />}
                      textLabel="Share"
                      onClick={handleShareClick}
                    />
                    
                    {/* Shop the look button */}
                    <CircularIconButton
                      variant="outlined"
                      icon={<ShoppingBagIcon />}
                      textLabel="Shop the Look"
                      onClick={handleShopTheLook}
                    />
                  </Box>
                  
                  {/* Close button */}
                  <CircularIconButton
                    variant="contained"
                    icon={<CloseIcon />}
                    textLabel="Close"
                    onClick={onClose}
                  />
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Share Dialog */}
      <ImageShareDialog
        open={shareDialogOpen}
        onClose={handleShareClose}
        imageUrl={selectedImage?.imageUrl}
        imageTitle={selectedImage?.title}
        onCopyUrl={handleCopyImageUrl}
        onDownload={handleDownloadImage}
        onOpenPlatform={handleOpenPlatform}
        onShare={handleShare}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          mt: 4
        }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ImageDetailModal; 