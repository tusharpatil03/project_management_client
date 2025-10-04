# Issue Details Components Structure

This directory contains the components used in the IssueDetails view. The components are organized as follows:

## Core Components

1. `IssueDetails.tsx`
   - Main container component
   - Handles loading states and data fetching
   - Orchestrates all sub-components

## Sub-components (in /components)

1. `LoadingAndError.tsx`
   - `LoadingState`: Shows loading spinner
   - `ErrorState`: Displays error messages with retry option

2. `IssueHeader.tsx`
   - Displays the issue ID and title
   - Contains close button

3. `IssueStatus.tsx`
   - Shows issue status (OPEN, IN_PROGRESS, etc.)
   - Displays due date information
   - Handles status colors and date formatting

4. `IssueDescription.tsx`
   - Renders the issue description
   - Handles empty state

5. `IssuePeople.tsx`
   - Shows assignee and creator information
   - Displays avatars and user details

6. `IssueTimeline.tsx`
   - Shows creation and last update timestamps
   - Formats dates consistently

7. `IssueFooter.tsx`
   - Contains action buttons (Close, Edit)
   - Handles transitions between states

## Usage

Import components from the components directory:

```typescript
import {
  LoadingState,
  ErrorState,
  IssueHeader,
  IssueStatus,
  IssueDescription,
  IssuePeople,
  IssueTimeline,
  IssueFooter,
} from './components';
```

Each component is designed to be self-contained and handle its own styling and logic while maintaining consistency with the overall design system.