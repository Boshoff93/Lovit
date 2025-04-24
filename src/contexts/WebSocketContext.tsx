import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

// Define the shape of a training update message
interface TrainingUpdate {
  type: string;
  modelId: string;
  status: string;
  progress?: number;
  logs?: string[];
  timestamp: number;
}

// Define the context state
interface WebSocketContextState {
  isConnected: boolean;
  lastMessage: TrainingUpdate | null;
  trainingUpdates: Record<string, TrainingUpdate[]>;
  connect: (modelId?: string) => void;
  disconnect: () => void;
}

// Create the context with a default value
const WebSocketContext = createContext<WebSocketContextState>({
  isConnected: false,
  lastMessage: null,
  trainingUpdates: {},
  connect: () => {},
  disconnect: () => {},
});

// API URL from environment or fallback
const API_URL = process.env.REACT_APP_API_URL || 'https://api.trylovit.com';
const WS_URL = API_URL.replace('https://', 'wss://').replace('http://', 'ws://');

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<TrainingUpdate | null>(null);
  const [trainingUpdates, setTrainingUpdates] = useState<Record<string, TrainingUpdate[]>>({});
  
  const { token, user } = useSelector((state: RootState) => state.auth);
  const userId = user?.userId;

  // Reconnect if auth state changes
  useEffect(() => {
    if (token && userId && !socket) {
      connect();
    } else if (!token && socket) {
      disconnect();
    }
  }, [token, userId]);

  const connect = useCallback((modelId?: string) => {
    if (!token || !userId) {
      console.warn('Cannot connect WebSocket: No authentication token or userId');
      return;
    }

    // Close existing socket if any
    if (socket) {
      socket.close();
    }

    // Create WebSocket URL with authentication parameters
    let wsUrl = `${WS_URL}/ws?userId=${userId}`;
    if (modelId) {
      wsUrl += `&modelId=${modelId}`;
    }

    // Create new WebSocket connection
    const newSocket = new WebSocket(wsUrl);

    newSocket.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    newSocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        // Handle different message types
        if (message.type === 'model_training_update') {
          const update = message as TrainingUpdate;
          setLastMessage(update);
          
          // Store updates by modelId
          setTrainingUpdates(prev => {
            const modelUpdates = prev[update.modelId] || [];
            return {
              ...prev,
              [update.modelId]: [...modelUpdates, update]
            };
          });
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    newSocket.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      setSocket(null);
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      newSocket.close();
    };

    setSocket(newSocket);
  }, [token, userId, socket]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.close();
      setSocket(null);
      setIsConnected(false);
    }
  }, [socket]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  // Send periodic ping to keep connection alive
  useEffect(() => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    const pingInterval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // 30 seconds

    return () => clearInterval(pingInterval);
  }, [socket]);

  const contextValue: WebSocketContextState = {
    isConnected,
    lastMessage,
    trainingUpdates,
    connect,
    disconnect
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to use the WebSocket context
export const useWebSocket = () => useContext(WebSocketContext);

export default WebSocketContext; 