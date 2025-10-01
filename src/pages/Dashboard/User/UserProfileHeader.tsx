import React from 'react';
import { Github, Linkedin, Twitter, Mail, Calendar } from 'lucide-react';
import Avatar from '../../../components/Profile/Avatar';
import Button from '../../../components/Button/Button';

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  profile?: {
    bio?: string | null;
    phone?: string | null;
    gender?: string | null;
    avatar?: string | null;
    social?: {
      github?: string | null;
      linkedin?: string | null;
      twitter?: string | null;
    };
  };
}

interface UserProfileHeaderProps {
  user: UserData;
  authorized?: boolean;
  toggleEdit: Function;
}

interface SocialLinkProps {
  platform: 'github' | 'linkedin' | 'twitter';
  url?: string | null;
}

const socialConfig = {
  github: {
    Icon: Github,
    label: 'GitHub',
    color: 'hover:text-gray-900',
  },
  linkedin: {
    Icon: Linkedin,
    label: 'LinkedIn',
    color: 'hover:text-blue-600',
  },
  twitter: {
    Icon: Twitter,
    label: 'Twitter',
    color: 'hover:text-sky-500',
  },
} as const;

const SocialLink: React.FC<SocialLinkProps> = ({ platform, url }) => {
  const { Icon, label, color } = socialConfig[platform];

  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200 ${color}`}
      title={`${label} profile`}
      aria-label={`Visit ${label} profile`}
    >
      <Icon className="w-4 h-4 text-gray-600 group-hover:scale-110 transition-transform" />
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </a>
  );
};

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  user,
  authorized,
  toggleEdit
}) => {
  const fullName =
    `${user.firstName} ${user.lastName}`.trim() || 'Unnamed User';
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const hasSocialLinks =
    user.profile?.social?.github ||
    user.profile?.social?.linkedin ||
    user.profile?.social?.twitter;

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Cover Image */}
      <div className="relative h-28 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className={authorized ? 'absolute top-4 right-4' : 'hidden'}>
          <Button onClick={()=> {
            toggleEdit();
          }} size='sm'>Edit</Button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="px-6 pb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          {/* Left: Avatar + Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-start gap-4 -mt-14">
            {/* Avatar with proper z-index */}
            <div className="relative z-10">
              <Avatar
                firstName={user.firstName}
                lastName={user.lastName}
                email={user.email}
                src={user.profile?.avatar || undefined}
                size="large"
              />
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0 sm:mt-16">
              {/* Name */}
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                {fullName}
              </h1>

              {/* Email & Join Date */}
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
                <a
                  href={`mailto:${user.email}`}
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                  title={user.email}
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate max-w-xs">
                    {user.email || 'No email'}
                  </span>
                </a>

                {memberSince && (
                  <>
                    <span className="hidden sm:block text-gray-300">•</span>
                    <div className="inline-flex items-center gap-2 text-gray-500">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>Joined {memberSince}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Social Links */}
              {hasSocialLinks && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <SocialLink
                    platform="github"
                    url={user.profile?.social?.github}
                  />
                  <SocialLink
                    platform="linkedin"
                    url={user.profile?.social?.linkedin}
                  />
                  <SocialLink
                    platform="twitter"
                    url={user.profile?.social?.twitter}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfileHeader;
