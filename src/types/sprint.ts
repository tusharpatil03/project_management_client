import { BaseEntity } from './common';
import { InterfaceIssue } from './issue';
import { InterfaceProject } from './project';
import { InterfaceUser } from './user';

export interface InterfaceSprint extends BaseEntity {
  title: string;
  key: string;
  status: string;
  description: string;
  projectId: string;
  dueDate: string;
  creatorId?: string;
  creator?: InterfaceUser;
  project?: InterfaceProject
  issues?: InterfaceIssue[];
}

export type CreateSprintResponse = {
  createSprint: {
    id: string;
    title: string;
    description?: string;
    status: string;
    dueDate: string;
    createdAt?: string;
    updatedAt?: string;
    creator?: {
      id: string;
    };
    project?: {
      id: string;
      name?: string;
    };
    issues: { id: string; title: string; status?: string }[];
  };
};
