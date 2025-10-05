import { BaseEntity } from './common';
import { InterfaceUser } from './user';
import { InterfaceProject } from './project';

export interface InterfaceTeam extends BaseEntity {
  name: string;
  description?: string;
  creatorId: string;
  users: UserTeam[];
  projects: InterfaceProject[];
}

export interface UserTeam {
  id: string;
  role?: string;
  userId?: string;
  teamId?: string;
  user: InterfaceUser;
}

export interface TeamStats {
  total: number;
  admins: number;
  contributors: number;
  viewers: number;
}