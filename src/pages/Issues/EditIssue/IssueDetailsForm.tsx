import React from 'react';
import InputField from '../../../components/InputField/InputField';
import TextAreaField from '../../../components/InputField/TextArea';
import { UpdateIssueInput } from '../../../types/issue';

interface IssueDetailsFormProps {
  formData: UpdateIssueInput;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const IssueDetailsForm: React.FC<IssueDetailsFormProps> = ({
  formData,
  onChange,
}) => {
  return (
    <div className="space-y-5">
      <InputField
        label="title"
        type="text"
        name="title"
        value={formData.title || ''}
        onChange={onChange}
        required={true}
      />

      <TextAreaField
        label="description"
        name="description"
        rows={4}
        value={formData.description || ''}
        onChange={onChange}
      />
    </div>
  );
};