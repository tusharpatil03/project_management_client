import React from 'react';
import { IssuePriority, IssueStatus, UpdateIssueInput } from '../../../types/';

interface IssueMetadataProps {
  formData: UpdateIssueInput;
  onChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
}

export const IssueMetadata: React.FC<IssueMetadataProps> = ({
  formData,
  onChange,
}) => {
  const inputClassName = "w-full pl-3 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const labelClassName = "block text-sm font-medium text-gray-700 mb-2";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClassName}>Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={onChange}
            className={inputClassName}
          >
            <option value="BUG">Bug</option>
            <option value="TASK">Task</option>
            <option value="STORY">Story</option>
            <option value="EPIC">Epic</option>
          </select>
        </div>
        <div>
          <label className={labelClassName}>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={onChange}
            className={inputClassName}
          >
            <option value={IssueStatus.DONE}>{IssueStatus.DONE}</option>
            <option value={IssueStatus.IN_PROGRESS}>{IssueStatus.IN_PROGRESS}</option>
            <option value={IssueStatus.TODO}>{IssueStatus.TODO}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClassName}>Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={onChange}
            className={inputClassName}
          >
            <option value={IssuePriority.LOW}>{IssuePriority.LOW}</option>
            <option value={IssuePriority.MEDIUM}>{IssuePriority.MEDIUM}</option>
            <option value={IssuePriority.HIGH}>{IssuePriority.HIGH}</option>
          </select>
        </div>
        <div>
          <label className={labelClassName}>Due Date</label>
          <input
            type="datetime-local"
            name="dueDate"
            value={formData.dueDate}
            onChange={onChange}
            className={inputClassName}
          />
        </div>
      </div>
    </div>
  );
};