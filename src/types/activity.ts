import { ProjectRef } from './project';
import { IssueRef } from './issue';

export interface Activity {
  id: string;
  action: string | null;
  createdAt: string; 
  project: ProjectRef | null;
  issue: IssueRef | null;
}