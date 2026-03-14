import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';

const AttendanceModal = ({ isOpen, onClose, onSave, employees }) => {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const status = watch('status');

  useEffect(() => {
    if (isOpen) {
      reset({
        date: new Date().toISOString().split('T')[0],
        checkInTime: '09:00',
        checkOutTime: '17:00',
        status: 'present'
      });
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card w-full max-w-lg rounded-lg shadow-lg border border-border animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Manual Attendance Entry</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Employee</label>
            <select
              {...register('employeeId', { required: 'Employee is required' })}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.employeeCode || emp.id})
                </option>
              ))}
            </select>
            {errors.employeeId && <span className="text-xs text-error">{errors.employeeId.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Date</label>
            <input
              type="date"
              {...register('date', { required: 'Date is required' })}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.date && <span className="text-xs text-error">{errors.date.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Check In Time</label>

              <input
                type="time"
                {...register('checkInTime', { required: status !== 'absent' ? 'Check-in time is required' : false })}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={status === 'absent'}
              />
              {errors.checkInTime && <span className="text-xs text-error">{errors.checkInTime.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Check Out Time</label>
              <input
                type="time"
                {...register('checkOutTime')}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Status</label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="half_day">Half Day</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Location</label>
            <input
              type="text"
              {...register('location')}
              placeholder="e.g. Office, Remote"
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Notes</label>
            <textarea
              {...register('notes')}
              rows="3"
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttendanceModal;