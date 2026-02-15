import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TaskModal = ({ isOpen, onClose, onSave, task = null, employees = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigneeId: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    estimatedHours: '',
    tags: '',
    attachments: []
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task?.title || '',
        description: task?.description || '',
        assigneeId: task?.assignee?.id || '',
        priority: task?.priority || 'medium',
        status: task?.status || 'pending',
        dueDate: task?.dueDate ? task?.dueDate?.split('T')?.[0] : '',
        estimatedHours: task?.estimatedHours || '',
        tags: task?.tags?.join(', ') || '',
        attachments: task?.attachments || []
      });
    } else {
      setFormData({
        title: '',
        description: '',
        assigneeId: '',
        priority: 'medium',
        status: 'pending',
        dueDate: '',
        estimatedHours: '',
        tags: '',
        attachments: []
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ];

  const employeeOptions = employees?.map(emp => ({
    value: emp?.id,
    label: emp?.name,
    description: emp?.department
  }));

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.title?.trim()) {
      newErrors.title = 'Task title is required';
    }

    if (!formData?.description?.trim()) {
      newErrors.description = 'Task description is required';
    }

    if (!formData?.assigneeId) {
      newErrors.assigneeId = 'Please select an assignee';
    }

    if (!formData?.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today?.setHours(0, 0, 0, 0);

      if (dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    if (formData?.estimatedHours && (isNaN(formData?.estimatedHours) || formData?.estimatedHours <= 0)) {
      newErrors.estimatedHours = 'Please enter a valid number of hours';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const taskData = {
        ...formData,
        tags: formData?.tags?.split(',')?.map(tag => tag?.trim())?.filter(tag => tag),
        estimatedHours: formData?.estimatedHours ? parseInt(formData?.estimatedHours) : null,
        ...(task?.id && { id: task.id }),
        progress: task?.progress || 0
      };

      await onSave(taskData);
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
      setErrors({ submit: 'Failed to save task. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e?.target?.files);
    const newAttachments = files?.map(file => ({
      id: Date.now() + Math.random(),
      name: file?.name,
      size: file?.size,
      type: file?.type,
      url: URL.createObjectURL(file)
    }));

    setFormData(prev => ({
      ...prev,
      attachments: [...prev?.attachments, ...newAttachments]
    }));
  };

  const removeAttachment = (attachmentId) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev?.attachments?.filter(att => att?.id !== attachmentId)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors?.submit && (
            <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
              <p className="text-sm text-error">{errors?.submit}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Task Title"
                type="text"
                placeholder="Enter task title"
                value={formData?.title}
                onChange={(e) => handleInputChange('title', e?.target?.value)}
                error={errors?.title}
                required
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="Description"
                type="text"
                placeholder="Describe the task in detail"
                value={formData?.description}
                onChange={(e) => handleInputChange('description', e?.target?.value)}
                error={errors?.description}
                required
              />
            </div>

            <Select
              label="Assignee"
              placeholder="Select assignee"
              options={employeeOptions}
              value={formData?.assigneeId}
              onChange={(value) => handleInputChange('assigneeId', value)}
              error={errors?.assigneeId}
              required
              searchable
            />

            <Select
              label="Priority"
              options={priorityOptions}
              value={formData?.priority}
              onChange={(value) => handleInputChange('priority', value)}
              required
            />

            <Select
              label="Status"
              options={statusOptions}
              value={formData?.status}
              onChange={(value) => handleInputChange('status', value)}
              required
            />

            <Input
              label="Due Date"
              type="date"
              value={formData?.dueDate}
              onChange={(e) => handleInputChange('dueDate', e?.target?.value)}
              error={errors?.dueDate}
              required
            />

            <Input
              label="Estimated Hours"
              type="number"
              placeholder="Enter estimated hours"
              value={formData?.estimatedHours}
              onChange={(e) => handleInputChange('estimatedHours', e?.target?.value)}
              error={errors?.estimatedHours}
              min="1"
            />

            <Input
              label="Tags"
              type="text"
              placeholder="Enter tags separated by commas"
              value={formData?.tags}
              onChange={(e) => handleInputChange('tags', e?.target?.value)}
              description="Separate multiple tags with commas"
            />
          </div>

          {/* File Attachments */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Attachments
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Icon name="Upload" size={32} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to upload files or drag and drop
                </span>
                <span className="text-xs text-muted-foreground">
                  PDF, DOC, TXT, Images up to 10MB each
                </span>
              </label>
            </div>

            {formData?.attachments?.length > 0 && (
              <div className="mt-4 space-y-2">
                {formData?.attachments?.map((attachment) => (
                  <div
                    key={attachment?.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
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
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAttachment(attachment?.id)}
                    >
                      <Icon name="X" size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              iconName="Save"
              iconPosition="left"
            >
              {task ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;