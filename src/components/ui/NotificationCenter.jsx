import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'task',
      title: 'New task assigned',
      message: 'Review Q4 performance reports for Marketing team',
      time: '2 minutes ago',
      read: false,
      priority: 'high',
      actionUrl: '/task-management'
    },
    {
      id: 2,
      type: 'approval',
      title: 'Leave request pending',
      message: 'John Smith requested 3 days leave starting Dec 15',
      time: '15 minutes ago',
      read: false,
      priority: 'medium',
      actionUrl: '/employee-management'
    },
    {
      id: 3,
      type: 'system',
      title: 'Payroll processing complete',
      message: 'November payroll has been processed successfully',
      time: '1 hour ago',
      read: true,
      priority: 'low',
      actionUrl: '/payroll'
    },
    {
      id: 4,
      type: 'reminder',
      title: 'Team meeting reminder',
      message: 'Weekly standup meeting starts in 30 minutes',
      time: '2 hours ago',
      read: false,
      priority: 'medium',
      actionUrl: '/dashboard'
    },
    {
      id: 5,
      type: 'alert',
      title: 'System maintenance scheduled',
      message: 'Planned maintenance window: Dec 20, 2:00 AM - 4:00 AM',
      time: '1 day ago',
      read: true,
      priority: 'low',
      actionUrl: '/settings'
    }
  ]);

  const dropdownRef = useRef(null);
  const unreadCount = notifications?.filter(n => !n?.read)?.length;

  const getNotificationIcon = (type) => {
    const iconMap = {
      task: 'CheckSquare',
      approval: 'Clock',
      system: 'Settings',
      reminder: 'Bell',
      alert: 'AlertTriangle'
    };
    return iconMap?.[type] || 'Bell';
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'text-error';
    if (type === 'approval') return 'text-warning';
    if (type === 'system') return 'text-primary';
    return 'text-muted-foreground';
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    setNotifications(prev => 
      prev?.map(n => 
        n?.id === notification?.id ? { ...n, read: true } : n
      )
    );
    
    // Navigate to relevant page
    if (notification?.actionUrl) {
      window.location.href = notification?.actionUrl;
    }
    
    setIsOpen(false);
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev?.map(n => ({ ...n, read: true }))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

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
      {/* Notification Button */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <Icon name="Bell" size={20} />
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-error text-error-foreground text-xs font-semibold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>
      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-popover border border-border rounded-lg dropdown-shadow z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="text-sm font-semibold text-popover-foreground">
              Notifications
            </h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-primary hover:text-primary/80 font-medium transition-colors duration-150"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={clearAllNotifications}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                Clear all
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications?.length === 0 ? (
              <div className="p-8 text-center">
                <Icon name="Bell" size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No notifications</p>
                <p className="text-xs text-muted-foreground mt-1">
                  You're all caught up!
                </p>
              </div>
            ) : (
              <div className="py-2">
                {notifications?.map((notification) => (
                  <button
                    key={notification?.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full flex items-start space-x-3 p-4 text-left hover:bg-muted transition-colors duration-150 ${
                      !notification?.read ? 'bg-muted/50' : ''
                    }`}
                  >
                    <div className={`mt-1 ${getNotificationColor(notification?.type, notification?.priority)}`}>
                      <Icon name={getNotificationIcon(notification?.type)} size={16} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <p className={`text-sm font-medium ${
                          !notification?.read ? 'text-popover-foreground' : 'text-muted-foreground'
                        }`}>
                          {notification?.title}
                        </p>
                        {!notification?.read && (
                          <div className="w-2 h-2 bg-primary rounded-full ml-2 mt-1 flex-shrink-0"></div>
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification?.message}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-muted-foreground">
                          {notification?.time}
                        </p>
                        {notification?.priority === 'high' && (
                          <span className="text-xs bg-error/10 text-error px-2 py-0.5 rounded-full font-medium">
                            High Priority
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications?.length > 0 && (
            <div className="p-3 border-t border-border">
              <button
                onClick={() => {
                  window.location.href = '/notifications';
                  setIsOpen(false);
                }}
                className="w-full text-center text-xs text-primary hover:text-primary/80 font-medium transition-colors duration-150"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;