import { PropsWithChildren, createContext, useContext, useState } from 'react';

export type ModalType = 'createWorkspace';

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  onOpen: (type: ModalType) => void;
  onClose: () => void;
}

export const ModalsContext = createContext<ModalStore>({
  type: null,
  isOpen: false,
  onOpen: (type) => {},
  onClose: () => {},
});

function useModals() {
  return useContext(ModalsContext);
}

export default useModals;
