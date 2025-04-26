import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { updateModel } from '../store/modelsSlice';
import { AppDispatch } from '../store/store';
import { 
  removeGeneratingImage, 
  addGeneratedImages, 
  GeneratedImage, 
  addGeneratingImage,
  updateGeneratingImageProgress,
  ImageBase
} from '../store/gallerySlice';

// Define the shape of a training update message
export interface TrainingUpdate {
  type: string;
  modelId: string;
  status: string;
  progress?: number;
  timestamp: number;
  name?: string;
  profileData?: any;
}

// Define the shape of an image generation update message
export interface ImageGenerationUpdate extends ImageBase {
  type: string;
  timestamp: number;
  progress?: number;
}

// WebSocket context interface
interface WebSocketContextType {
  lastMessage: TrainingUpdate | ImageGenerationUpdate | null;
  connect: (modelId: string) => void;
  disconnect: (modelId: string) => void;
}

// Create context
const WebSocketContext = createContext<WebSocketContextType>({
  lastMessage: null,
  connect: () => {},
  disconnect: () => {}
});

// Context provider props
interface WebSocketProviderProps {
  children: ReactNode;
}

// WebSocket provider component
export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  // We'll store WebSocket connections for each model
  const [sockets, setSockets] = useState<Record<string, WebSocket | null>>({});
  // Store last message for notifications
  const [lastMessage, setLastMessage] = useState<TrainingUpdate | ImageGenerationUpdate | null>(null);

  
  // Redux
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const generatingImages = useSelector((state: RootState) => state.gallery.generatingImages);
  const dispatch = useDispatch<AppDispatch>();

  // Define disconnect function first so it can be referenced in handleMessage
  const disconnect = useCallback((modelId: string) => {
    const socket = sockets[modelId];
    if (socket) {
      // Check if this is an image ID
      console.log(`Disconnecting WebSocket for ${modelId}`);
      socket.close();
      setSockets(prev => {
        const newSockets = { ...prev };
        delete newSockets[modelId];
        return newSockets;
      });
    }
  }, [sockets]);

  // Process incoming WebSocket message
  const handleMessage = useCallback((modelId: string, event: MessageEvent) => {
    console.log(`Received WS message for ${modelId}`);
    
    try {
      const data = JSON.parse(event.data);
      
      // Set last message for notifications
      setLastMessage(data);
      
      // Check the type of update
      if (data.type === 'model_training_update') {
        const trainingData = data as TrainingUpdate;
        console.log(`Processing training update for model ${modelId}:`, trainingData);
        
        // Update model in Redux store
        if (trainingData.modelId && trainingData.status) {
          const modelUpdate = {
            modelId: trainingData.modelId,
            status: trainingData.status,
            progress: trainingData.progress
          };
          
          // If this is a completed update with additional model data, include it
          if (trainingData.status === 'completed' && trainingData.name) {
            Object.assign(modelUpdate, {
              name: trainingData.name,
              profileData: trainingData.profileData
            });
          }
          
          dispatch(updateModel(modelUpdate));
        }
      } 
      // Handle image generation updates
      else if (data.type === 'image_generation_update') {
        const imageData = data as ImageGenerationUpdate;
        console.log(`Image Generation Update for:`, imageData);
        
        // For image generation updates, the socket might be connected with imageId directly
        if (imageData.imageId !== modelId) {
          console.log(`Note: Message for ${imageData.imageId} received on connection ${modelId}`);
        }
        
        // Find the original generating image to get prompt and modelId
        const generatingImage = generatingImages.find(
          (img) => img.imageId === imageData.imageId
        );
        
        if(generatingImage) {
          console.log("Found generating image:", generatingImage);
        } else {
          console.log(`No generating image found for imageId: ${imageData.imageId}`);
          // Add the missing image to the generating images store
          dispatch(addGeneratingImage({
           ...imageData
          }));
        }
        
        // Update Redux store for image generation
        if (imageData.status === 'completed' && imageData.imageUrl) {
          // Find the original generating image to merge any missing data
          const generatingImage = generatingImages.find(
            (img) => img.imageId === imageData.imageId
          );
          
          // When we receive a completed image, log all data
          console.log("Completed image data from WebSocket:", imageData);
          if (generatingImage) {
            console.log("Existing generating image data:", generatingImage);
          }
          
          // Add completed image to gallery store - prioritize WebSocket data over generating image
          const newImage: GeneratedImage = {
            imageId: imageData.imageId,
            imageUrl: imageData.imageUrl,
            createdAt: new Date(imageData.timestamp).toISOString(),
            status: imageData.status,
            // WebSocket data now includes all these fields - use with fallbacks
            modelId: imageData.modelId || generatingImage?.modelId,
            prompt: imageData.prompt || generatingImage?.prompt,
            title: imageData.title || generatingImage?.title || "Untitled Image",
            orientation: imageData.orientation || generatingImage?.orientation,
            seedNumber: imageData.seedNumber || generatingImage?.seedNumber,
            clothingKey: imageData.clothingKey || generatingImage?.clothingKey,
            dripRating: imageData.dripRating || generatingImage?.dripRating || []
          };
          
          console.log("Adding completed image to gallery:", newImage);
          dispatch(addGeneratedImages([newImage]));
          
          // Remove from generating images
          dispatch(removeGeneratingImage(newImage.imageId));
          
          // Disconnect the WebSocket as we no longer need updates for this image
          disconnect(modelId);
        } else if (imageData.status === 'failed') {
          console.log("Image generation failed, removing from generating images:", imageData.imageId);
          // Remove from generating images if failed
          dispatch(removeGeneratingImage(imageData.imageId));
          
          // Disconnect the WebSocket as we no longer need updates for this image
          disconnect(modelId);
        } else if (imageData.progress !== undefined) {
          // Update progress for generating image
          console.log(`Updating progress for image ${imageData.imageId}: ${imageData.progress}%`);
          dispatch(updateGeneratingImageProgress({ 
            imageId: imageData.imageId, 
            progress: imageData.progress 
          }));
        }
      } else if (data.type === 'connected') {
        console.log(`Connection established for ${modelId}, connectionId: ${data.connectionId}`);
      } else {
        console.log("Unknown message type:", data.type, data);
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  }, [dispatch, generatingImages, disconnect]);

  // Connect to WebSocket for a model
  const connect = useCallback((modelId: string) => {
    if (!modelId) {
      console.error('Cannot connect to WebSocket: modelId is undefined');
      return;
    }
    
    if (sockets[modelId]) {
      console.log(`WebSocket already connected for model ${modelId}`);
      return; // Already connected
    }
    
    try {
      if (!user?.userId) {
        console.error('Cannot connect to WebSocket: userId is missing');
        return;
      }

      const wsUrl = `${process.env.REACT_APP_WS_URL || 'wss://api.trylovit.com/ws'}/updates/${modelId}?token=${token}&userId=${user.userId}`;
      console.log(`Connecting to WebSocket for ${modelId}`);
      
      const socket = new WebSocket(wsUrl);
      
      socket.onopen = () => {
        console.log(`WebSocket connected for ${modelId}`);
      };
      
      socket.onmessage = (event) => handleMessage(modelId, event);
      
      socket.onerror = (error) => {
        console.error(`WebSocket error for ${modelId}:`, error);
      };
      
      socket.onclose = (event) => {
        console.log(`WebSocket closed for ${modelId}. Code: ${event.code}, Reason: ${event.reason}`);
        // Remove from sockets when closed
        setSockets(prev => {
          const newSockets = { ...prev };
          delete newSockets[modelId];
          return newSockets;
        });
      };
      
      // Store the socket
      setSockets(prev => ({
        ...prev,
        [modelId]: socket
      }));
    } catch (error) {
      console.error(`Error connecting to WebSocket for model ${modelId}:`, error);
    }
  }, [sockets, token, handleMessage, user]);
  
  // Clean up sockets on unmount
  useEffect(() => {
    return () => {
      Object.values(sockets).forEach(socket => {
        if (socket) {
          socket.close();
        }
      });
    };
  }, [sockets]);
  
  return (
    <WebSocketContext.Provider value={{ 
      lastMessage,
      connect, 
      disconnect 
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Hook to use the WebSocket context
export const useWebSocket = () => useContext(WebSocketContext);
