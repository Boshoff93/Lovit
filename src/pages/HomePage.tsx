import React, { useState } from 'react';
import { 
  Typography, 
  Button, 
  Box, 
  Card, 
  CardContent, 
  CardMedia, 
  Stack,
  Container,
  Paper,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GoogleIcon from '@mui/icons-material/Google';
import CloseIcon from '@mui/icons-material/Close';
import { authService } from '../services/auth';

const featureItems = [
  {
    title: "Create your own AI model",
    description: "Upload just 10-20 photos and create a lifelike AI model that captures your unique look in just 1-2 hours.",
    image: "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
  },
  {
    title: "Try on any clothes",
    description: "Upload screenshots from any online store and instantly see yourself wearing those outfits.",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
  },
  {
    title: "Generate amazing photos",
    description: "Create professional quality photoshoots in any style, setting or lighting with just a prompt.",
    image: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
  },
];

const testimonials = [
  {
    quote: "Lovit saved us thousands on professional photoshoots for our online store. Our conversion rates are up 23%!",
    author: "Sarah J., Shopify Store Owner",
  },
  {
    quote: "I can see exactly how clothes will look on me before renting them. No more surprises or returns!",
    author: "Michael T., Fashion Enthusiast",
  },
];

const benefitItems = [
  "No more expensive photoshoots",
  "Try before you buy or rent",
  "Create content for social media",
  "Perfect for e-commerce stores",
  "Save time and money"
];

const galleryImages = [
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
  "https://images.unsplash.com/photo-1496440737103-cd596325d314?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
  "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-4.0.3&auto=format&fit=crop&w=686&q=80"
];

const HomePage: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
    // Reset form state when opening the dialog
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setUsername('');
    setError(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEmailSignup = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!email || !password || !username) {
        setError('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      // Call signup API using auth service
      const response = await authService.signupWithEmail(email, password, username);
      
      // Store authentication data
      authService.storeAuthData(response);

      setIsLoading(false);
      handleClose();
      showSnackbar('Account created successfully! Please check your email to verify your account.');
      
      // Redirect to payment page after signup
      navigate('/payment');
    } catch (error: any) {
      setIsLoading(false);
      if (error.response) {
        setError(error.response.data.error || 'Signup failed. Please try again.');
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get Google ID token
      const idToken = await authService.signInWithGoogle();
      
      // Send token to backend
      const response = await authService.loginWithGoogle(idToken);
      
      // Store authentication data
      authService.storeAuthData(response);
      
      setIsLoading(false);
      handleClose();
      showSnackbar('Signed in with Google successfully!');
      
      // Redirect to payment page after signup
      navigate('/payment');
    } catch (error: any) {
      setIsLoading(false);
      console.error('Google sign-in error:', error);
      
      if (error.error === 'popup_closed_by_user') {
        setError('Google sign-in was cancelled. Please try again.');
      } else if (error.response) {
        setError(error.response.data.error || 'Google sign-in failed. Please try again.');
      } else {
        setError('Google sign-in failed. Please try again or use email signup.');
      }
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ 
        py: { xs: 8, md: 12 }, 
        textAlign: 'center',
        background: 'linear-gradient(to right, rgba(147, 112, 219, 0.1), rgba(147, 112, 219, 0.2))',
        borderRadius: { xs: 0, md: '0 0 30px 30px' }
      }}>
        <Container maxWidth="md">
          {/* Logo/Image above slogan */}
          <Box 
            component="img"
            src="/lovit.jpeg" // Using existing image from public folder
            alt="Lovit Logo"
            sx={{
              width: { xs: '180px', md: '220px' },
              height: 'auto',
              mb: 4,
              borderRadius: '50%'
            }}
          />
          
          <Typography 
            variant="h1" 
            component="h1" 
            sx={{ 
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 800,
              mb: 2
            }}
          >
            Try it, Love it, Buy it
          </Typography>
          
          <Typography 
            variant="h5" 
            color="text.secondary" 
            sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}
          >
            See yourself in any outfit before you buy or rent it, using our lifelike AI technology
          </Typography>
          
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={handleClickOpen}
            endIcon={<ArrowForwardIcon />}
            sx={{ 
              py: 1.5,
              px: 4,
              fontSize: '1.1rem',
              borderRadius: 2
            }}
          >
            Try it, Lovit!
          </Button>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Setup in minutes
          </Typography>
        </Container>
      </Box>
      
      {/* Signup Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>
          Sign Up for Lovit
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              autoFocus
              margin="dense"
              id="username"
              label="Username"
              type="text"
              fullWidth
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              id="email"
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              id="password"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
            />
            <TextField
              margin="dense"
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              fullWidth
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button 
              fullWidth 
              variant="contained" 
              color="primary"
              onClick={handleEmailSignup}
              disabled={isLoading}
              sx={{ mb: 2, py: 1.5 }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Sign up with Email'}
            </Button>
            <Button 
              fullWidth 
              variant="outlined" 
              startIcon={<GoogleIcon />}
              onClick={handleGoogleSignup}
              disabled={isLoading}
              sx={{ py: 1.5 }}
            >
              Sign up with Google
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
      
      {/* Gallery Preview */}
      <Container maxWidth="lg" sx={{ mt: -6, position: 'relative', zIndex: 1 }}>
        <Paper elevation={6} sx={{ 
          borderRadius: 3, 
          overflow: 'hidden',
          display: 'flex',
          flexWrap: 'wrap',
        }}>
          {galleryImages.map((img, index) => (
            <Box 
              key={index} 
              sx={{ 
                flex: { xs: '1 1 50%', md: '1 1 25%' }, 
                height: { xs: 200, md: 280 }
              }}
            >
              <Box
                component="img"
                src={img}
                alt={`Example ${index + 1}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          ))}
        </Paper>
      </Container>
      
      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
        {/* Main Value Proposition */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" gutterBottom>
            Upload your selfies and start taking stunning AI photos now
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: '800px', mx: 'auto' }}>
            Lovit helps you create an AI model of yourself that you can use to try on any clothing from any website before you buy or rent it. Perfect for shoppers, fashion lovers, and e-commerce store owners.
          </Typography>
        </Box>

        {/* Features Section */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {featureItems.map((feature, index) => (
              <Box 
                key={index} 
                sx={{ 
                  flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' }
                }}
              >
                <Card sx={{ height: '100%', borderRadius: 3, overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={feature.image}
                    alt={feature.title}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
        
        {/* How It Works */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" gutterBottom textAlign="center">
            How It Works
          </Typography>
          <Divider sx={{ mb: 4 }} />
          
          <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            <Typography variant="body1" paragraph>
              <strong>Create your AI model</strong> in minutes - either of yourself or anyone else. Simply upload 10-20 photos and our advanced AI will learn to recognize and replicate unique features, expressions, and style.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Once your model is ready, <strong>upload any outfit you want to try</strong> from any online store. Just take a screenshot or save the image of the clothing item you're interested in.
            </Typography>
            
            <Typography variant="body1" paragraph>
              <strong>Generate stunning images instantly</strong> of your model wearing those outfits in any setting of your choosing. From beach vacations to city streets or professional settings - see exactly how the clothes will look on you before making a purchase.
            </Typography>
          </Box>
        </Box>
        
        {/* Testimonials */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" gutterBottom textAlign="center">
            What Our Users Say
          </Typography>
          <Divider sx={{ mb: 4 }} />
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {testimonials.map((testimonial, index) => (
              <Paper 
                key={index} 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' },
                  borderRadius: 3
                }}
              >
                <Typography variant="body1" paragraph fontStyle="italic">
                  "{testimonial.quote}"
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {testimonial.author}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>
        
        {/* CTA */}
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 6, 
            px: 3,
            background: 'linear-gradient(to right, rgba(147, 112, 219, 0.1), rgba(147, 112, 219, 0.2))',
            borderRadius: 4
          }}
        >
          <Typography variant="h4" gutterBottom>
            Ready to transform your shopping experience?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
            Join thousands of users who are already using Lovit to visualize themselves in any outfit before making a purchase.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={handleClickOpen}
            endIcon={<ArrowForwardIcon />}
            sx={{ 
              py: 1.5,
              px: 4,
              fontSize: '1.1rem',
              borderRadius: 2
            }}
          >
            Try it, Lovit!
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Sign up with email or Google Sign-in
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage; 