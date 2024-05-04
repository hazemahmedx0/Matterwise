import { FileEntity } from '@/services/api/types/file-entity';

type Sender = {
  id: number;
  firstName: string;
  lastName: string;
};

type Workspace = {
  id: number;
  title: string;
  photo?: FileEntity | null;
};

export type Invitation = {
  id: number;
  sender: Sender;
  invitee_email: string;
  workspace: Workspace;
  createdAt: string; // Assuming createdAt is a string in ISO 8601 format
};
