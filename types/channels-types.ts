import { User } from '../services/api/types/user';
import { Workspace } from './workspace-types';

// Channel type
export interface Channel {
  id: number;
  title: string;
  description: string;
  owner: User;
  workspace: Workspace;
  members: User[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// Channels type (assuming it's an array of channels)
export type Channels = Channel[];
