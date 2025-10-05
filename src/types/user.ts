import { BaseEntity, Gender, Social, Timestamps } from './common';
import { Activity } from './activity';
import { InterfaceIssue } from './issue';
import { InterfaceProject } from './project';
import { InterfaceSprint } from './sprint';
import { InterfaceTeam } from './team';

export interface InterfaceUser extends BaseEntity {
  email: string;
  isVerified: boolean;
  firstName: string;
  lastName: string;
  projects: InterfaceProject[];
  sprints: InterfaceSprint[];
  teams: InterfaceTeam[];
  createdTeams: InterfaceTeam[];
  createdIssues: InterfaceIssue[];
  assignedIssues: InterfaceIssue[];
  profile: InterfaceUserProfile | null;
  activities: Activity[];
}

export interface InterfaceUserProfile extends Timestamps {
  id?: string;
  avatar?: string | null;
  phone?: string | null;
  bio?: string | null;
  gender?: Gender;
  social?: Social | null;
  user?: InterfaceUser | null;
}

export interface InterfaceAuth {
  user: InterfaceUser;
  accessToken: string;
  refreshToken: string;
}
