import React from 'react';

interface AvatarProps {
  name?: string;
  src?: string;
  size?: number; // in pixels
  bgColor?: string;
  textColor?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = 40,
  bgColor = '#ccc',
  textColor = '#fff',
}) => {
  const getInitial = (name?: string) =>
    name?.trim().charAt(0).toUpperCase() || '?';

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: src ? 'transparent' : bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        fontSize: size / 2,
        color: textColor,
        fontWeight: 'bold',
        textTransform: 'uppercase',
      }}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        getInitial(name)
      )}
    </div>
  );
};

export default Avatar;