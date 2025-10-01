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
  const idx = name.charCodeAt(0) % palette.length;
  return palette[idx];
};

const getUserInitials = (
  firstName?: string,
  lastName?: string,
  email?: string
): string => {
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  if (firstName) return firstName[0].toUpperCase();
  if (email) return email[0].toUpperCase();
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
  const resolvedFirst = firstName || (name ? name.split(' ')[0] : undefined);
  const resolvedLast = lastName || (name ? name.split(' ')[1] : undefined);

  const initials = getUserInitials(resolvedFirst, resolvedLast, email || name);
  const avatarBg = bgColor || getAvatarColor(resolvedFirst);

  // size handling: allow numeric px value or predefined sizes
  let sizeClasses = '';
  if (typeof size === 'number') {
    sizeClasses = '';
  } else {
    sizeClasses = sizeMap[size];
  }

  return (
    <div
      className={`relative rounded-full flex items-center justify-center font-bold text-white ${sizeClasses}`}
      style={typeof size === 'number' ? { width: size, height: size, fontSize: size / 2 } : undefined}
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
