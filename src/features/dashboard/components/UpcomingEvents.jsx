import React from 'react';
import Icon from '../../../components/AppIcon';

const UpcomingEvents = () => {
  const events = [
    {
      id: 1,
      title: 'Payroll Processing',
      description: 'November 2024 salary processing',
      date: '2024-10-25',
      time: '09:00 AM',
      type: 'payroll',
      priority: 'high',
      icon: 'DollarSign',
      color: 'success'
    },
    {
      id: 2,
      title: 'All Hands Meeting',
      description: 'Q4 review and planning session',
      date: '2024-10-22',
      time: '02:00 PM',
      type: 'meeting',
      priority: 'medium',
      icon: 'Users',
      color: 'primary'
    },
    {
      id: 3,
      title: 'Performance Reviews Due',
      description: 'Q4 employee evaluations deadline',
      date: '2024-10-30',
      time: '11:59 PM',
      type: 'deadline',
      priority: 'high',
      icon: 'FileText',
      color: 'warning'
    },
    {
      id: 4,
      title: 'System Maintenance',
      description: 'Scheduled server updates',
      date: '2024-10-26',
      time: '02:00 AM',
      type: 'maintenance',
      priority: 'low',
      icon: 'Settings',
      color: 'error'
    }
  ];

  const getEventColor = (color) => {
    const colors = {
      success: 'bg-success/10 text-success border-success/20',
      primary: 'bg-primary/10 text-primary border-primary/20',
      warning: 'bg-warning/10 text-warning border-warning/20',
      error: 'bg-error/10 text-error border-error/20'
    };
    return colors?.[color] || colors?.primary;
  };

  const getDaysUntil = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return 'Overdue';
    return `${diffDays} days`;
  };

  const handleEventClick = (eventId) => {
    window.location.href = `/events/${eventId}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 card-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Upcoming Events</h3>
          <p className="text-sm text-muted-foreground">Important dates and deadlines</p>
        </div>
        <button
          onClick={() => window.location.href = '/calendar'}
          className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-primary hover:text-primary/80 hover:bg-primary/10 rounded-md transition-colors duration-150"
        >
          <Icon name="Calendar" size={14} />
          <span>View Calendar</span>
        </button>
      </div>
      <div className="space-y-3">
        {events?.map((event) => (
          <button
            key={event?.id}
            onClick={() => handleEventClick(event?.id)}
            className="w-full p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-150 text-left"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getEventColor(event?.color)}`}>
                  <Icon name={event?.icon} size={18} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-foreground">{event?.title}</h4>
                    <span className="text-xs text-muted-foreground ml-2">
                      {getDaysUntil(event?.date)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{event?.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="Calendar" size={12} />
                      <span>{new Date(event.date)?.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={12} />
                      <span>{event?.time}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Icon name="ChevronRight" size={16} className="text-muted-foreground ml-2" />
            </div>
          </button>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Next 7 days</span>
          <button
            onClick={() => window.location.href = '/events'}
            className="text-primary hover:text-primary/80 font-medium transition-colors duration-150"
          >
            View all events
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvents;