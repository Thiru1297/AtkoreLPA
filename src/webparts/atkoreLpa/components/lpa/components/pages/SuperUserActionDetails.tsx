// @ts-nocheck
import { useEffect, useState } from 'react';
import { AppHeader } from '../AppHeader';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { ChevronLeft, Camera, AlertCircle, Bell } from 'lucide-react';
import { useLpaAppContext } from '../../../../context/LpaAppContext';

interface SuperUserActionDetailsProps {
  actionId: string;
  returnTo?: string;
  returnTab?: string;
  onNavigate: (page: string, params?: any) => void;
  onExit?: () => void;
}

export function SuperUserActionDetails({ actionId, returnTo, returnTab, onNavigate, onExit }: SuperUserActionDetailsProps) {
  const { service } = useLpaAppContext();
  const [actionsMap, setActionsMap] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    let mounted = true;
    service
      .getActionsForRole('super-user')
      .then((items) => {
        if (!mounted) {
          return;
        }
        const mapped = items.reduce((acc: { [key: string]: any }, item: any) => {
          const raw = item.Raw || {};
          const key = item.Title || `ACT-${item.Id}`;
          acc[key] = {
            id: key,
            auditId: item.AuditReference || raw.AuditId || 'AUD',
            description: item.Description || item.Title || '',
            category: raw.Category || 'General',
            department: item.DepartmentName || 'Department',
            auditorName: raw.AuditorName || raw.Auditor || raw.CreatedBy || 'Auditor',
            assignedTo: item.AssignedToEmail || raw.AssignedTo || 'Owner',
            priority: (item.Priority || 'medium').toLowerCase(),
            dueDate: item.DueDate || new Date().toISOString().slice(0, 10),
            status: (item.Status || 'open').toLowerCase().replace(/\s+/g, '-'),
            originalQuestion: raw.QuestionText || raw.OriginalQuestion || 'Not available',
            auditorNotes: raw.Notes || raw.AuditorNotes || 'No notes provided.',
            auditorEvidence: [],
            auditDate: raw.AuditDate || item.DueDate || new Date().toISOString().slice(0, 10),
            plant: raw.PlantName || raw.Plant || 'Plant',
            closureDetails: raw.ClosureDetails
          };
          return acc;
        }, {});
        setActionsMap(mapped);
      })
      .catch(() => {
        if (mounted) {
          setActionsMap({});
        }
      });

    return () => {
      mounted = false;
    };
  }, [service]);

  const action = actionsMap[actionId]
    || Object.values(actionsMap)[0]
    || {
      id: actionId,
      auditId: 'AUD',
      description: 'Action not found.',
      category: 'General',
      department: 'Department',
      auditorName: 'Auditor',
      assignedTo: 'Owner',
      priority: 'medium',
      dueDate: new Date().toISOString().slice(0, 10),
      status: 'open',
      originalQuestion: 'Not available',
      auditorNotes: 'No notes provided.',
      auditorEvidence: [],
      auditDate: new Date().toISOString().slice(0, 10),
      plant: 'Plant'
    };

  // Get all actions from the same audit
  const relatedActions = Object.values(actionsMap).filter(
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

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 pt-5 border-t border-[rgba(0,0,0,0.08)] sm:grid-cols-2">
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
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
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
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
