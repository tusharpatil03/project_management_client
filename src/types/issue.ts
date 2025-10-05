import { BaseEntity, IssueStatus, IssueType } from './common';
import { InterfaceUser } from './user';
import { InterfaceSprint } from './sprint';

export interface InterfaceIssue extends BaseEntity {
  title: string;
  description?: string;
  type: IssueType;
  priority?: IssuePriority;
  creator: InterfaceUser;
  creatorId?: string;
  assignee?: InterfaceUser;
  assigneeId?: string | null;
  projectId?: string;
  sprintId?: string;
  sprint: InterfaceSprint;
  status: IssueStatus;
  dueDate: Date;
}

export interface IssueRef {
  key: string;
  title: string | null;
}

export enum IssuePriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export type UpdateIssueInput = {
  issueId: string;
  projectId: string;
  title?: string;
  description?: string;
  type?: IssueType;
  status?: string;
  dueDate?: string;
  assigneeId?: string;
  priority?: IssuePriority;
};

export type CreateIssueResponse = {
  createIssue: {
    message: string;
    sucess: boolean;
  };
};