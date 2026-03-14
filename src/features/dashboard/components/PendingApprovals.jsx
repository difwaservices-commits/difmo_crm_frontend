import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PendingApprovals = () => {
  const approvals = [
  {
    id: 1,
    type: 'leave',
    employee: 'Jennifer Wilson',
    avatar: "https://images.unsplash.com/photo-1684262855358-88f296a2cfc2",
    avatarAlt: 'Professional blonde woman in navy blazer with confident smile in office setting',
    request: 'Annual Leave Request',
    details: 'Dec 23-30, 2024 (8 days)',
    department: 'Sales',
    priority: 'medium',
    submittedDate: '2024-10-18',
    icon: 'Calendar',
    color: 'warning'
  },
  {
    id: 2,
    type: 'expense',
    employee: 'Robert Martinez',
    avatar: "https://images.unsplash.com/photo-1537318848571-b1c44804662a",
    avatarAlt: 'Hispanic man with beard in white dress shirt smiling warmly in professional environment',
    request: 'Travel Expense Claim',
    details: '$2,450 - Client Meeting NYC',
    department: 'Business Development',
    priority: 'high',
    submittedDate: '2024-10-17',
    icon: 'Receipt',
    color: 'error'
  },
  {
    id: 3,
    type: 'overtime',
    employee: 'Lisa Thompson',
    avatar: "https://images.unsplash.com/photo-1684262855358-88f296a2cfc2",
    avatarAlt: 'African American woman with natural hair in professional burgundy blazer smiling confidently',
    request: 'Overtime Authorization',
    details: '15 hours - Project Deadline',
    department: 'Engineering',
    priority: 'medium',
    submittedDate: '2024-10-19',
    icon: 'Clock',
    color: 'primary'
  }];


  const getPriorityBadge = (priority) => {
    const badges = {
      high: 'bg-error/10 text-error border-error/20',
      medium: 'bg-warning/10 text-warning border-warning/20',
      low: 'bg-success/10 text-success border-success/20'
    };
    return badges?.[priority] || badges?.medium;
  };

  const handleApprove = (approvalId) => {
    console.log('Approving request:', approvalId);
    // Handle approval logic
  };

  const handleReject = (approvalId) => {
    console.log('Rejecting request:', approvalId);
    // Handle rejection logic
  };

  const handleViewDetails = (approvalId) => {
    window.location.href = `/approvals/${approvalId}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 card-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Pending Approvals</h3>
          <p className="text-sm text-muted-foreground">Requests awaiting your review</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 bg-error/10 text-error text-xs font-medium rounded-full border border-error/20">
            {approvals?.length} Pending
          </span>
          <button
            onClick={() => window.location.href = '/approvals'}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-primary hover:text-primary/80 hover:bg-primary/10 rounded-md transition-colors duration-150">

            <span>View All</span>
            <Icon name="ArrowRight" size={14} />
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {approvals?.map((approval) =>
        <div key={approval?.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors duration-150">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                  <Image
                  src={approval?.avatar}
                  alt={approval?.avatarAlt}
                  className="w-full h-full object-cover" />

                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{approval?.employee}</h4>
                  <p className="text-sm text-muted-foreground">{approval?.department}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityBadge(approval?.priority)}`}>
                  {approval?.priority?.charAt(0)?.toUpperCase() + approval?.priority?.slice(1)}
                </span>
                <Icon name={approval?.icon} size={16} className="text-muted-foreground" />
              </div>
            </div>

            <div className="mb-4">
              <p className="font-medium text-foreground mb-1">{approval?.request}</p>
              <p className="text-sm text-muted-foreground">{approval?.details}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Submitted: {new Date(approval.submittedDate)?.toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <button
              onClick={() => handleViewDetails(approval?.id)}
              className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">

                <Icon name="Eye" size={14} />
                <span>View Details</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <Button
                variant="outline"
                size="sm"
                onClick={() => handleReject(approval?.id)}
                iconName="X"
                iconPosition="left"
                iconSize={14}>

                  Reject
                </Button>
                <Button
                variant="default"
                size="sm"
                onClick={() => handleApprove(approval?.id)}
                iconName="Check"
                iconPosition="left"
                iconSize={14}>

                  Approve
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {approvals?.length === 0 &&
      <div className="text-center py-8">
          <Icon name="CheckCircle" size={32} className="text-success mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No pending approvals</p>
          <p className="text-xs text-muted-foreground mt-1">All requests have been processed</p>
        </div>
      }
    </div>);

};

export default PendingApprovals;