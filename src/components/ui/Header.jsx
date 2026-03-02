import React, { useState } from 'react';
import Icon from '../AppIcon';
import UserProfileDropdown from './UserProfileDropdown';
import NotificationCenter from './NotificationCenter';
import useLocale from '../../hooks/useLocale';

import useAuthStore from '../../store/useAuthStore';
import { path } from 'd3';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuthStore();
  const isAdmin = user?.roles?.some(r => ['Super Admin', 'Admin'].includes(r.name));
  const isEmployee = user?.roles?.some(r => r.name === 'Employee');

  let navigationItems = [];
  let moreItems = [];

  // Employee only view if employee AND NOT admin
  if (isEmployee && !isAdmin) {
    navigationItems = [
      { label: 'Dashboard', path: '/employee-dashboard', icon: 'LayoutDashboard' }
    ];
    moreItems = [];
  } else {
    navigationItems = [
      { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
      { label: 'Employees', path: '/employee-management', icon: 'Users' },
      { label: 'Tasks', path: '/task-management', icon: 'CheckSquare' },
      { label: 'Time Tracking', path: '/time-tracking', icon: 'Clock' },
      { label: 'Project', path: '/projects', icon: 'Folder' }
    ];

    moreItems = [
      { label: 'Monitoring', path: '/monitoring-dashboard', icon: 'Monitor' },
      { label: 'Payroll', path: '/payroll', icon: 'DollarSign' },
      { label: 'Expenses', path: '/expenses', icon: 'CreditCard' },
      { label: 'Notifications', path: '/notifications', icon: 'Bell' },
      { label: 'Settings', path: '/settings', icon: 'Settings' },
    ];
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (path) => {
    window.location.href = path;
    setIsMobileMenuOpen(false);
  };

  const { location, currencySymbol } = useLocale();

  return (
    <header className="fixed top-0 left-0 right-0 bg-card border-b border-border z-50 h-16">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo Section */}
        <div className="flex items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Building2" size={20} color="white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground">CRM HRM</h1>
              <p className="text-xs text-muted-foreground -mt-1">Productivity System</p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-150"
            >
              <Icon name={item?.icon} size={16} />
              <span>{item?.label}</span>
            </button>
          ))}

          {/* More Dropdown */}
          <div className="relative group">
            <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-150">
              <Icon name="MoreHorizontal" size={16} />
              <span>More</span>
            </button>
            <div className="absolute top-full right-0 mt-1 w-48 bg-popover border border-border rounded-lg dropdown-shadow opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
              <div className="py-2">
                {moreItems?.map((item) => (
                  <button
                    key={item?.path}
                    onClick={() => handleNavigation(item?.path)}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-150"
                  >
                    <Icon name={item?.icon} size={16} />
                    <span>{item?.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {location && (
            <div className="hidden md:flex items-center px-3 py-1.5 bg-muted rounded-full border border-border">
              <Icon name="Globe" size={14} className="text-primary mr-2" />
              <span className="text-xs font-semibold text-foreground mr-1">{location.countryCode}</span>
              <span className="text-[10px] text-muted-foreground pt-0.5">({location.currency})</span>
            </div>
          )}
          <NotificationCenter />
          <UserProfileDropdown />

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-150"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>
      </div>
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-card border-b border-border dropdown-shadow">
          <nav className="py-4 px-6 space-y-2">
            {[...navigationItems, ...moreItems]?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className="flex items-center space-x-3 w-full px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-150"
              >
                <Icon name={item?.icon} size={18} />
                <span>{item?.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;