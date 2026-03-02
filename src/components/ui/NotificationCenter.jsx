import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import useInAppNotificationStore from '../../store/useInAppNotificationStore';

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { notifications, unreadCount, markRead, markAllRead, clearAll } = useInAppNotificationStore();

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscapeKey = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, []);

  const getTypeIcon = (type) => ({
    email: 'Mail',
    push: 'Bell',
    both: 'Zap',
    info: 'Info',
    success: 'CheckCircle',
    error: 'AlertCircle',
  }[type] || 'Bell');

  const getTypeColor = (type) => ({
    email: 'text-primary',
    push: 'text-warning',
    both: 'text-success',
    info: 'text-primary',
    success: 'text-success',
    error: 'text-error',
  }[type] || 'text-muted-foreground');

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <Icon name="Bell" size={20} />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-popover border border-border rounded-xl shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/20">
            <h3 className="text-sm font-bold text-foreground flex items-center">
              <Icon name="Bell" size={14} className="mr-2 text-primary" />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 bg-primary text-white text-[10px] font-bold rounded-full px-2 py-0.5">
                  {unreadCount} new
                </span>
              )}
            </h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-primary hover:text-primary/80 font-semibold">
                  Mark all read
                </button>
              )}
              <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-foreground">
                Clear
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Icon name="BellOff" size={32} className="text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm font-semibold text-foreground">You're all caught up!</p>
                <p className="text-xs text-muted-foreground mt-1">No new notifications</p>
              </div>
            ) : (
              <div>
                {notifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => { markRead(notif.id); }}
                    className={`w-full flex items-start space-x-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0 ${!notif.read ? 'bg-primary/5' : ''
                      }`}
                  >
                    <div className={`mt-0.5 flex-shrink-0 ${getTypeColor(notif.type)}`}>
                      <Icon name={getTypeIcon(notif.type)} size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-semibold truncate ${!notif.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notif.title}
                        </p>
                        {!notif.read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">{timeAgo(notif.timestamp)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-border bg-muted/10">
            <button
              onClick={() => { window.location.href = '/notifications'; setIsOpen(false); }}
              className="w-full text-center text-xs text-primary hover:text-primary/80 font-semibold py-1"
            >
              Open Notification Center →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;