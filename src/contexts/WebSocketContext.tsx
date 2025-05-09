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
  updateGeneratingImage,
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
  connect: (id: string, type: "IMAGE" | "MODEL") => void;
  disconnect: (id: string) => void;
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
  // Track which image updates are coming through which connections
  const [imageToSocketMap, setImageToSocketMap] = useState<Record<string, string>>({});
  
  // Redux
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const generatingImages = useSelector((state: RootState) => state.gallery.generatingImages);
  const dispatch = useDispatch<AppDispatch>();

  // Define disconnect function first so it can be referenced in handleMessage
  const disconnect = useCallback((id: string) => {
    const socket = sockets[id];
    if (socket) {
      // Check if this is an image ID
      console.log(`Disconnecting WebSocket for ${id}`);
      socket.close();
      setSockets(prev => {
        const newSockets = { ...prev };
        delete newSockets[id];
        return newSockets;
      });
      
      // Clean up any image mappings to this socket
      setImageToSocketMap(prev => {
        const newMap = { ...prev };
        // Remove any entries where this socket ID was being used
        Object.keys(newMap).forEach(imageId => {
          if (newMap[imageId] === id) {
            delete newMap[imageId];
          }
        });
        return newMap;
      });
    }
  }, [sockets]);

  // Process incoming WebSocket message
  const handleMessage = useCallback((id: string, event: MessageEvent) => {
    console.log(`Received WS message for ${id}`);
    
    try {
      const data = JSON.parse(event.data);
      
      // Set last message for notifications
      setLastMessage(data);
      
      // Check the type of update
      if (data.type === 'model_training_update') {
        const trainingData = data as TrainingUpdate;
        console.log(`Processing training update for model ${id}:`, trainingData);
        
        // Update model in Redux store
        if (trainingData.modelId && trainingData.status) {
          const modelUpdate = {
            modelId: trainingData.modelId,
            status: trainingData.status,
            progress: trainingData.progress,
            name: trainingData.name,
            // Flatten profile data to match API format
            ...(trainingData.profileData || {}),
            timestamp: trainingData.timestamp
          };
          
          dispatch(updateModel(modelUpdate));
        }
      } 
      // Handle image generation updates
      else if (data.type === 'image_generation_update') {
        const imageData = data as ImageGenerationUpdate;
        console.log(`Image Generation Update for:`, imageData);
        
        // For image generation updates, the socket might be connected with a different ID
        if (imageData.imageId !== id) {
          console.log(`Note: Message for ${imageData.imageId} received on connection ${id}`);
          
          // Map this image ID to this socket connection for future reference
          setImageToSocketMap(prev => ({
            ...prev,
            [imageData.imageId]: id
          }));
        }
        
        // Find the original generating image to get prompt and modelId
        const generatingImage = generatingImages.find(
          (img) => img.imageId === imageData.imageId
        );
        
        if(generatingImage) {
          console.log("Found generating image:", generatingImage);
        } else {
          console.log(`No generating image found for imageId: ${imageData.imageId}`);
        }
        
        // Update or add the image to the generating images store
        dispatch(updateGeneratingImage({
          ...imageData
        }));
        
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
            dripRating: imageData.dripRating || generatingImage?.dripRating || [],
            imageKey: imageData.imageKey || generatingImage?.imageKey
          };
          
          console.log("Adding completed image to gallery:", newImage);
          dispatch(addGeneratedImages([newImage]));
          
          // Remove from generating images
          dispatch(removeGeneratingImage(newImage.imageId));
          
          // Clean up the image-to-socket mapping
          setImageToSocketMap(prev => {
            const newMap = { ...prev };
            delete newMap[imageData.imageId];
            return newMap;
          });
          
          // If this was a message for a different image ID than the socket,
          // don't disconnect the socket (as it might be handling other images)
          if (imageData.imageId === id) {
            disconnect(imageData.imageId);
          }
        } else if (imageData.status === 'failed') {
          console.log("Image generation failed, removing from generating images:", imageData.imageId);
          // Remove from generating images if failed
          dispatch(removeGeneratingImage(imageData.imageId));
          
          // Clean up the image-to-socket mapping
          setImageToSocketMap(prev => {
            const newMap = { ...prev };
            delete newMap[imageData.imageId];
            return newMap;
          });
          
          // If this was a message for a different image ID than the socket,
          // don't disconnect the socket (as it might be handling other images)
          if (imageData.imageId === id) {
            disconnect(imageData.imageId);
          }
        } else if (imageData.status === 'try_on' || imageData.progress !== undefined) {
          // Update progress for generating image or try_on status
          console.log(`Updating status for image ${imageData.imageId}: ${imageData.status}, progress: ${imageData.progress}%`);
          dispatch(updateGeneratingImage({
            imageId: imageData.imageId,
            progress: imageData.progress,
            status: imageData.status
          }));
        }
      } else if (data.type === 'connected') {
        console.log(`Connection established for ${id}, connectionId: ${data.connectionId}`);
      } else {
        console.log("Unknown message type:", data.type, data);
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  }, [dispatch, generatingImages, disconnect]);

  // Connect to WebSocket for a model or image
  const connect = useCallback((id: string, type: "IMAGE" | "MODEL") => {
    if (!id) {
      console.error('Cannot connect to WebSocket: ID is undefined');
      return;
    }
    
    // Use a function to get the current state of sockets
    setSockets(prevSockets => {
      // Check if we already have a socket for this ID
      if (prevSockets[id]) {
        console.log(`WebSocket already connected for ${id}`);
        return prevSockets; // Already connected, return unchanged state
      }
      
      // Check if this image is already getting updates through another socket
      const existingSocketId = imageToSocketMap[id];
      if (existingSocketId && prevSockets[existingSocketId]) {
        console.log(`Image ${id} is already receiving updates through socket ${existingSocketId}`);
        return prevSockets; // Already receiving updates through another socket, return unchanged state
      }
      
      try {
        if (!user?.userId) {
          console.error('Cannot connect to WebSocket: userId is missing');
          return prevSockets; // Return unchanged state
        }

        console.log("Current generating images:", generatingImages);
        
        // Determine if this is an image or model connection
        const isImageConnection = type === "IMAGE"
        // Build WebSocket URL
        let wsUrl;
        
        // If this is an image ID (either found in generating images or has a specific pattern)
        if (isImageConnection) {
          // For image connections, pass imageId parameter
          wsUrl = `${process.env.REACT_APP_WS_URL || 'wss://api.trylovit.com/ws'}/updates/${id}?token=${token}&userId=${user.userId}&imageId=${id}`;
        } else {
          // For model connections, pass modelId parameter
          wsUrl = `${process.env.REACT_APP_WS_URL || 'wss://api.trylovit.com/ws'}/updates/${id}?token=${token}&userId=${user.userId}&modelId=${id}`;
        }
        
        console.log(`Connecting to WebSocket for ${isImageConnection ? 'image' : 'model'} ${id}`);
        console.log(`WebSocket URL: ${wsUrl}`);
        
        const socket = new WebSocket(wsUrl);
        
        socket.onopen = () => {
          console.log(`WebSocket connected for ${id}`);
        };
        
        socket.onmessage = (event) => handleMessage(id, event);
        
        socket.onerror = (error) => {
          console.error(`WebSocket error for ${id}:`, error);
        };
        
        socket.onclose = (event) => {
          console.log(`WebSocket closed for ${id}. Code: ${event.code}, Reason: ${event.reason || ''}`);
          // Remove from sockets when closed
          setSockets(prev => {
            const newSockets = { ...prev };
            delete newSockets[id];
            return newSockets;
          });
          
          // Clean up any image mappings to this socket
          setImageToSocketMap(prev => {
            const newMap = { ...prev };
            // Remove any entries where this socket ID was being used
            Object.keys(newMap).forEach(imageId => {
              if (newMap[imageId] === id) {
                delete newMap[imageId];
              }
            });
            return newMap;
          });
        };
        
        // Return updated sockets with the new socket
        return {
          ...prevSockets,
          [id]: socket
        };
      } catch (error) {
        console.error(`Error connecting to WebSocket for ${id}:`, error);
        return prevSockets; // Return unchanged state on error
      }
    });
  }, [token, handleMessage, user, imageToSocketMap, generatingImages]);
  
  // Clean up sockets on unmount
  useEffect(() => {
    return () => {
      Object.values(sockets).forEach(socket => {
        if (socket) {
          socket.close();
        }
      });
    };
  }, []); // Empty dependency array to only run on mount/unmount
  
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
