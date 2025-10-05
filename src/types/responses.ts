import { InterfaceAuth } from './user';
import { InterfaceProject } from './project';
import { InterfaceSprint } from './sprint';
import { IssueStatus } from './common';

export type BaseResponse = {
  success: boolean;
  status?: number;
  message?: string;
};

export type AuthResponse = {
  login: InterfaceAuth;
  signup: {
    message: string;
    success: boolean;
    status: number;
  };
};

export type GetUserByIdResponse = {
  getUserById: {
    id: string;
    email: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    gender?: string;
    avatar?: string;
    social?: {
      id: string;
      github?: string;
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      createdAt: string;
      updatedAt: string;
    };
    profile?: {
      id: string;
      avatar?: string;
      phone?: string;
      gender?: string;
      createdAt?: string;
      updatedAt?: string;
    };
    projects?: { id: string; key: string; name?: string }[];
    sprints?: { id: string; title: string }[];
    teams?: { id: string; name?: string }[];
    createdTeams?: { id: string; name?: string }[];
    createdIssues?: { id: string; title: string }[];
    assignedIssues?: { id: string; title: string }[];
  };
};

export type GetProjectByIdResponse = {
  getProjectById: InterfaceProject;
};

export type GetAllProjectsResponse = {
  getAllProjects: InterfaceProject[];
};

export type GetSprintByIdResponse = {
  getSprintById: InterfaceSprint & {
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

export type GetAllSprintsResponse = {
  getAllSprints: Array<InterfaceSprint & {
    creator?: {
      id: string;
    };
    project?: {
      id: string;
      name?: string;
    };
    issues?: { id: string; title: string; status?: string }[];
  }>;
};

export type GetIssueByIdResponse = {
  getIssueById: {
    id: string;
    title: string;
    description?: string;
    status?: IssueStatus;
    dueDate: string;
    creator?: {
      id: string;
      firstName?: string;
      lastName?: string;
      email?: string;
    };
    assignee?: {
      id: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      avatar?: string;
      createdAt?: string;
      updatedAt?: string;
      role?: string;
    };
  };
};

export type RefreshTokenResponse = {
  refreshToken: {
    accessToken: string;
    refreshToken: string;
  };
};

export type LogoutResponse = {
  logout: boolean;
};

export type HealthCheckResponse = {
  healthCheck: BaseResponse;
};