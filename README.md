# Lovit - AI-Generated Fashion Photo App

Lovit is a React application that allows users to upload their photos, train a LoRA model using FAL.ai, and generate images of themselves wearing different outfits and styles.

## Features

- Photo uploading and management
- Integration with FAL.ai for model training
- Image generation with custom prompts
- Gallery to view and manage generated images
- Responsive design

## Prerequisites

- Node.js 14+ and npm
- FAL.ai API key

## Installation

1. Clone the repository:
   ```
   git clone <your-repo-url>
   cd lovit
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following:
   ```
   REACT_APP_API_URL=http://your-backend-api-url
   REACT_APP_FAL_API_KEY=your-fal-api-key
   ```

## Development

To start the development server:

```
npm start
```

This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Building for Production

To build the app for production:

```
npm run build
```

This builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

## Backend Requirements

This frontend application requires a backend API with the following endpoints:

- `/api/photos/upload` - POST - Upload photos
- `/api/photos` - GET - Get all uploaded photos
- `/api/models/train` - POST - Train a new model
- `/api/models` - GET - Get all models
- `/api/models/:id/status` - GET - Get model training status
- `/api/images/generate` - POST - Generate a new image
- `/api/images` - GET - Get all generated images

## FAL.ai Integration

This application uses FAL.ai's API for LoRA model training and image generation. You need to obtain an API key from FAL.ai to use these features.

## Technologies Used

- React
- TypeScript
- Material-UI
- Axios
- React Router
- FAL.ai API

## Note on Grid Issues

There are currently some TypeScript issues with the Material UI Grid component that may cause linting errors. These do not affect the functionality of the application but should be resolved in future updates.

## License

MIT
