import React from 'react';

interface AvatarProps {
  firstName?: string;
  lastName?: string;
  email?: string;
  src?: string;
  size?: 'small' | 'medium' | 'large' | number;
  name?: string; // legacy prop (single string)
  bgColor?: string; // optional override
}

const sizeMap = {
  small: 'h-10 w-10 text-sm',
  medium: 'h-16 w-16 text-xl',
  large: 'h-28 w-28 text-3xl',
};

const getAvatarColor = (name?: string): string => {
  const palette = [
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-rose-500',
    'bg-orange-500',
  ];
  if (!name) return palette[0];
  // use first char code of name as seed, fallback to 0
  const seed = name.trim().length > 0 ? name.trim().charCodeAt(0) : 0;
  const idx = Math.abs(seed) % palette.length;
  return palette[idx];
};

const getUserInitials = (
  firstName?: string,
  lastName?: string,
  email?: string
): string => {
  // prefer first and last, then name parts from email, then fallback
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  if (firstName) return firstName[0].toUpperCase();

  if (email) {
    const local = email.split('@')[0];
    const parts = local.split(/[._-]/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    if (parts.length === 1 && parts[0].length > 0) return parts[0][0].toUpperCase();
  }

  return 'U';
};

const Avatar: React.FC<AvatarProps> = ({
  firstName,
  lastName,
  email,
  src,
  size = 'medium',
  name,
  bgColor,
}) => {
  // support legacy 'name' prop
  let resolvedFirst = firstName;
  let resolvedLast = lastName;

  if (!resolvedFirst && name) {
    const parts = name.trim().split(' ');
    resolvedFirst = parts[0];
    if (parts.length > 1) {
      resolvedLast = parts[parts.length - 1];
    }
  }

  const initials = getUserInitials(resolvedFirst, resolvedLast, email);
  const avatarBg = bgColor || getAvatarColor(resolvedFirst);

  let sizeClasses = '';
  if (typeof size === 'number') {
    sizeClasses = '';
  } else {
    sizeClasses = sizeMap[size];
  }

  return (
    <div
      className={`relative rounded-full flex items-center justify-center font-bold text-white ${sizeClasses}`}
      style={
        typeof size === 'number'
          ? { width: size, height: size, fontSize: size / 2 }
          : undefined
      }
    >
      {src ? (
        <img
          src={src}
          alt={`${resolvedFirst || 'User'}'s avatar`}
          className="h-full w-full object-cover rounded-full"
        />
      ) : (
        <div
          className={`h-full w-full rounded-full flex items-center justify-center ${avatarBg}`}
        >
          {initials}
        </div>
      )}
    </div>
  );
};

export default Avatar;
