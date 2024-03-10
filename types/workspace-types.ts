// import { User } from '../services/api/types/user';
type User = {
  id: number;
  email: string;
  username: string;
  provider: string;
  socialId: string | null;
  firstName: string;
  lastName: string;
  role: {
    id: number;
    name: string;
    __entity: string;
  };
  status: {
    id: number;
    name: string;
    __entity: string;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

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
