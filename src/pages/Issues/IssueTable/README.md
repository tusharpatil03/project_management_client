# Issue Table Components Structure

This directory contains the components used in the IssueTable view. The components are organized to provide a clear and efficient way to display and manage issues in a tabular format.

## Core Component

1. `IssuesTable.tsx`
   - Main container component for the issues table
   - Handles data fetching and state management
   - Manages sorting and filtering logic
   - Orchestrates all sub-components

## Sub-components (in /components)

1. `IssueTableHeader.tsx`
   - Renders the table header with column titles
   - Handles sorting functionality
   - Contains filter controls

2. `IssueTableRow.tsx`
   - Renders individual issue rows
   - Handles row-level interactions
   - Displays issue status, title, assignee, and other metadata

3. `IssueStatusBadge.tsx`
   - Visual representation of issue status
   - Color-coded badges for different states
   - Consistent status display across the application

4. `AssignMemberModal.tsx`
   - Modal component for assigning members to issues
   - User search and selection interface
   - Handles assignment updates

## Component Organization

The components are exported through `components/index.ts` for clean imports:

```typescript
import {
  IssueTableHeader,
  IssueTableRow,
  IssueStatusBadge,
  AssignMemberModal,
} from './components';
```

## Component Hierarchy

```
IssuesTable
├── IssueTableHeader
├── IssueTableRow[]
│   ├── IssueStatusBadge
│   └── AssignMemberModal (when needed)
```

## Usage

The IssueTable component is designed to be flexible and reusable across different views. It can be customized through props for different use cases:

```typescript
<IssuesTable 
  projectId={projectId}
  sprintId={sprintId} // optional
  onRowClick={handleRowClick}
  onStatusChange={handleStatusChange}
/>
```

Each component is built with TypeScript for type safety and follows React best practices for performance and maintainability.
