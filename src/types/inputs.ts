import { IssueStatus, IssueType } from './common';

export type LoginInput = {
  email: string;
  password: string;
};

export type SignupInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type CreateProjectInput = {
  name: string;
  key: string;
  description?: string;
};

export type CreateTeamInput = {
  name: string;
};

export type CreateIssueInput = {
  title: string;
  description?: string;
  type: IssueType;
  parentId?: string;
  assigneeId?: string;
  projectId: string;
  dueDate: string;
  status?: IssueStatus;
  sprintId: string | null;
};

export type CreateSprintInput = {
  title: string;
  description?: string;
  projectId: string;
  dueDate: string;
  issues?: CreateIssueInput[];
};

export type ChangeIssueStatusInput = {
  projectId: string;
  IssueId: string;
  status: string;
};

export type AssignIssueInput = {
  issueId: string;
  assigneeId: string;
  projectId: string;
};

export type RemoveProjectInput = {
  projectId: string;
};

export type RemoveIssueInput = {
  issueId: string;
  projectId: string;
};

export type RemoveSprintInput = {
  sprintId: string;
  projectId: string;
};

export type RemoveAssigneeOfIssueInput = {
  IssueId: string;
};

export type RemoveTeamInput = {
  teamId: string;
};

export type AddTeamMemberInput = {
  memberId: string;
  teamId: string;
  role: string;
};

export type RemoveTeamMemberInput = {
  memberId: string;
  teamId: string;
  projectId: string;
};

export type RefreshTokenInput = {
  refreshToken?: string;
};

// GraphQL Query Variables Types
export type GetUserByIdVariables = {
  userId: string;
};

export type GetProjectByIdVariables = {
  projectId: string;
};

export type GetTeamByIdVariables = {
  teamId: string;
};

export type GetIssueByIdVariables = {
  IssueId: string;
};

export type GetSprintByIdVariables = {
  id: string;
  projectId: string;
};

export type GetAllIssuesVariables = {
  projectId: string;
};

export type GetAllSprintsVariables = {
  projectId: string;
};

export type GetAllUserTeamsVariables = {
  userId: string;
};