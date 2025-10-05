import { BaseEntity, Status } from './common';
import { InterfaceIssue } from './issue';
import { InterfaceSprint } from './sprint';
import { InterfaceTeam } from './team';
import { InterfaceUser } from './user';

export interface InterfaceProject extends BaseEntity {
  key: string;
  name: string;
  description?: string;
  starred?: boolean;
  status: Status;
  creatorId: string;
  issues?: InterfaceIssue[];
  sprints?: InterfaceSprint[];
  teams: InterfaceProjectTeam[];
  creator?: InterfaceUser;
}

export interface InterfaceProjectTeam {
  id: string;
  projectId: string;
  teamId: string;
  Project: InterfaceProject;
  Team: InterfaceTeam;
}

export interface ProjectRef {
  key: string;
  name: string | null;
}