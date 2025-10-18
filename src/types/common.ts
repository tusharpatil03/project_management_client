
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE"
}

export enum Status {
  ACTIVE = "ACTIVE",
  PLANNED = "PLANNED",
  COMPLETE = "COMPLETE",
}

export enum IssueStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export enum IssuePriority{
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum IssueType {
  TASK = 'TASK',
  BUG = 'BUG',
  EPIC = 'EPIC',
  STORY = 'STORY',
}

export enum ProjectStatus {
  ACTIVE,
  PLANNED,
  COMPLETE,
}




export interface Social {
  id?: string | null;
  github?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface BaseEntity {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Timestamps {
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
}