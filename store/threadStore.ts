import { Message } from '@/types/message-types';
import { create } from 'zustand';

type currentThread = {
  message: Message | null | undefined;
  setMessage: (message: Message) => void;
  isVisible: boolean;
  setIsVisible: () => void;
};

export const useThreadStore = create<currentThread>((set) => ({
  message: null,
  setMessage: (message) => set({ message }),
  isVisible: false,
  setIsVisible: () => set((state) => ({ isVisible: !state.isVisible })),
}));
