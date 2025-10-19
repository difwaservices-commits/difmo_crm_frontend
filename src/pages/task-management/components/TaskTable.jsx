import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const TaskTable = ({ tasks, onTaskSelect, onBulkAction, selectedTasks, onTaskClick }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'dueDate', direction: 'asc' });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error bg-error/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'low': return 'text-success bg-success/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success bg-success/10';
      case 'in-progress': return 'text-primary bg-primary/10';
      case 'overdue': return 'text-error bg-error/10';
      case 'pending': return 'text-warning bg-warning/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      onTaskSelect(tasks?.map(task => task?.id));
    } else {
      onTaskSelect([]);
    }
  };

  const isAllSelected = tasks?.length > 0 && selectedTasks?.length === tasks?.length;
  const isIndeterminate = selectedTasks?.length > 0 && selectedTasks?.length < tasks?.length;

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (dueDate, status) => {
    return status !== 'completed' && new Date(dueDate) < new Date();
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Checkbox
              checked={isAllSelected}
              indeterminate={isIndeterminate}
              onChange={(e) => handleSelectAll(e?.target?.checked)}
            />
            <h3 className="text-lg font-semibold text-foreground">Tasks</h3>
            {selectedTasks?.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {selectedTasks?.length} selected
              </span>
            )}
          </div>
          
          {selectedTasks?.length > 0 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('priority', 'high')}
                iconName="AlertTriangle"
                iconPosition="left"
              >
                Mark High Priority
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('status', 'completed')}
                iconName="CheckCircle"
                iconPosition="left"
              >
                Mark Complete
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onBulkAction('delete')}
                iconName="Trash2"
                iconPosition="left"
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/20">
            <tr>
              <th className="w-12 px-6 py-3"></th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('title')}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Task</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('assignee')}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Assignee</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('priority')}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Priority</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Status</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('dueDate')}
                  className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Due Date</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-sm font-medium text-muted-foreground">Progress</span>
              </th>
              <th className="px-6 py-3 text-right">
                <span className="text-sm font-medium text-muted-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tasks?.map((task) => (
              <tr
                key={task?.id}
                className="hover:bg-muted/30 transition-colors duration-150 cursor-pointer"
                onClick={() => onTaskClick(task)}
              >
                <td className="px-6 py-4">
                  <Checkbox
                    checked={selectedTasks?.includes(task?.id)}
                    onChange={(e) => {
                      e?.stopPropagation();
                      const newSelected = e?.target?.checked
                        ? [...selectedTasks, task?.id]
                        : selectedTasks?.filter(id => id !== task?.id);
                      onTaskSelect(newSelected);
                    }}
                  />
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-foreground">{task?.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {task?.description}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-muted">
                      <Image
                        src={task?.assignee?.avatar}
                        alt={task?.assignee?.avatarAlt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {task?.assignee?.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {task?.assignee?.department}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task?.priority)}`}>
                    {task?.priority?.charAt(0)?.toUpperCase() + task?.priority?.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task?.status)}`}>
                    {task?.status?.replace('-', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className={`text-sm ${isOverdue(task?.dueDate, task?.status) ? 'text-error font-medium' : 'text-foreground'}`}>
                    {formatDate(task?.dueDate)}
                    {isOverdue(task?.dueDate, task?.status) && (
                      <div className="text-xs text-error">Overdue</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${task?.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted-foreground w-10 text-right">
                      {task?.progress}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onTaskClick(task);
                      }}
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e?.stopPropagation();
                        // Handle edit
                      }}
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e?.stopPropagation();
                        // Handle delete
                      }}
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {tasks?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="CheckSquare" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No tasks found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or create a new task to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskTable;