import { AppHeader } from '../AppHeader';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { ChevronLeft, Camera, AlertCircle, Bell } from 'lucide-react';

interface PlantManagerActionDetailsProps {
  actionId: string;
  onBack: () => void;
  onNavigate: (page: string, params?: any) => void;
  onExit?: () => void;
}

export function PlantManagerActionDetails({ actionId, onBack, onNavigate, onExit }: PlantManagerActionDetailsProps) {
  // Mock actions data
  const mockActions: { [key: string]: any } = {
    'ACT-2025-045': {
      id: 'ACT-2025-045',
      auditId: 'AUD-2025-003',
      description: 'Missing work instruction at Station 3',
      category: 'Quality',
      department: 'Production Line 1',
      auditorName: 'Jane Doe',
      assignedTo: 'John Smith',
      priority: 'high',
      createdDate: '2025-11-20',
      dueDate: '2025-11-26',
      status: 'overdue',
      originalQuestion: 'Are work instructions current and available at workstations?',
      auditorNotes: 'Work instruction for assembly process is missing at Station 3. Operator was working from memory.',
      auditorEvidence: ['evidence-1.jpg', 'evidence-2.jpg'],
      auditDate: '2025-11-20',
      plant: 'Plant A',
    },
    'ACT-2025-046': {
      id: 'ACT-2025-046',
      auditId: 'AUD-2025-003',
      description: 'Organize tool storage area',
      category: 'Quality',
      department: 'Production Line 1',
      auditorName: 'Jane Doe',
      assignedTo: 'John Smith',
      priority: 'low',
      createdDate: '2025-11-20',
      dueDate: '2025-12-05',
      status: 'open',
      originalQuestion: 'Are tools properly organized and stored in designated areas?',
      auditorNotes: 'Tool storage area is disorganized. Tools not properly labeled or stored.',
      auditDate: '2025-11-20',
      plant: 'Plant A',
    },
    'ACT-2025-048': {
      id: 'ACT-2025-048',
      auditId: 'AUD-2025-007',
      description: 'Calibration certificate expired for gauge #125',
      category: 'Safety',
      department: 'Quality Control',
      auditorName: 'Mike Johnson',
      assignedTo: 'Sarah Williams',
      priority: 'medium',
      createdDate: '2025-11-22',
      dueDate: '2025-11-29',
      status: 'open',
      originalQuestion: 'Are all measuring instruments properly calibrated?',
      auditorNotes: 'Calibration certificate for gauge #125 expired on 11/15. Equipment still in use.',
      auditorEvidence: ['evidence-1.jpg'],
      auditDate: '2025-11-22',
      plant: 'Plant A',
    },
    'ACT-2025-051': {
      id: 'ACT-2025-051',
      auditId: 'AUD-2025-010',
      description: 'Safety guard damaged on press machine',
      category: 'Safety',
      department: 'Maintenance',
      auditorName: 'Sarah Williams',
      assignedTo: 'Mike Johnson',
      priority: 'high',
      createdDate: '2025-11-23',
      dueDate: '2025-11-30',
      status: 'in-progress',
      originalQuestion: 'Are all safety guards in place and properly secured on machinery?',
      auditorNotes: 'Safety guard on Machine #3 is damaged and not properly secured. Immediate attention required.',
      auditorEvidence: ['evidence-1.jpg', 'evidence-2.jpg'],
      auditDate: '2025-11-23',
      plant: 'Plant A',
    },
    'ACT-2025-052': {
      id: 'ACT-2025-052',
      auditId: 'AUD-2025-012',
      description: 'Update 5S board with latest standards',
      category: 'Quality',
      department: 'Warehouse',
      auditorName: 'Sarah Williams',
      assignedTo: 'Robert Wilson',
      priority: 'low',
      createdDate: '2025-11-10',
      dueDate: '2025-11-18',
      status: 'closed',
      originalQuestion: 'Are 5S boards current and properly maintained?',
      auditorNotes: '5S board showing outdated information. Last update was 3 months ago.',
      auditorEvidence: ['evidence-1.jpg'],
      auditDate: '2025-11-10',
      plant: 'Plant A',
      closureDetails: {
        closedBy: 'Robert Wilson',
        closedDate: '2025-11-17',
        workOrderNo: 'WO-2025-5678',
        closureNotes: 'Updated 5S board with latest standards. Added new sections for safety procedures and quality metrics. Board now includes QR code linking to digital version.',
        closureEvidence: ['evidence-1.jpg', 'evidence-2.jpg']
      }
    }
  };

  const action = mockActions[actionId] || mockActions['ACT-2025-045'];

  // Get all actions from the same audit
  const relatedActions = Object.values(mockActions).filter(
    (a: any) => a.auditId === action.auditId
  );

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
                  onClick={() => onNavigate('plant-manager-audit-summary', { auditId: action.auditId, returnTo: 'plant-manager-action-details', actionId: action.id })}
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
                <div>
                  <p className="text-label mb-2">Work Order No.</p>
                  <p className="text-value">{action.closureDetails.workOrderNo}</p>
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
                        onNavigate('plant-manager-action-details', { 
                          actionId: relatedAction.id
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
        <div className="flex justify-end pt-6">
          <button
            onClick={onBack}
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