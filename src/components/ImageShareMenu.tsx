import React from 'react';
import { 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText 
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/X';
import PinterestIcon from '@mui/icons-material/Pinterest';
import InstagramIcon from '@mui/icons-material/Instagram';
import TikTokIcon from '@mui/icons-material/MusicNote';
import LinkIcon from '@mui/icons-material/Link';

interface ImageShareMenuProps {
  anchorEl: null | HTMLElement;
  open: boolean;
  onClose: () => void;
  onShare: (platform: string) => void;
}

const ImageShareMenu: React.FC<ImageShareMenuProps> = ({
  anchorEl,
  open,
  onClose,
  onShare
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <MenuItem onClick={() => onShare('facebook')}>
        <ListItemIcon>
          <FacebookIcon fontSize="medium" sx={{ color: '#1877F2' }} />
        </ListItemIcon>
        <ListItemText>Facebook</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => onShare('twitter')}>
        <ListItemIcon>
          <TwitterIcon fontSize="medium" sx={{ color: '#000' }} />
        </ListItemIcon>
        <ListItemText>X</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => onShare('pinterest')}>
        <ListItemIcon>
          <PinterestIcon fontSize="medium" sx={{ color: '#E60023' }} />
        </ListItemIcon>
        <ListItemText>Pinterest</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => onShare('instagram')}>
        <ListItemIcon>
          <InstagramIcon fontSize="medium" sx={{ color: '#E4405F' }} />
        </ListItemIcon>
        <ListItemText>Instagram</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => onShare('tiktok')}>
        <ListItemIcon>
          <TikTokIcon fontSize="medium" sx={{ color: '#000' }} />
        </ListItemIcon>
        <ListItemText>TikTok</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => onShare('copy')}>
        <ListItemIcon>
          <LinkIcon fontSize="medium" />
        </ListItemIcon>
        <ListItemText>Copy Link</ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default ImageShareMenu; 