import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TaskDetailPanel = ({ task, onClose, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
  {
    id: 1,
    author: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1587403655231-b1734312903f",
    avatarAlt: "Professional woman with brown hair in white blouse smiling at camera",
    content: "I\'ve reviewed the requirements and started working on the initial design. Should have the mockups ready by tomorrow.",
    timestamp: new Date(Date.now() - 3600000),
    edited: false
  },
  {
    id: 2,
    author: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1676989880361-091e12efc056",
    avatarAlt: "Asian man with glasses in dark suit jacket smiling professionally",
    content: "Great progress! I've added some additional requirements in the project documentation. Please review when you get a chance.",
    timestamp: new Date(Date.now() - 1800000),
    edited: false
  }]
  );

  if (!task) return null;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':return 'text-error bg-error/10 border-error/20';
      case 'medium':return 'text-warning bg-warning/10 border-warning/20';
      case 'low':return 'text-success bg-success/10 border-success/20';
      default:return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':return 'text-success bg-success/10 border-success/20';
      case 'in-progress':return 'text-primary bg-primary/10 border-primary/20';
      case 'overdue':return 'text-error bg-error/10 border-error/20';
      case 'pending':return 'text-warning bg-warning/10 border-warning/20';
      default:return 'text-muted-foreground bg-muted border-border';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days} days ago`;
    }
  };

  const isOverdue = () => {
    return task?.status !== 'completed' && new Date(task.dueDate) < new Date();
  };

  const handleAddComment = () => {
    if (!newComment?.trim()) return;

    const comment = {
      id: Date.now(),
      author: "You",
      avatar: "https://images.unsplash.com/photo-1584183323859-7deffecfe07c",
      avatarAlt: "Professional headshot of person with short hair in business attire",
      content: newComment,
      timestamp: new Date(),
      edited: false
    };

    setComments((prev) => [comment, ...prev]);
    setNewComment('');
  };

  const handleProgressUpdate = (newProgress) => {
    onUpdate({ ...task, progress: newProgress });
  };

  const handleStatusUpdate = (newStatus) => {
    onUpdate({ ...task, status: newStatus });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-foreground">{task?.title}</h2>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task?.priority)}`}>
                  {task?.priority?.charAt(0)?.toUpperCase() + task?.priority?.slice(1)} Priority
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task?.status)}`}>
                  {task?.status?.replace('-', ' ')?.replace(/\b\w/g, (l) => l?.toUpperCase())}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                iconName="Edit"
                iconPosition="left">

                Edit
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}>

                <Icon name="X" size={20} />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Task Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                  <p className="text-foreground">{task?.description}</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Assignee</h3>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                        <Image
                          src={task?.assignee?.avatar}
                          alt={task?.assignee?.avatarAlt}
                          className="w-full h-full object-cover" />

                      </div>
                      <div>
                        <p className="font-medium text-foreground">{task?.assignee?.name}</p>
                        <p className="text-sm text-muted-foreground">{task?.assignee?.department}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Due Date</h3>
                    <p className={`font-medium ${isOverdue() ? 'text-error' : 'text-foreground'}`}>
                      {formatDate(task?.dueDate)}
                      {isOverdue() && <span className="text-error ml-2">(Overdue)</span>}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Progress</h3>
                  <span className="text-sm font-medium text-foreground">{task?.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3 mb-4">
                  <div
                    className="bg-primary h-3 rounded-full transition-all duration-300"
                    style={{ width: `${task?.progress}%` }}>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleProgressUpdate(Math.min(100, task?.progress + 25))}
                    disabled={task?.progress >= 100}>

                    +25%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate('completed')}
                    disabled={task?.status === 'completed'}>

                    Mark Complete
                  </Button>
                </div>
              </div>

              {/* Attachments */}
              {task?.attachments && task?.attachments?.length > 0 &&
              <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Attachments</h3>
                  <div className="space-y-2">
                    {task?.attachments?.map((attachment) =>
                  <div
                    key={attachment?.id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">

                        <div className="flex items-center space-x-3">
                          <Icon name="File" size={16} className="text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {attachment?.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {(attachment?.size / 1024 / 1024)?.toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(attachment?.url, '_blank')}>

                          <Icon name="Download" size={16} />
                        </Button>
                      </div>
                  )}
                  </div>
                </div>
              }

              {/* Comments Section */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Comments</h3>
                
                {/* Add Comment */}
                <div className="flex space-x-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Icon name="User" size={16} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e?.target?.value)}
                      onKeyPress={(e) => {
                        if (e?.key === 'Enter') {
                          handleAddComment();
                        }
                      }} />

                    <div className="flex justify-end mt-2">
                      <Button
                        size="sm"
                        onClick={handleAddComment}
                        disabled={!newComment?.trim()}
                        iconName="Send"
                        iconPosition="left">

                        Comment
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments?.map((comment) =>
                  <div key={comment?.id} className="flex space-x-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-muted">
                        <Image
                        src={comment?.avatar}
                        alt={comment?.avatarAlt}
                        className="w-full h-full object-cover" />

                      </div>
                      <div className="flex-1">
                        <div className="bg-muted/30 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-foreground">
                              {comment?.author}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(comment?.timestamp)}
                              {comment?.edited && ' (edited)'}
                            </span>
                          </div>
                          <p className="text-sm text-foreground">{comment?.content}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

};

export default TaskDetailPanel;