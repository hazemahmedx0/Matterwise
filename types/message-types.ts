import { User } from '@/services/api/types/user';

export type Message = {
  id: number;
  content: string;
  createdAt: string;
  childsCount: number;
  sender: User;
  channel: {
    id: number;
  };
  workspace: {
    id: number;
    title: string;
  };
};
