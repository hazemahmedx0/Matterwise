'use client';
import Cookies from 'js-cookie';
const AUTH_TOKEN_KEY = 'auth-token-data';

const tokens = JSON.parse(Cookies.get(AUTH_TOKEN_KEY) ?? 'null');

import { io } from 'socket.io-client';
export const socket = io('http://localhost:3000/events', {
  extraHeaders: {
    authorization: `Bearer ${tokens?.token}`,
  },
});
