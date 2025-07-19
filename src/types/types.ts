export type SignupInput = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthResponce = {
  login: {
    user: InterfaceUser;
    accessToken: string;
    refreshToken: string;
  };
  signup: {
    message: string;
    success: boolean;
    status: number;
  };
};

export type CreateProjectInput = {
  name: string;
  key: string;
  description?: string;
};

export type CreateProjectResponse = {
  createProject: {
    id: string;
    key: string;
    name?: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    status?: string;
    creatorId: string;
  };
};

export interface InterfaceUser {
  id: string;
  email: string;
  username: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  projects: InterfaceProject[];
  sprints: InterfaceSprint[];
  teams: InterfaceTeam[];
  createdTeams: InterfaceTeam[];
  createdIssues: InterfaceIssue[];
  assignedIssues: InterfaceIssue[];
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
  avatar: string;
  social: Social;
  profile: InterfaceUserProfile;
}

interface Social {
  id: string;
  github: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  createdAt: Date;
  updatedAt: Date;
}

interface InterfaceTeam {
  id: string;
  name: string;
  creatorId: string;
  members: InterfaceUser[];
  projects: InterfaceProject[];
  createdAt: Date;
  updatedAt: Date;
}

interface InterfaceUserProfile {
  id: string;
  avatar: string;
  phone: string;
  gender: string;
  social: Social;
  createdAt: Date;
  updatedAt: Date;
  user: InterfaceUser;
}

export interface InterfaceIssue {
  id: string;
  title: string;
  description?: string;
  type: IssueType;
  creator: InterfaceUser;
  creatorId?: string;
  assignee?: InterfaceUser;
  projectId?: string;
  sprintId?: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  dueDate: Date;
}

export interface InterfaceProject {
  id: string;
  key: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  creatorId: string;
  dueDate: string;
  issues?: InterfaceIssue[];
  sprints?: InterfaceSprint[];
}

export interface InterfaceSprint {
  id: string;
  title: string;
  status: string;
  description: string;
  dueDate: string;
  issues?: InterfaceIssue[];
}

export type CreateTeamInput = {
  name: string;
};

export type CreateTeamResponse = {
  createTeam: {
    id: string;
    name?: string;
    creatorId?: string;
    members?: { id: string; email: string; username: string }[];
    projects?: { id: string; name?: string }[];
    createdAt?: string;
    updatedAt?: string;
  };
};

export enum IssueStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export enum IssueType {
  TASK = 'TASK',
  BUG = 'BUG',
  EPIC = 'EPIC',
  STORY = 'STORY',
}

export type CreateIssueInput = {
  title: string;
  description?: string;
  type: IssueType;
  assigneeId?: string;
  projectId: string;
  dueDate: string;
  status?: IssueStatus;
  sprintId?: string;
};

export type CreateIssueResponse = {
  createIssue: {
    id: string;
    title: string;
    description?: string;
    status?: string;
    dueDate: string;
    createdAt?: string;
    updatedAt?: string;
    projectId?: string;
    sprintId?: string;
    creator?: {
      id: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      username: string;
    };
    assignee?: InterfaceUser;
  };
};

export type CreateSprintInput = {
  title: string;
  description?: string;
  projectId: string;
  dueDate: string;
  issues?: CreateIssueInput[];
};

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
      username: string;
    };
    project?: {
      id: string;
      name?: string;
    };
    issues: { id: string; title: string; status?: string }[];
  };
};

export type ChangeIssueStatusInput = {
  projectId: string;
  IssueId: string;
  status: string;
};
export type ChangeIssueStatusResponse = {
  ChangeIssueStatus: {
    success: boolean;
    status?: number;
    message?: string;
  };
};

export type AssignIssueInput = {
  issueId: string;
  assigneeId: string;
  projectId: string;
};
export type AssignIssueResponse = {
  assineIssue: {
    success: boolean;
    status?: number;
    message?: string;
  };
};

export type SignupResponse = {
  signup: {
    user: {
      id: string;
      email: string;
      username: string;
      firstName: string;
      lastName: string;
    };
    profile: {
      id: string;
      gender: string;
      avatar: string;
    };
    accessToken: string;
    refreshToken: string;
  };
};

export type LoginResponse = {
  login: {
    user: {
      id: string;
      email: string;
      username: string;
    };
    profile: {
      id: string;
      gender: string;
      avatar: string;
    };
    accessToken: string;
    refreshToken: string;
  };
};

export type RemoveProjectInput = {
  projectId: string;
};
export type RemoveProjectResponse = {
  removeProject: {
    success: boolean;
    status?: number;
    message?: string;
  };
};

export type RemoveIssueInput = {
  issueId: string;
  projectId: string;
};
export type RemoveIssueResponse = {
  removeIssue: {
    success: boolean;
    status?: number;
    message?: string;
  };
};

export type RemoveSprintInput = {
  sprintId: string;
  projectId: string;
};

export type RemoveSprintResponse = {
  removeSprint: {
    success: boolean;
    status?: number;
    message?: string;
  };
};

export type RemoveAssigneeOfIssueInput = {
  IssueId: string;
};
export type RemoveAssigneeOfIssueResponse = {
  removeAssineeOfIssue: {
    id: string;
    title: string;
    assignee?: {
      id: string;
      username: string;
    };
  };
};

export type RemoveTeamInput = {
  teamId: string;
};
export type RemoveTeamResponse = {
  removeTeam: {
    success: boolean;
    status?: number;
    message?: string;
  };
};

export type AddTeamMemberInput = {
  memberId: string;
  teamId: string;
  role: string;
};
export type AddTeamMemberResponse = {
  addTeamMember: {
    id: string;
    name?: string;
    members?: { id: string; username: string; email: string }[];
  };
};

export type LogoutResponse = {
  logout: boolean;
};

export type RemoveTeamMemberInput = {
  memberId: string;
  teamId: string;
};
export type RemoveTeamMemberResponse = {
  removeTeamMember: {
    id: string;
    name?: string;
    members?: { id: string; username: string; email: string }[];
  };
};

export type RefreshTokenInput = {
  refreshToken?: string;
};
export type RefreshTokenResponse = {
  refreshToken: {
    accessToken: string;
    refreshToken: string;
  };
};

export type HealthCheckResponse = {
  healthCheck: {
    success: boolean;
    status: number;
    message: string;
  };
};

export type GetUserByIdResponse = {
  getUserById: {
    id: string;
    email: string;
    username: string;
    role?: string;
    createdAt?: string;
    updatedAt?: string;
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

export type GetUserByIdVariables = {
  userId: string;
};

export type GetProjectByIdResponse = {
  getProjectById: {
    id: string;
    key: string;
    name?: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    status?: string;
    creatorId: string;
    issues?: { id: string; title: string }[];
  };
};

export type GetProjectByIdVariables = {
  projectId: string;
};

export type GetTeamByIdResponse = {
  getTeamById: {
    id: string;
    name?: string;
    creatorId?: string;
    members?: { id: string; email: string; username: string }[];
    projects?: { id: string; name?: string }[];
    createdAt?: string;
    updatedAt?: string;
  };
};

export type GetTeamByIdVariables = {
  teamId: string;
};

export type GetIssueByIdResponse = {
  getIssueById: {
    id: string;
    title: string;
    description?: string;
    status?: string;
    dueDate: string;
    createdAt?: string;
    updatedAt?: string;
    projectId?: string;
    sprintId?: string;
    creator?: {
      id: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      username: string;
    };
    assignee?: {
      id: string;
      firstName?: string;
      lastName?: string;
      username?: string;
      email?: string;
      avatar?: string;
      createdAt?: string;
      updatedAt?: string;
      role?: string;
    };
  };
};

export type GetIssueByIdVariables = {
  IssueId: string;
};

export type GetSprintByIdResponse = {
  getSprintById: {
    id: string;
    title: string;
    description?: string;
    status: string;
    dueDate: string;
    createdAt?: string;
    updatedAt?: string;
    creator?: {
      id: string;
      username: string;
    };
    project?: {
      id: string;
      name?: string;
    };
    issues: { id: string; title: string; status?: string }[];
  };
};

export type GetSprintByIdVariables = {
  id: string;
  projectId: string;
};

export type GetAllProjectsResponse = {
  getAllProjects: {
    id: string;
    key: string;
    name?: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    status?: string;
    creatorId: string;
  }[];
};

export type GetAllIssuesResponse = {
  getAllIssues: {
    id: string;
    title: string;
    type: IssueType;
    description?: string;
    status?: string;
    dueDate: string;
    createdAt?: string;
    updatedAt?: string;
    projectId?: string;
    sprintId?: string;
    creator: {
      id: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      username: string;
    };
    assignee?: {
      id: string;
      firstName?: string;
      lastName?: string;
      username?: string;
      email?: string;
      avatar?: string;
      createdAt?: string;
      updatedAt?: string;
      role?: string;
    };
  }[];
};

export type GetAllIssuesVariables = {
  projectId: string;
};

export type GetAllSprintsResponse = {
  getAllSprints: {
    id: string;
    title: string;
    description?: string;
    status: string;
    dueDate: string;
    createdAt?: string;
    updatedAt?: string;
    creator?: {
      id: string;
      username: string;
    };
    project?: {
      id: string;
      name?: string;
    };
    issues?: { id: string; title: string; status?: string }[];
  }[];
};

export type GetAllSprintsVariables = {
  projectId: string;
};

export type GetAllUserTeamsResponse = {
  getAllUserTeams: {
    id: string;
    name?: string;
    creatorId?: string;
    members?: { id: string; email: string; username: string }[];
    projects?: { id: string; name?: string }[];
    createdAt?: string;
    updatedAt?: string;
  }[];
};

export type GetAllUserTeamsVariables = {
  userId: string;
};
