import { AppHeader } from '../AppHeader';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { ChevronLeft, Camera, AlertCircle, Bell } from 'lucide-react';

interface SuperUserActionDetailsProps {
  actionId: string;
  returnTo?: string;
  returnTab?: string;
  onNavigate: (page: string, params?: any) => void;
  onExit?: () => void;
}

export function SuperUserActionDetails({ actionId, returnTo, returnTab, onNavigate, onExit }: SuperUserActionDetailsProps) {
  // Mock actions data
  const mockActions: { [key: string]: any } = {
    'ACT-2025-089': {
      id: 'ACT-2025-089',
      auditId: 'AUD-2025-056',
      description: 'Fix safety guard on machine #3',
      category: 'Safety',
      department: 'Production Line 1',
      auditorName: 'John Smith',
      assignedTo: 'Mike Ross',
      priority: 'high',
      createdDate: '2025-12-02',
      dueDate: '2025-12-08',
      status: 'open',
      originalQuestion: 'Are all safety guards in place and properly secured on machinery?',
      auditorNotes: 'Safety guard on Machine #3 is loose and requires immediate repair to prevent potential injury.',
      auditorEvidence: ['evidence-1.jpg', 'evidence-2.jpg'],
      auditDate: '2025-12-02',
      plant: 'Plant A',
    },
    'ACT-2025-090': {
      id: 'ACT-2025-090',
      auditId: 'AUD-2025-056',
      description: 'Update emergency stop button signage',
      category: 'Safety',
      department: 'Production Line 1',
      auditorName: 'John Smith',
      assignedTo: 'Mike Ross',
      priority: 'medium',
      createdDate: '2025-12-02',
      dueDate: '2025-12-15',
      status: 'open',
      originalQuestion: 'Are emergency stop buttons clearly marked and accessible?',
      auditorNotes: 'Emergency stop button signage is faded and needs replacement for better visibility.',
      auditDate: '2025-12-02',
      plant: 'Plant A',
    },
    'ACT-2025-087': {
      id: 'ACT-2025-087',
      auditId: 'AUD-2025-054',
      description: 'Reorganize pallet storage area',
      category: 'Quality',
      department: 'Warehouse',
      auditorName: 'Mike Davis',
      assignedTo: 'Robert Wilson',
      priority: 'medium',
      createdDate: '2025-12-01',
      dueDate: '2025-12-10',
      status: 'in-progress',
      originalQuestion: 'Are materials stored in designated areas with proper identification?',
      auditorNotes: 'Pallet storage area is disorganized. Multiple SKUs mixed together without proper labels.',
      auditorEvidence: ['evidence-1.jpg'],
      auditDate: '2025-12-01',
      plant: 'Plant A',
    },
    'ACT-2025-088': {
      id: 'ACT-2025-088',
      auditId: 'AUD-2025-055',
      description: 'Update calibration records',
      category: 'Quality',
      department: 'Quality Control',
      auditorName: 'Sarah Johnson',
      assignedTo: 'Jane Smith',
      priority: 'high',
      createdDate: '2025-11-28',
      dueDate: '2025-12-05',
      status: 'overdue',
      originalQuestion: 'Are calibration records current and properly maintained?',
      auditorNotes: 'Several measuring instruments have expired calibration certificates. Records need immediate update.',
      auditorEvidence: ['evidence-1.jpg', 'evidence-2.jpg', 'evidence-3.jpg'],
      auditDate: '2025-11-28',
      plant: 'Plant B',
    },
    'ACT-2025-091': {
      id: 'ACT-2025-091',
      auditId: 'AUD-2025-055',
      description: 'Replace damaged inspection tools',
      category: 'Quality',
      department: 'Quality Control',
      auditorName: 'Sarah Johnson',
      assignedTo: 'Jane Smith',
      priority: 'low',
      createdDate: '2025-11-28',
      dueDate: '2025-12-20',
      status: 'open',
      originalQuestion: 'Are all inspection tools in good working condition?',
      auditorNotes: 'Two calipers show signs of wear and need replacement.',
      auditDate: '2025-11-28',
      plant: 'Plant B',
    },
    'ACT-2025-085': {
      id: 'ACT-2025-085',
      auditId: 'AUD-2025-052',
      description: 'Clean HVAC filters',
      category: 'Maintenance',
      department: 'Maintenance',
      auditorName: 'John Smith',
      assignedTo: 'John Doe',
      priority: 'low',
      createdDate: '2025-11-20',
      dueDate: '2025-11-28',
      status: 'closed',
      originalQuestion: 'Are HVAC systems properly maintained per schedule?',
      auditorNotes: 'HVAC filters in production area are clogged and overdue for replacement.',
      auditDate: '2025-11-20',
      plant: 'Plant A',
      closureDetails: {
        closedBy: 'John Doe',
        closedDate: '2025-11-27',
        closureNotes: 'Replaced all HVAC filters in production area. Installed new high-efficiency filters and updated maintenance log.',
        closureEvidence: ['evidence-1.jpg', 'evidence-2.jpg']
      }
    }
  };

  const action = mockActions[actionId] || mockActions['ACT-2025-089'];

  // Get all actions from the same audit
  const relatedActions = Object.values(mockActions).filter(
    (a: any) => a.auditId === action.auditId
  );

  const handleBack = () => {
    if (returnTo === 'super-user' && returnTab) {
      onNavigate('super-user', { activeTab: returnTab });
    } else {
      onNavigate('super-user', { activeTab: 'actions' });
    }
  };

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'overdue':
        return <Badge variant="overdue">Overdue</Badge>;
      case 'in-progress':
        return <Badge variant="in-progress">In Progress</Badge>;
      case 'closed':
        return <Badge variant="submitted">Closed</Badge>;
      case 'open':
      default:
        return <Badge variant="open">Open</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="priority-high">High</Badge>;
      case 'medium':
        return <Badge variant="priority-medium">Medium</Badge>;
      case 'low':
        return <Badge variant="priority-low">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8F5]">
      <AppHeader 
        title="Action Details"
        onExit={onExit}
      />

      <div className="p-4 md:p-6 space-y-6 pb-24 max-w-7xl mx-auto relative">
        {/* Action Overview Card */}
        <Card>
          <div className="flex items-start justify-between gap-3 mb-5">
            <h3>{action.id}</h3>
            <div className="flex gap-2">
              {getStatusBadge(action.status)}
              {getPriorityBadge(action.priority)}
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-label mb-2">Description</p>
              <p className="text-value-large">{action.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5 pt-5 border-t border-[rgba(0,0,0,0.08)]">
              <div>
                <p className="text-label mb-2">Plant</p>
                <p className="text-value">{action.plant}</p>
              </div>
              <div>
                <p className="text-label mb-2">Department</p>
                <p className="text-value">{action.department}</p>
              </div>
              <div>
                <p className="text-label mb-2">Assigned To</p>
                <p className="text-value">{action.assignedTo}</p>
              </div>
              <div>
                <p className="text-label mb-2">Action Due Date</p>
                <p className={`text-value ${action.status === 'overdue' ? 'text-[#D13438]' : ''}`}>
                  {new Date(action.dueDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-label mb-2">Auditor Name</p>
                <p className="text-value">{action.auditorName}</p>
              </div>
              <div>
                <p className="text-label mb-2">Audit ID</p>
                <button
                  onClick={() => onNavigate('super-user-audit-summary', { auditId: action.auditId, returnTo: 'super-user-action-details', actionId: action.id, returnTab: returnTab })}
                  className="text-value text-[#4CAC48] hover:underline text-left"
                >
                  {action.auditId}
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Overdue Alert - Only show for overdue actions */}
        {action.status === 'overdue' && (
          <div className="bg-[#FEF0F1] border border-[#F4C7CA] rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <AlertCircle size={18} className="text-[#D13438] mt-0.5 shrink-0" />
                <div>
                  <p className="text-body-small text-emphasis text-[#D13438] mb-1">This action is overdue</p>
                  <p className="text-caption-small text-[#6B7280]">
                    The assigned department owner needs to complete this action as soon as possible.
                  </p>
                </div>
              </div>
              <button
                onClick={() => alert('Reminder sent to ' + action.assignedTo)}
                className="flex items-center justify-center gap-2 px-2.5 py-2.5 md:px-3 md:py-2 bg-white border-2 border-[#4CAC48] text-[#4CAC48] rounded-lg hover:bg-[#F5F8F5] active:bg-[#F5F8F5] transition-colors shrink-0"
              >
                <Bell size={16} />
                <span className="hidden md:inline text-sm font-medium">Send Reminder</span>
              </button>
            </div>
          </div>
        )}

        {/* Pending Closure Reminder - For In Progress and Open actions */}
        {(action.status === 'in-progress' || action.status === 'open') && (
          <div className="bg-[#FFF8E1] border border-[#FFE082] rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-[#F57C00] mt-0.5 shrink-0" />
              <div>
                <p className="text-body-small text-emphasis text-[#F57C00] mb-1">Pending Closure</p>
                <p className="text-caption-small text-[#6B7280]">
                  Assigned to <span className="font-medium text-[#1B1B1B]">{action.assignedTo}</span> • {action.department}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Original Non-Compliance Card */}
        <Card>
          <h3 className="mb-5">Original Non-Compliance</h3>
          
          <div className="space-y-5">
            <p className="text-caption text-[#9CA3AF]">
              Audit Date: {new Date(action.auditDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
            </p>

            <div>
              <p className="text-label mb-2">Question</p>
              <p className="text-body-medium">{action.originalQuestion}</p>
            </div>

            <div>
              <p className="text-label mb-2">Auditor Notes</p>
              <div className="mt-2 p-4 bg-[rgba(0,0,0,0.03)] rounded-lg border-l-2 border-[#6B7280]">
                <p className="text-body-medium italic">{action.auditorNotes}</p>
              </div>
            </div>

            {action.auditorEvidence && action.auditorEvidence.length > 0 && (
              <div>
                <p className="text-label mb-3">Auditor Evidence</p>
                <div className="grid grid-cols-2 gap-3">
                  {action.auditorEvidence.map((evidence: string, index: number) => (
                    <div key={index} className="aspect-video rounded-lg border border-[rgba(0,0,0,0.12)] bg-gray-100 flex items-center justify-center">
                      <Camera size={24} className="text-[#6B7280]" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Closure Details Card - Only show for closed actions */}
        {action.status === 'closed' && action.closureDetails && (
          <Card>
            <h3 className="mb-5">Closure Details</h3>
            <div className="bg-[#E8F5E9] p-4 rounded-lg border border-[#4CAF50]/20 space-y-5">
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <p className="text-label mb-2">Closed By</p>
                  <p className="text-value">{action.closureDetails.closedBy}</p>
                </div>
                <div>
                  <p className="text-label mb-2">Closed Date</p>
                  <p className="text-value">
                    {new Date(action.closureDetails.closedDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-label mb-2">Closure Notes</p>
                <div className="p-4 bg-white rounded-lg border border-[#4CAF50]/10">
                  <p className="text-body-medium">{action.closureDetails.closureNotes}</p>
                </div>
              </div>
              {action.closureDetails.closureEvidence && action.closureDetails.closureEvidence.length > 0 && (
                <div>
                  <p className="text-label mb-3">Closure Evidence</p>
                  <div className="grid grid-cols-2 gap-3">
                    {action.closureDetails.closureEvidence.map((evidence: string, index: number) => (
                      <div key={index} className="aspect-video rounded-lg border border-[rgba(0,0,0,0.12)] bg-gray-100 flex items-center justify-center">
                        <Camera size={24} className="text-[#6B7280]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Related Actions Card */}
        {relatedActions.length > 1 && (
          <Card>
            <h3 className="mb-5">Other Action Items in This Audit</h3>
            <p className="text-caption text-[#9CA3AF] mb-4">
              Audit ID: {action.auditId}
            </p>
            
            <div className="space-y-0 divide-y divide-[rgba(0,0,0,0.08)]">
              {relatedActions.map((relatedAction: any, index: number) => {
                const isCurrentAction = relatedAction.id === action.id;
                
                return (
                  <button
                    key={relatedAction.id}
                    onClick={() => {
                      if (!isCurrentAction) {
                        onNavigate('super-user-action-details', { 
                          actionId: relatedAction.id, 
                          returnTo: returnTo, 
                          returnTab: returnTab 
                        });
                      }
                    }}
                    disabled={isCurrentAction}
                    className={`w-full text-left py-4 transition-colors ${
                      isCurrentAction 
                        ? 'bg-[#F5F8F5] cursor-default' 
                        : 'hover:bg-[#F5F8F5] cursor-pointer'
                    } ${index === 0 ? 'pt-0' : ''} ${index === relatedActions.length - 1 ? 'pb-0' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-sm font-medium text-[#1B1B1B]">
                            {relatedAction.id}
                          </p>
                          {isCurrentAction && (
                            <span className="px-2 py-0.5 bg-[#4CAC48] text-white text-xs rounded">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#605E5C] mb-2 line-clamp-1">
                          {relatedAction.description}
                        </p>
                        <p className="text-xs text-[#9CA3AF]">
                          Due: {new Date(relatedAction.dueDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        {getStatusBadge(relatedAction.status)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        )}

        {/* Back Button - Bottom Right */}
        <div className="flex justify-end pt-6 p-[0px]">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-[rgba(0,0,0,0.12)] rounded-lg shadow-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={20} className="text-[#605E5C]" />
            <span className="font-medium text-[#1B1B1B]">Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}