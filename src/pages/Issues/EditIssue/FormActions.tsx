import React from 'react';
import Button from '../../../components/Button/Button';

interface FormActionsProps {
  onCancel: () => void;
  loading: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({ onCancel, loading }) => {
  return (
    <div className="flex justify-end gap-4 pt-4">
      <Button type="button" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" loading={loading}>
        Save Changes
      </Button>
    </div>
  );
};