import { gql } from '@apollo/client';

export const CREATE_ISSUE = gql`
  mutation CreateIssue($input: CreateIssueInput!) {
    createIssue(input: $input) {
      message
      success
    }
  }
`;

export const UPDATE_ISSUE_STATUS = gql`
  mutation changeStatus(
    $updateIssueStatusProjectId2: ID!
    $updateIssueStatusIssueId2: ID!
    $status: IssueStatus!
  ) {
    updateIssueStatus(
      projectId: $updateIssueStatusProjectId2
      issueId: $updateIssueStatusIssueId2
      status: $status
    ) {
      message
      status
      success
    }
  }
`;

export const ASSIGN_ISSUE = gql`
  mutation AssineIssue($input: AssignIssueInput!) {
    assineIssue(input: $input) {
      success
      status
      message
    }
  }
`;

export const REMOVE_ISSUE = gql`
  mutation RemoveIssue($issueId: ID!, $projectId: ID!) {
    removeIssue(issueId: $issueId, projectId: $projectId) {
      success
      status
      message
    }
  }
`;
export const REMOVE_ASSIGNEE_OF_ISSUE = gql`
  mutation RemoveAssineeOfIssue($issueId: ID!) {
    removeAssineeOfIssue(issueId: $issueId) {
      id
      title
      assignee {
        id
        username
      }
    }
  }
`;
