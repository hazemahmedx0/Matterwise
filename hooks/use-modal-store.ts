import { Workspace } from '@/types/workspace-types';
import { PropsWithChildren, createContext, useContext, useState } from 'react';

export type ModalType = 'createWorkspace' | 'workspaceSettings';

export interface ModalData {
  workspace?: Workspace;
}

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  onOpen: ({ type, data }: { type: ModalType; data: ModalData | null }) => void;
  onClose: () => void;
  data?: ModalData;
}

export const ModalsContext = createContext<ModalStore>({
  type: null,
  isOpen: false,
  data: {},
  onOpen: () => {},
  onClose: () => {},
});

function useModals() {
  return useContext(ModalsContext);
}

export default useModals;
