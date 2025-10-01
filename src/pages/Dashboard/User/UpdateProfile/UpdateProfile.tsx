import React, { useState, useCallback, useMemo } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_USER_PROFILE } from '../../../../graphql/Mutation/user';
import { UserData } from '../UserBoard';
import { Gender, Social } from '../../../../types/types';
import { useMessage } from '../../../../components/ShowMessage';

interface UpdateProfileProps {
  userData: UserData;
  toggleEdit: () => void;
  refetch: () => Promise<any>;
}

interface UpdateProfileInput {
  firstName: string;
  lastName: string;
  profile: {
    bio: string;
    phone: string;
    gender: Gender;
    social: Social;
    avatar: string;
  };
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  [key: string]: string | undefined;
}

// Constants
const GENDERS: readonly Gender[] = [Gender.MALE, Gender.FEMALE] as const;

const SOCIAL_PLATFORMS = [
  { key: 'github', label: 'GitHub', placeholder: 'github.com/username' },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    placeholder: 'linkedin.com/in/username',
  },
  { key: 'twitter', label: 'Twitter', placeholder: 'twitter.com/username' },
] as const;

const PHONE_REGEX = /^[\d\s\-\+\(\)]+$/;
const URL_REGEX =
  /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
const NAME_REGEX = /^[a-zA-Z\s'-]+$/;

const UpdateProfile: React.FC<UpdateProfileProps> = ({
  userData,
  toggleEdit,
  refetch,
}) => {
  // Initialize form data with proper defaults
  const initialFormData = useMemo<UpdateProfileInput>(
    () => ({
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      profile: {
        bio: userData.profile?.bio || '',
        phone: userData.profile?.phone || '',
        gender: userData.profile?.gender || Gender.MALE,
        avatar: userData.profile?.avatar || '',
        social: {
          github: userData.profile?.social?.github || '',
          linkedin: userData.profile?.social?.linkedin || '',
          twitter: userData.profile?.social?.twitter || '',
        },
      },
    }),
    [userData]
  );

  const [formData, setFormData] = useState<UpdateProfileInput>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isDirty, setIsDirty] = useState(false);

  const { showSuccess, showError } = useMessage();

  const [updateUserProfile, { loading }] = useMutation(UPDATE_USER_PROFILE, {
    onCompleted: async () => {
      showSuccess('Profile updated successfully!');
      await refetch();
      setTimeout(() => {
        toggleEdit();
      }, 300);
    },
    onError: (err) => {
      console.error('Profile update error:', err);
      const errorMessage =
        err.message || 'Failed to update profile. Please try again.';
      showError(errorMessage);
    },
  });

  // Validation functions
  const validateField = useCallback(
    (name: string, value: string): string | undefined => {
      switch (name) {
        case 'firstName':
        case 'lastName':
          if (value && !NAME_REGEX.test(value)) {
            return `${name === 'firstName' ? 'First' : 'Last'} name can only contain letters, spaces, hyphens, and apostrophes`;
          }
          if (value && value.length > 50) {
            return `${name === 'firstName' ? 'First' : 'Last'} name must be less than 50 characters`;
          }
          break;
        case 'phone':
          if (value && !PHONE_REGEX.test(value)) {
            return 'Invalid phone number format';
          }
          if (value && value.length < 10) {
            return 'Phone number must be at least 10 digits';
          }
          break;
        case 'avatar':
          if (value && !URL_REGEX.test(value)) {
            return 'Please enter a valid URL';
          }
          break;
        case 'bio':
          if (value && value.length > 500) {
            return 'Bio must be less than 500 characters';
          }
          break;
      }
      return undefined;
    },
    []
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Validate basic fields
    ['firstName', 'lastName'].forEach((field) => {
      const error = validateField(
        field,
        formData[field as keyof typeof formData] as string
      );
      if (error) newErrors[field] = error;
    });

    // Validate profile fields
    const phoneError = validateField('phone', formData.profile.phone);
    if (phoneError) newErrors.phone = phoneError;

    const avatarError = validateField('avatar', formData.profile.avatar);
    if (avatarError) newErrors.avatar = avatarError;

    const bioError = validateField('bio', formData.profile.bio);
    if (bioError) newErrors.bio = bioError;

    // Validate social links
    Object.entries(formData.profile.social).forEach(([platform, url]) => {
      if (url && !URL_REGEX.test(url)) {
        newErrors[platform] = `Invalid ${platform} URL`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  // Handle input changes with proper typing
  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setIsDirty(true);

      // Clear error for this field when user starts typing
      setErrors((prev) => ({ ...prev, [name]: undefined }));

      // Handle nested profile fields
      if (
        name === 'bio' ||
        name === 'phone' ||
        name === 'gender' ||
        name === 'avatar'
      ) {
        setFormData((prev) => ({
          ...prev,
          profile: {
            ...prev.profile,
            [name]: value,
          },
        }));
      }
      // Handle social fields
      else if (name === 'github' || name === 'linkedin' || name === 'twitter') {
        setFormData((prev) => ({
          ...prev,
          profile: {
            ...prev.profile,
            social: {
              ...prev.profile.social,
              [name]: value,
            },
          },
        }));
      }
      // Handle top-level fields
      else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }

      // Real-time validation
      const error = validateField(name, value);
      if (error) {
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [validateField]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showError('Please fix the errors before submitting');
      return;
    }

    try {
      await updateUserProfile({
        variables: {
          input: {
            firstName: formData.firstName || null,
            lastName: formData.lastName || null,
            profile: {
              bio: formData.profile.bio || null,
              phone: formData.profile.phone || null,
              gender: formData.profile.gender,
              avatar: formData.profile.avatar || null,
              social: {
                github: formData.profile.social.github || null,
                linkedin: formData.profile.social.linkedin || null,
                twitter: formData.profile.social.twitter || null,
              },
            },
          },
        },
      });
    } catch (error) {
      // Error is handled by onError callback
      console.error('Submit error:', error);
    }
  };

  const handleCancel = useCallback(() => {
    if (isDirty) {
      const confirmCancel = window.confirm(
        'You have unsaved changes. Are you sure you want to cancel?'
      );
      if (!confirmCancel) return;
    }
    toggleEdit();
  }, [isDirty, toggleEdit]);

  const handleReset = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setIsDirty(false);
  }, [initialFormData]);

  // Character count for bio
  const bioCharCount = formData.profile.bio.length;
  const maxBioLength = 500;

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Update Profile</h2>
        <button
          type="button"
          onClick={handleCancel}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-lg border ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              } shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent px-3 py-2`}
              aria-invalid={!!errors.firstName}
              aria-describedby={
                errors.firstName ? 'firstName-error' : undefined
              }
            />
            {errors.firstName && (
              <p id="firstName-error" className="mt-1 text-sm text-red-600">
                {errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-lg border ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              } shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent px-3 py-2`}
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? 'lastName-error' : undefined}
            />
            {errors.lastName && (
              <p id="lastName-error" className="mt-1 text-sm text-red-600">
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Bio with character count */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700"
            >
              Bio
            </label>
            <span
              className={`text-xs ${bioCharCount > maxBioLength ? 'text-red-600' : 'text-gray-500'}`}
            >
              {bioCharCount}/{maxBioLength}
            </span>
          </div>
          <textarea
            id="bio"
            name="bio"
            value={formData.profile.bio}
            onChange={handleChange}
            rows={4}
            className={`mt-1 block w-full rounded-lg border ${
              errors.bio ? 'border-red-500' : 'border-gray-300'
            } shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent px-3 py-2 resize-none`}
            placeholder="Tell us about yourself..."
            aria-invalid={!!errors.bio}
            aria-describedby={errors.bio ? 'bio-error' : undefined}
          />
          {errors.bio && (
            <p id="bio-error" className="mt-1 text-sm text-red-600">
              {errors.bio}
            </p>
          )}
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.profile.phone}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-lg border ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              } shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent px-3 py-2`}
              placeholder="+1 (555) 123-4567"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
            />
            {errors.phone && (
              <p id="phone-error" className="mt-1 text-sm text-red-600">
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.profile.gender}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent px-3 py-2"
            >
              {GENDERS.map((gender) => (
                <option key={gender} value={gender}>
                  {gender.charAt(0).toUpperCase() +
                    gender.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Avatar URL */}
        <div>
          <label
            htmlFor="avatar"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Avatar URL
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="url"
              id="avatar"
              name="avatar"
              value={formData.profile.avatar}
              onChange={handleChange}
              className={`flex-1 rounded-lg border ${
                errors.avatar ? 'border-red-500' : 'border-gray-300'
              } shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent px-3 py-2`}
              placeholder="https://example.com/avatar.jpg"
              aria-invalid={!!errors.avatar}
              aria-describedby={errors.avatar ? 'avatar-error' : undefined}
            />
            {formData.profile.avatar && !errors.avatar && (
              <img
                src={formData.profile.avatar}
                alt="Avatar preview"
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
          </div>
          {errors.avatar && (
            <p id="avatar-error" className="mt-1 text-sm text-red-600">
              {errors.avatar}
            </p>
          )}
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Social Links
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {SOCIAL_PLATFORMS.map(({ key, label, placeholder }) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  {label}
                </label>
                <input
                  type="url"
                  id={key}
                  name={key}
                  value={formData.profile.social[key as keyof Social] as string}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-lg border ${
                    errors[key] ? 'border-red-500' : 'border-gray-300'
                  } shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent px-3 py-2 text-sm`}
                  placeholder={placeholder}
                  aria-invalid={!!errors[key]}
                  aria-describedby={errors[key] ? `${key}-error` : undefined}
                />
                {errors[key] && (
                  <p id={`${key}-error`} className="mt-1 text-xs text-red-600">
                    {errors[key]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t">
          <button
            type="button"
            onClick={handleReset}
            disabled={!isDirty || loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Reset
          </button>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isDirty}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <span>Updating...</span>
                </>
              ) : (
                <span>Update Profile</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
