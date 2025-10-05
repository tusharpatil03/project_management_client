import { BaseEntity } from './common';
import { InterfaceIssue } from './issue';

export interface InterfaceSprint extends BaseEntity {
  title: string;
  key: string;
  status: string;
  description: string;
  projectId: string;
  dueDate: string;
  issues?: InterfaceIssue[];
}