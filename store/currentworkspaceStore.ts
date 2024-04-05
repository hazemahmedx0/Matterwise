import { Workspace } from '@/types/workspace-types';
import { create } from 'zustand';

type currentWorkspace = {
  workspace: Workspace | null | undefined;
  setWorkspace: (workspace: Workspace) => void;
};

export const useCurrentWorkspace = create<currentWorkspace>((set) => ({
  workspace: null,
  setWorkspace: (workspace) => set({ workspace }),
}));
