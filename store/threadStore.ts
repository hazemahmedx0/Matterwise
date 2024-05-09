import { Message } from '@/types/message-types';
import { boolean } from 'zod';
import { create } from 'zustand';

type currentThread = {
  message: Message | null | undefined;
  setMessage: (message: Message) => void;
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
};

export const useThreadStore = create<currentThread>((set) => ({
  message: null,
  setMessage: (message) => set({ message }),
  isVisible: false,

  setIsVisible: (value: boolean) => set(() => ({ isVisible: value })),
}));
