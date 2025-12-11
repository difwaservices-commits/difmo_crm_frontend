import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import Image from '../AppImage';
import useAuthStore from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const UserProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  // Get user initials from name
  const getInitials = (firstName, lastName) => {
    if (firstName && lastName) {
      return (firstName[0] + lastName[0]).toUpperCase();
    }
    if (firstName) return firstName.substring(0, 2).toUpperCase();
    return 'U';
  };

  // Get user's full name
  const getFullName = (user) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) return user.firstName;
    if (user?.lastName) return user.lastName;
    return user?.email || 'User';
  };

  // Get user's role name
  const getRoleName = (user) => {
    if (user?.roles && Array.isArray(user.roles) && user.roles.length > 0) {
      return user.roles[0].name || 'User';
    }
    return 'User';
  };

  const userProfile = {
    name: getFullName(user),
    email: user?.email || '',
    role: getRoleName(user),
    avatar: user?.avatar || '/assets/images/avatar-placeholder.jpg',
    initials: getInitials(user?.firstName, user?.lastName)
  };

  const menuItems = [
    {
      label: 'View Profile',
      icon: 'User',
      action: () => handleNavigation('/profile'),
      description: 'Manage your account settings'
    },
    {
      label: 'Account Settings',
      icon: 'Settings',
      action: () => handleNavigation('/account-settings'),
      description: 'Update preferences and security'
    },
    {
      label: 'Notifications',
      icon: 'Bell',
      action: () => handleNavigation('/notifications'),
      description: 'Configure notification preferences'
    },
    {
      label: 'Help & Support',
      icon: 'HelpCircle',
      action: () => handleNavigation('/help'),
      description: 'Get help and contact support'
    },
    {
      label: 'Sign Out',
      icon: 'LogOut',
      action: handleSignOut,
      description: 'Sign out of your account',
      variant: 'destructive'
    }
  ];

  function handleNavigation(path) {
    setIsOpen(false);
    window.location.href = path;
  }

  function handleSignOut() {
    setIsOpen(false);
    // Use auth store logout
    logout();
    // Redirect to login page
    navigate('/login');
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event?.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            <Image
              src={userProfile?.avatar}
              alt={`${userProfile?.name} profile picture`}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Online status indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success border-2 border-card rounded-full"></div>
        </div>

        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-foreground">{userProfile?.name}</p>
          <p className="text-xs text-muted-foreground">{userProfile?.role}</p>
        </div>

        <Icon
          name="ChevronDown"
          size={16}
          className={`text-muted-foreground transition-transform duration-150 ${isOpen ? 'rotate-180' : ''
            }`}
        />
      </button>
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-popover border border-border rounded-lg dropdown-shadow z-50">
          {/* User Info Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                <Image
                  src={userProfile?.avatar}
                  alt={`${userProfile?.name} profile picture`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-popover-foreground truncate">
                  {userProfile?.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {userProfile?.email}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems?.map((item, index) => (
              <button
                key={index}
                onClick={item?.action}
                className={`w-full flex items-start space-x-3 px-4 py-3 text-left hover:bg-muted transition-colors duration-150 ${item?.variant === 'destructive' ? 'text-destructive hover:text-destructive' : 'text-popover-foreground'
                  }`}
              >
                <Icon
                  name={item?.icon}
                  size={16}
                  className={`mt-0.5 ${item?.variant === 'destructive' ? 'text-destructive' : 'text-muted-foreground'
                    }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item?.label}</p>
                  <p className="text-xs text-muted-foreground">{item?.description}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-border bg-muted/50">
            <p className="text-xs text-muted-foreground text-center">
              Last login: Today at 9:15 AM
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;