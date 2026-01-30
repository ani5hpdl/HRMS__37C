import { useEffect, useState } from 'react';
import { Bell, Settings } from 'lucide-react';
import { getMyProfile } from '../services/api'; // path as per your project

const Header = ({
  title,
  subtitle,
  actions,
  rightContent
}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyProfile();

        // ✅ MATCH BACKEND: res.data.data
        if (res.data?.success) {
          setUser(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const initials = user?.name
    ? user.name
        .split(' ')
        .map(word => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-5 sticky top-0 z-20">
      <div className="flex items-center justify-between gap-6">

        {/* LEFT */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* CENTER ACTIONS */}
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}

        {/* RIGHT */}
        <div className="flex items-center gap-5">
          {rightContent}

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Settings */}
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <Settings size={20} />
          </button>

          {/* User */}
          <div className="flex items-center gap-3 pl-4 border-l min-w-[160px]">
            {loading ? (
              <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
            ) : (
              <div className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center font-bold text-white">
                {initials}
              </div>
            )}

            {!loading && user && (
              <div className="hidden md:block">
                <div className="font-semibold text-sm text-gray-900">
                  {user.name}
                </div>
                <div className="text-xs text-gray-500">
                  {user.role}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
