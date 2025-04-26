import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { updateModel } from '../store/modelsSlice';
import { AppDispatch } from '../store/store';
import { removeGeneratingImage, addGeneratedImages, GeneratedImage } from '../store/gallerySlice';

// Define the shape of a training update message
export interface TrainingUpdate {
  type: string;
  modelId: string;
  status: string;
  progress?: number;
  timestamp: number;
}

// Define the shape of an image generation update message
export interface ImageGenerationUpdate {
  type: string;
  status: string;
  imageId: string;
  progress?: number;
  imageUrl?: string;
  timestamp: number;
}

// WebSocket context interface
interface WebSocketContextType {
  trainingUpdates: Record<string, TrainingUpdate[]>;
  lastMessage: TrainingUpdate | ImageGenerationUpdate | null;
  imageGenerationUpdates: Record<string, ImageGenerationUpdate>;
  lastImageUpdate: ImageGenerationUpdate | null;
  connect: (modelId: string) => void;
  disconnect: (modelId: string) => void;
}

// Create context
const WebSocketContext = createContext<WebSocketContextType>({
  trainingUpdates: {},
  lastMessage: null,
  imageGenerationUpdates: {},
  lastImageUpdate: null,
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
  
  // Store updates from WebSocket
  const [trainingUpdates, setTrainingUpdates] = useState<Record<string, TrainingUpdate[]>>({});
  
  // Store last message for notifications
  const [lastMessage, setLastMessage] = useState<TrainingUpdate | ImageGenerationUpdate | null>(null);
  
  // Store image generation updates
  const [imageGenerationUpdates, setImageGenerationUpdates] = useState<Record<string, ImageGenerationUpdate>>({});
  
  // Store last image update
  const [lastImageUpdate, setLastImageUpdate] = useState<ImageGenerationUpdate | null>(null);
  
  // Redux
  const token = useSelector((state: RootState) => state.auth.token);
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
        
        // Update the training updates for this model
        setTrainingUpdates(prev => {
          const modelUpdates = prev[modelId] || [];
          return {
            ...prev,
            [modelId]: [...modelUpdates, trainingData]
          };
        });
        
        // Update model in Redux store
        if (trainingData.modelId && trainingData.status) {
          dispatch(updateModel({
            modelId: trainingData.modelId,
            status: trainingData.status,
            progress: trainingData.progress
          }));
        }
      } 
      // Handle image generation updates
      else if (data.type === 'image_generation_update') {
        const imageData = data as ImageGenerationUpdate;
        console.log(`Image Generation Update for ${modelId}:`, imageData);
        
        if (imageData.imageId !== modelId) {
          console.warn(`Image ID mismatch: Message for ${imageData.imageId} but connected to ${modelId}`);
        }
        
        // Set last image update
        setLastImageUpdate(imageData);
        
        // Update image generation updates using imageId
        setImageGenerationUpdates(prev => ({
          ...prev,
          [imageData.imageId]: imageData
        }));
        
        // Find the original generating image to get prompt and modelId
        const generatingImage = generatingImages.find(
          (img) => img.id === imageData.imageId
        );
        
        console.log("Found generating image:", generatingImage);
        
        // Update Redux store for image generation
        if (imageData.status === 'completed' && imageData.imageUrl) {
          // Add completed image to gallery store
          const newImage: GeneratedImage = {
            id: imageData.imageId,
            url: imageData.imageUrl,
            prompt: generatingImage?.prompt || '',
            createdAt: new Date().toISOString(),
            modelId: generatingImage?.modelId || '',
            orientation: generatingImage?.orientation,
            clothingKey: generatingImage?.clothingKey,
            seedNumber: generatingImage?.seedNumber
          };
          
          console.log("Adding completed image to gallery:", newImage);
          dispatch(addGeneratedImages([newImage]));
          
          // Remove from generating images
          dispatch(removeGeneratingImage(imageData.imageId));
          
          // Disconnect the WebSocket as we no longer need updates for this image
          disconnect(modelId);
        } else if (imageData.status === 'failed') {
          console.log("Image generation failed, removing from generating images:", imageData.imageId);
          // Remove from generating images if failed
          dispatch(removeGeneratingImage(imageData.imageId));
          
          // Disconnect the WebSocket as we no longer need updates for this image
          disconnect(modelId);
        }
      } else {
        console.log("Unknown message type:", data.type, data);
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  }, [dispatch, generatingImages, disconnect]);

  // Connect to WebSocket for a model
  const connect = useCallback((modelId: string) => {
    if (sockets[modelId]) {
      console.log(`WebSocket already connected for model ${modelId}`);
      return; // Already connected
    }
    
    try {
      const wsUrl = `${process.env.REACT_APP_WS_URL || 'wss://api.trylovit.com/ws'}/model/${modelId}?token=${token}`;
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
      };
      
      // Store the socket
      setSockets(prev => ({
        ...prev,
        [modelId]: socket
      }));
    } catch (error) {
      console.error(`Error connecting to WebSocket for model ${modelId}:`, error);
    }
  }, [sockets, token, handleMessage]);
  
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
      trainingUpdates, 
      lastMessage, 
      imageGenerationUpdates,
      lastImageUpdate,
      connect, 
      disconnect 
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Hook to use the WebSocket context
export const useWebSocket = () => useContext(WebSocketContext); 