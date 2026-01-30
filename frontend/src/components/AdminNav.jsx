import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Calendar,
  DollarSign,
  Star,
  Users,
  Bed,
  Menu,
  ClipboardList,
  Boxes,
  FileText,
  BedDouble
} from 'lucide-react';

const NAV_SECTIONS = [
  {
    title: 'Core',
    items: [
      { icon: Home, label: 'Dashboard', path: '/dashboard' },
      { icon: Calendar, label: 'Reservation', path: '/reservation' },
      { icon: Bed, label: 'Rooms', path: '/admin/rooms' },
      { icon: BedDouble, label: 'Rooms Types', path: '/room-types' }
    ]
  },
  {
    title: 'Operations',
    items: [
      { icon: ClipboardList, label: 'Housekeeping', path: '/housekeeping' },
      { icon: Boxes, label: 'Inventory', path: '/inventory' },
      { icon: Calendar, label: 'Calendar', path: '/calendar' }
    ]
  },
  {
    title: 'Finance',
    items: [
      { icon: DollarSign, label: 'Expenses', path: '/expenses' },
      { icon: FileText, label: 'Invoices', path: '/invoices' }
    ]
  },
  {
    title: 'Business',
    items: [
      { icon: Star, label: 'Reviews', path: '/reviews' },
      { icon: Users, label: 'Users', path: '/users' }
    ]
  }
];

const AdminNav = ({ isSidebarOpen = true, onToggleSidebar }) => {
  return (
    <aside
      className={`
        ${isSidebarOpen ? 'w-64' : 'w-20'}
        bg-white border-r border-gray-200
        transition-all duration-300
        flex flex-col
        h-screen
        sticky top-0
      `}
    >
      {/* Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b shrink-0">
        {isSidebarOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg" />
            <span className="font-bold text-lg text-gray-800">HotelMS</span>
          </div>
        )}
        <button
          onClick={onToggleSidebar}
          className="text-gray-500 hover:text-gray-700"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Navigation (NO SCROLL) */}
      <nav className="flex-1 px-2 py-4">
        {NAV_SECTIONS.map(section => (
          <div key={section.title} className="mb-4">
            {isSidebarOpen && (
              <p className="px-3 mb-2 text-xs font-semibold text-black-400 uppercase">
                {section.title}
              </p>
            )}

            {section.items.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg text-sm transition-colors
                  ${
                    isActive
                      ? 'bg-yellow-50 text-yellow-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-yellow-500" />
                    )}
                    <item.icon size={18} className="shrink-0" />
                    {isSidebarOpen && <span>{item.label}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default AdminNav;