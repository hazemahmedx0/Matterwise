'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io as ClientIO } from 'socket.io-client';
import Cookies from 'js-cookie';
const AUTH_TOKEN_KEY = 'auth-token-data';

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const tokens = JSON.parse(Cookies.get(AUTH_TOKEN_KEY) ?? 'null');

  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = new (ClientIO as any)(
      'http://localhost:3000/events',
      {
        //   addTrailingSlash: false,
        extraHeaders: {
          authorization: `Bearer ${tokens?.token}`,
        },
      },
    );

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    socketInstance.on('exception', (data) => {
      console.log(data);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
