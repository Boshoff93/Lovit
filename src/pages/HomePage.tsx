import React, { useMemo, useState } from 'react';
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
  Snackbar,
  Tabs,
  Tab,
  Link
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GoogleIcon from '@mui/icons-material/Google';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '@mui/material/styles';

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
  const [authTab, setAuthTab] = useState<number>(0);
  const navigate = useNavigate();
  const { login, signup, googleLogin, user, error: authError, resendVerificationEmail, getGoogleIdToken, subscription } = useAuth();
  const isPremiumMember = subscription?.tier && subscription.tier !== 'free'
  const theme = useTheme();

  const handleClickOpen = () => {
    if (user) {
      if (isPremiumMember) {
        navigate('/dashboard');
        return;
      } else {
        navigate('/payment');
        return;
      }
    }
    
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setAuthTab(newValue);
    setError(null);
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
        setError('Please fill in all fields');
        setIsLoading(false);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }
      // Password validation
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
      if (!passwordRegex.test(password)) {
        setError('Password must be at least 8 characters and include at least one capital letter, one number, and one special character');
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      // Call signup using useAuth hook
      const result = await signup(email, password, username);
      
      // Check if the signup was successful by looking at the fulfilled action
      if (result.type.endsWith('/fulfilled')) {
        setIsLoading(false);
        handleClose();
        showSnackbar('Account created successfully! Please check your email to verify your account.');
      } else {
        // If we get here, there was an error
        setIsLoading(false);
        setError(result.payload || 'Signup failed. Please try again.');
      }
    } catch (error: any) {
      setIsLoading(false);
      // Use authError from useAuth hook if available
      setError(authError || 'Signup failed. Please try again.');
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get Google ID token using the auth hook utility
      const idToken = await getGoogleIdToken();
      
      // Use our Redux action through the useAuth hook and store the result
      const result = await googleLogin(idToken);
      
      setIsLoading(false);
      handleClose();
      
      // Check if the login was successful
      if (result.type === 'auth/loginWithGoogle/fulfilled') {
        showSnackbar('Signed in with Google successfully!');
        
        // Get user data from the response
        const userData = result.payload.user;
        
        // Check if user is verified using response data
        if (!userData.isVerified) {
          // User is not verified, send verification email and show notification
          try {
            await resendVerificationEmail(userData.email);
            showSnackbar('Your email is not verified. A new verification email has been sent - please check your inbox.');
          } catch (err) {
            console.error('Failed to resend verification email:', err);
            showSnackbar('Your email is not verified. Please check your inbox for the verification email.');
          }
        } else {
          // Navigate to dashboard if authentication was successful
          navigate('/dashboard');
        }
      } else {
        // Login was rejected, set error message
        setError(result.payload || 'Google login failed.');
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error('Google sign-in error:', error);
      
      // Use authError from useAuth hook if available
      if (error.error === 'popup_closed_by_user') {
        setError('Google sign-in was cancelled. Please try again.');
      } else {
        setError(authError || 'Google sign-in failed. Please try again or use email signup.');
      }
    }
  };

  const handleEmailLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!email || !password) {
        setError('Please enter both email and password');
        setIsLoading(false);
        return;
      }

      // Call login using our useAuth hook and store the result
      const result = await login(email, password);
      
      setIsLoading(false);

      // Check if the login was successful
      if (result.type === 'auth/loginWithEmail/fulfilled') {
        handleClose();
        const userData = result.payload.user;
        
        // Check if user is verified using response data
        if (!userData.isVerified) {
          // User is not verified, send verification email and show single notification
          try {
            await resendVerificationEmail(userData.email);
            showSnackbar('Your email is not verified. A new verification email has been sent - please check your inbox.');
          } catch (err) {
            console.error('Failed to resend verification email:', err);
            showSnackbar('Your email is not verified. Please check your inbox for the verification email.');
          }
        } else {
          // User is verified, proceed as normal
          showSnackbar('Logged in successfully!');
          navigate('/dashboard');
        }
      } else {
        // Login was rejected, set error message
        setError(result.payload || 'Login failed. Please check your credentials.');
      }
    } catch (error: any) {
      setIsLoading(false);
      // Use authError from useAuth hook if available
      setError(authError || 'Login failed. Please check your credentials.');
    }
  };

  const handleKeyPressLogin = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleEmailLogin();
    }
  };

  const handleKeyPressSignup = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleEmailSignup();
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ 
        py: { xs: 8, md: 12 }, 
        textAlign: 'center',
        background: `linear-gradient(145deg, ${theme.palette.primary.main}10, ${theme.palette.primary.light}05)`,
        position: 'relative',
        zIndex: 1,
        backdropFilter: 'blur(5px)',
        boxShadow: '0 4px 30px rgba(43, 45, 66, 0.1)',
        borderBottom: `1px solid ${theme.palette.primary.light}30`,
        overflow: 'hidden',
      }}>
        <Container maxWidth="md">
          {/* Logo/Image above slogan */}
          <Box 
            component="img"
            src="/lovit.png" // Using existing image from public folder
            alt="Lovit Logo"
            sx={{
              width: { xs: '200px', md: '200px' },
              p: "10px",
              height: 'auto',
              borderRadius: '50%',
            }}
          />
          
          <Typography 
            variant="h1" 
            component="h1" 
            sx={{ 
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 800,
              mb: 2,
              color: theme.palette.primary.main
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
      
      {/* Auth Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(43, 45, 66, 0.2)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: `linear-gradient(145deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          color: 'white',
          py: 2
        }}>
          {authTab === 0 ? 'Login to Lovit' : 'Sign Up for Lovit'}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white'
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 3 }}>
          <Tabs 
            value={authTab} 
            onChange={handleTabChange} 
            variant="fullWidth" 
            sx={{ 
              mb: 3,
              '& .MuiTab-root': {
                fontWeight: 600
              },
              '& .Mui-selected': {
                color: theme.palette.primary.main
              },
              '& .MuiTabs-indicator': {
                backgroundColor: theme.palette.primary.main
              }
            }}
          >
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>
          
          <Box sx={{ mt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {authTab === 0 ? (
              // Login Form
              <>
                <TextField
                  autoFocus
                  margin="dense"
                  id="email-login"
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
                  id="password-login"
                  label="Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPressLogin}
                  sx={{ mb: 3 }}
                />
                <Box sx={{ width: '100%', textAlign: 'center', mb: 2 }}>
                  <Link
                    component={RouterLink}
                    to="/reset-password-request"
                    variant="body2"
                    underline="hover"
                  >
                    Forgot Password?
                  </Link>
                </Box>
                <Button 
                  fullWidth 
                  variant="contained" 
                  color="primary"
                  onClick={handleEmailLogin}
                  disabled={isLoading}
                  sx={{ mb: 2, py: 1.5 }}
                >
                  {isLoading ? <CircularProgress size={24} /> : 'Login with Email'}
                </Button>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  startIcon={<GoogleIcon />}
                  onClick={handleGoogleSignup}
                  disabled={isLoading}
                  sx={{ py: 1.5 }}
                >
                  Continue with Google
                </Button>
              </>
            ) : (
              // Sign Up Form
              <>
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
                  onKeyPress={handleKeyPressSignup}
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
                  onKeyPress={handleKeyPressSignup}
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
              </>
            )}
          </Box>
        </DialogContent>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          mt: 7
        }}
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
          boxShadow: '0 4px 20px rgba(43, 45, 66, 0.15)'
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
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  },
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
          <Typography variant="h4" gutterBottom color="primary.main">
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
                <Card sx={{ 
                  height: '100%', 
                  borderRadius: 3, 
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(43, 45, 66, 0.08)',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 20px rgba(43, 45, 66, 0.12)',
                  }
                }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={feature.image}
                    alt={feature.title}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom fontWeight={600} color="primary.main">
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
          <Typography variant="h4" gutterBottom textAlign="center" color="primary.main">
            How It Works
          </Typography>
          <Divider sx={{ mb: 4, borderColor: theme.palette.primary.light }} />
          
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
          <Typography variant="h4" gutterBottom textAlign="center" color="primary.main">
            What Our Users Say
          </Typography>
          <Divider sx={{ mb: 4, borderColor: theme.palette.primary.light }} />
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {testimonials.map((testimonial, index) => (
              <Paper 
                key={index} 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' },
                  borderRadius: 3,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.primary.light}20`,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(43, 45, 66, 0.1)',
                  }
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
            background: `linear-gradient(145deg, ${theme.palette.primary.light}15, ${theme.palette.primary.main}25)`,
            borderRadius: 4,
            border: `1px solid ${theme.palette.primary.light}30`
          }}
        >
          <Typography variant="h4" gutterBottom color="primary.main">
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