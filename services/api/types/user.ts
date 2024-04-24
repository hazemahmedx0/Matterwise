import { FileEntity } from './file-entity';
import { Role } from './role';

export enum UserProviderEnum {
  EMAIL = 'email',
  GOOGLE = 'google',
}

export type User = {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  photo?: FileEntity | null;
  avatarUrl?: string;
  provider?: UserProviderEnum;
  socialId?: string;
  role?: Role;
};
