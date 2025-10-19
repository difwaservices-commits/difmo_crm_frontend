import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const RecentActivityFeed = () => {
  const activities = [
  {
    id: 1,
    type: 'checkin',
    user: 'Sarah Johnson',
    avatar: "https://images.unsplash.com/photo-1684262855358-88f296a2cfc2",
    avatarAlt: 'Professional woman with shoulder-length brown hair in white blazer smiling at camera',
    action: 'checked in',
    location: 'Office - Marketing Floor',
    timestamp: '2 minutes ago',
    icon: 'LogIn',
    color: 'success'
  },
  {
    id: 2,
    type: 'task',
    user: 'Michael Chen',
    avatar: "https://images.unsplash.com/photo-1629272039203-7d76fdaf1324",
    avatarAlt: 'Asian man with short black hair in navy blue suit jacket smiling professionally',
    action: 'completed task',
    details: 'Q4 Financial Report Review',
    timestamp: '15 minutes ago',
    icon: 'CheckCircle',
    color: 'primary'
  },
  {
    id: 3,
    type: 'leave',
    user: 'Emily Rodriguez',
    avatar: "https://images.unsplash.com/photo-1706565029882-6f25f1d9af65",
    avatarAlt: 'Hispanic woman with long dark hair in professional black blazer with warm smile',
    action: 'submitted leave request',
    details: 'Vacation: Dec 20-27, 2024',
    timestamp: '1 hour ago',
    icon: 'Calendar',
    color: 'warning'
  },
  {
    id: 4,
    type: 'announcement',
    user: 'HR Department',
    avatar: "https://images.unsplash.com/photo-1734716355718-ed9def14291a",
    avatarAlt: 'Professional office building exterior with modern glass facade and corporate branding',
    action: 'posted announcement',
    details: 'Holiday Schedule & Year-end Bonuses',
    timestamp: '2 hours ago',
    icon: 'Megaphone',
    color: 'primary'
  },
  {
    id: 5,
    type: 'checkout',
    user: 'David Kim',
    avatar: "https://images.unsplash.com/photo-1698072556534-40ec6e337311",
    avatarAlt: 'Korean man with glasses and short black hair in light blue dress shirt smiling confidently',
    action: 'checked out',
    location: 'WFH - Development Team',
    timestamp: '3 hours ago',
    icon: 'LogOut',
    color: 'error'
  }];


  const getIconColor = (color) => {
    const colors = {
      success: 'text-success',
      primary: 'text-primary',
      warning: 'text-warning',
      error: 'text-error'
    };
    return colors?.[color] || 'text-muted-foreground';
  };

  const handleViewAll = () => {
    window.location.href = '/activity-log';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 card-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Latest employee actions and updates</p>
        </div>
        <button
          onClick={handleViewAll}
          className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-primary hover:text-primary/80 hover:bg-primary/10 rounded-md transition-colors duration-150">

          <span>View All</span>
          <Icon name="ArrowRight" size={14} />
        </button>
      </div>
      <div className="space-y-4">
        {activities?.map((activity) =>
        <div key={activity?.id} className="flex items-start space-x-3 p-3 hover:bg-muted/50 rounded-lg transition-colors duration-150">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                <Image
                src={activity?.avatar}
                alt={activity?.avatarAlt}
                className="w-full h-full object-cover" />

              </div>
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 bg-card border-2 border-card rounded-full flex items-center justify-center ${getIconColor(activity?.color)}`}>
                <Icon name={activity?.icon} size={12} />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  <span className="font-semibold">{activity?.user}</span>
                  <span className="font-normal text-muted-foreground ml-1">{activity?.action}</span>
                </p>
                <span className="text-xs text-muted-foreground">{activity?.timestamp}</span>
              </div>
              
              {activity?.details &&
            <p className="text-sm text-muted-foreground mt-1">{activity?.details}</p>
            }
              
              {activity?.location &&
            <div className="flex items-center space-x-1 mt-1">
                  <Icon name="MapPin" size={12} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{activity?.location}</span>
                </div>
            }
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          Showing latest 5 activities • Last updated: {new Date()?.toLocaleTimeString()}
        </p>
      </div>
    </div>);

};

export default RecentActivityFeed;