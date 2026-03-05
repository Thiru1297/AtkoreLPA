import { X, AlertCircle, User, Calendar, Building2, MapPin } from 'lucide-react';
import { Badge } from './Badge';
import { Button } from './Button';

interface Action {
  id: string;
  questionId: number;
  description: string;
  assignedTo: string;
  department: string;
  plant?: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'closed';
}

interface ActionDetailsDialogProps {
  action: Action | null;
  onClose: () => void;
  onViewFullDetails?: () => void;
}

export function ActionDetailsDialog({ action, onClose, onViewFullDetails }: ActionDetailsDialogProps) {
  if (!action) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div 
        className="relative bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="action-dialog-title"
        aria-describedby="action-dialog-description"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-divider px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle size={24} className="text-warning" strokeWidth={2} />
            <h3 id="action-dialog-title">Action Details</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-surface rounded transition-colors"
            aria-label="Close dialog"
          >
            <X size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Action ID and Badges */}
          <div>
            <p className="text-xs text-text-secondary mb-2">Action ID</p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-sm">{action.id}</Badge>
              <Badge 
                variant={
                  action.priority === 'high' 
                    ? 'priority-high' 
                    : action.priority === 'medium'
                    ? 'priority-medium'
                    : 'priority-low'
                }
              >
                {action.priority.toUpperCase()}
              </Badge>
              <Badge 
                variant={
                  action.status === 'closed' 
                    ? 'success' 
                    : action.status === 'in-progress' 
                    ? 'warning' 
                    : 'secondary'
                }
              >
                {action.status === 'in-progress' ? 'IN PROGRESS' : action.status.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs text-text-secondary mb-2">Description</p>
            <p id="action-dialog-description" className="text-sm bg-surface p-4 rounded border border-border">{action.description}</p>
          </div>

          {/* Assignment Details */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <User size={16} className="text-text-secondary mt-0.5" strokeWidth={1.5} />
              <div className="flex-1">
                <p className="text-xs text-text-secondary mb-1">Assigned To</p>
                <p className="text-sm font-medium">{action.assignedTo}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-text-secondary mt-0.5" strokeWidth={1.5} />
              <div className="flex-1">
                <p className="text-xs text-text-secondary mb-1">Plant</p>
                <p className="text-sm font-medium">{action.plant || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building2 size={16} className="text-text-secondary mt-0.5" strokeWidth={1.5} />
              <div className="flex-1">
                <p className="text-xs text-text-secondary mb-1">Department</p>
                <p className="text-sm font-medium">{action.department}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar size={16} className="text-text-secondary mt-0.5" strokeWidth={1.5} />
              <div className="flex-1">
                <p className="text-xs text-text-secondary mb-1">Due Date</p>
                <p className="text-sm font-medium">{new Date(action.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Related Question */}
          <div className="bg-surface/50 p-4 rounded border border-border">
            <p className="text-xs text-text-secondary mb-1">Related to Question</p>
            <p className="text-sm font-medium">Q{action.questionId}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-divider px-6 py-4 flex flex-col sm:flex-row gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onClose}
          >
            Close
          </Button>
          {onViewFullDetails && (
            <Button
              variant="primary"
              className="flex-1"
              onClick={onViewFullDetails}
            >
              View Full Details →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}