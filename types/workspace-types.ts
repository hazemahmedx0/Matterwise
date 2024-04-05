import { User } from '../services/api/types/user';

export type Workspace = {
  id: number;
  title: string;
  description: string;
  owner: User;
  //   createdAt: string;
  //   updatedAt: string;
  //   deletedAt: string | null;
};

export type Workspaces = Workspace[];
