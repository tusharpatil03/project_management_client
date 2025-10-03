import React from 'react';
import { Mail, Phone, Calendar, User, Users, MapPin } from 'lucide-react';

interface UserProfile {
  bio?: string | null;
  phone?: string | null;
  gender?: string | null;
  avatar?: string | null;
  social?: {
    github?: string | null;
    linkedin?: string | null;
    twitter?: string | null;
  };
}

interface UserAboutProps {
  profile?: UserProfile | null;
  email?: string;
  createdAt?: string;
}

/* ----- Helper Functions ----- */
function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/* ----- Info Card Component ----- */
interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
  href?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, label, value, href }) => {
  const content = (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group">
      <div className="flex-shrink-0 mt-0.5 text-gray-400 group-hover:text-gray-600 transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
          {label}
        </dt>
        <dd className="text-sm text-gray-900 break-words">
          {value || <span className="text-gray-400 italic">Not provided</span>}
        </dd>
      </div>
    </div>
  );

  if (href && value) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }

  return content;
};

/* ----- Main Component ----- */
const UserAbout: React.FC<UserAboutProps> = ({ profile, email, createdAt }) => {
  const formattedDate = formatDate(createdAt);
  const hasBio = profile?.bio && profile.bio.trim().length > 0;

  return (
    <section className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          About
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Bio Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            Bio
          </h3>
          {hasBio ? (
            <div className="prose prose-sm max-w-none">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {profile.bio}
              </p>
            </div>
          ) : (
            <div className="py-8 px-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-dashed border-gray-300 text-center">
              <div className="max-w-sm mx-auto">
                <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No bio added yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  A bio helps others know more about you
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Personal Information */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            Personal Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoCard
              icon={<Mail className="w-4 h-4" />}
              label="Email"
              value={email}
              href={email ? `mailto:${email}` : undefined}
            />

            <InfoCard
              icon={<Phone className="w-4 h-4" />}
              label="Phone"
              value={profile?.phone}
              href={profile?.phone ? `tel:${profile.phone}` : undefined}
            />

            <InfoCard
              icon={<User className="w-4 h-4" />}
              label="Gender"
              value={profile?.gender}
            />

            <InfoCard
              icon={<Calendar className="w-4 h-4" />}
              label="Member Since"
              value={formattedDate}
            />
          </div>
        </div>

        {/* Statistics (Optional - can be expanded) */}
        <div className="pt-4 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-lg bg-blue-50">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-xs text-gray-600 mt-1">Projects</div>
            </div>
            <div className="p-3 rounded-lg bg-purple-50">
              <div className="text-2xl font-bold text-purple-600">0</div>
              <div className="text-xs text-gray-600 mt-1">Activities</div>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-xs text-gray-600 mt-1">Teams</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserAbout;
