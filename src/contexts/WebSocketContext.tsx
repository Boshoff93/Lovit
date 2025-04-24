import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { updateModel } from '../store/modelsSlice';
import { AppDispatch } from '../store/store';

// Define the shape of a training update message
interface TrainingUpdate {
  type: string;
  modelId: string;
  status: string;
  progress?: number;
  logs?: string[];
  timestamp: number;
}

// WebSocket context interface
interface WebSocketContextType {
  trainingUpdates: Record<string, TrainingUpdate[]>;
  lastMessage: TrainingUpdate | null;
  connect: (modelId: string) => void;
  disconnect: (modelId: string) => void;
}

// Create context
const WebSocketContext = createContext<WebSocketContextType>({
  trainingUpdates: {},
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
  
  // Store updates from WebSocket
  const [trainingUpdates, setTrainingUpdates] = useState<Record<string, TrainingUpdate[]>>({});
  
  // Store last message for notifications
  const [lastMessage, setLastMessage] = useState<TrainingUpdate | null>(null);
  
  // Redux
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch<AppDispatch>();

  // Process incoming WebSocket message
  const handleMessage = useCallback((modelId: string, event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data) as TrainingUpdate;
      
      // Set last message for notifications
      setLastMessage(data);
      
      // Update the training updates for this model
      setTrainingUpdates(prev => {
        const modelUpdates = prev[modelId] || [];
        return {
          ...prev,
          [modelId]: [...modelUpdates, data]
        };
      });
      
      // Update model in Redux store
      if (data.modelId && data.status) {
        dispatch(updateModel({
          modelId: data.modelId,
          status: data.status,
          progress: data.progress
        }));
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  }, [dispatch]);

  // Connect to WebSocket for a model
  const connect = useCallback((modelId: string) => {
    if (sockets[modelId]) return; // Already connected
    
    try {
      const wsUrl = `${process.env.REACT_APP_WS_URL || 'wss://api.trylovit.com/ws'}/model/${modelId}?token=${token}`;
      const socket = new WebSocket(wsUrl);
      
      socket.onopen = () => {
        console.log(`WebSocket connected for model ${modelId}`);
      };
      
      socket.onmessage = (event) => handleMessage(modelId, event);
      
      socket.onerror = (error) => {
        console.error(`WebSocket error for model ${modelId}:`, error);
      };
      
      socket.onclose = () => {
        console.log(`WebSocket closed for model ${modelId}`);
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
  
  // Disconnect from WebSocket
  const disconnect = useCallback((modelId: string) => {
    const socket = sockets[modelId];
    if (socket) {
      socket.close();
      setSockets(prev => {
        const newSockets = { ...prev };
        delete newSockets[modelId];
        return newSockets;
      });
    }
  }, [sockets]);
  
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
    <WebSocketContext.Provider value={{ trainingUpdates, lastMessage, connect, disconnect }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Hook to use the WebSocket context
export const useWebSocket = () => useContext(WebSocketContext); 