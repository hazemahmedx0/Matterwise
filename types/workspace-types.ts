import { FileEntity } from '@/services/api/types/file-entity';
import { User } from '../services/api/types/user';

export type Workspace = {
  id: number;
  title: string;
  description: string;
  owner: User;
  photo?: FileEntity | null;

  //   createdAt: string;
  //   updatedAt: string;
  //   deletedAt: string | null;
};

export type Workspaces = Workspace[];
