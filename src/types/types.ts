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
}
export type AuthResponce = {
    login: {
        accessToken: string;
        refreshToken: string;
    };
    signup: {
        accessToken: string;
         refreshToken: string;
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

export type CreateTaskInput = {
    title: string;
    description?: string;
    assigneeId?: string;
    projectId: string;
    dueDate: string;
    status?: string;
    sprintId?: string;
};
export type CreateTaskResponse = {
    createTask: {
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

export type CreateSprintInput = {
    title: string;
    description?: string;
    projectId: string;
    dueDate: string;
    status?: string;
    tasks?: CreateTaskInput[];
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
        tasks: { id: string; title: string; status?: string }[];
    };
};

export type UpdateTaskStatusInput = {
    projectId: string;
    taskId: string;
    status: string;
};
export type UpdateTaskStatusResponse = {
    updateTaskStatus: {
        success: boolean;
        status?: number;
        message?: string;
    };
};

export type AssignTaskInput = {
    taskId: string;
    assigneeId: string;
    projectId: string;
};
export type AssignTaskResponse = {
    assineTask: {
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
        };
        userProfile: {
            id: string;
            firstName: string;
            lastName: string;
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
        userProfile: {
            id: string;
            firstName: string;
            lastName: string;
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

export type RemoveTaskInput = {
    taskId: string;
    projectId: string;
};
export type RemoveTaskResponse = {
    removeTask: {
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

export type RemoveAssigneeOfTaskInput = {
    taskId: string;
};
export type RemoveAssigneeOfTaskResponse = {
    removeAssineeOfTask: {
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
        userProfile?: {
            id: string;
            firstName: string;
            lastName: string;
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
        createdTasks?: { id: string; title: string }[];
        assignedTasks?: { id: string; title: string }[];
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
        tasks?: { id: string; title: string }[];
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

export type GetTaskByIdResponse = {
    getTaskById: {
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

export type GetTaskByIdVariables = {
    taskId: string;
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
        tasks: { id: string; title: string; status?: string }[];
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

export type GetAllTasksResponse = {
    getAllTasks: {
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

export type GetAllTasksVariables = {
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
        tasks: { id: string; title: string; status?: string }[];
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
}