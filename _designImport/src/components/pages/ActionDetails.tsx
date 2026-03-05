import { useState } from 'react';
import { Textarea, Select, Input } from '../Input';
import { AppHeader } from '../AppHeader';
import { Card } from '../Card';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { Modal } from '../Modal';
import { ChevronLeft, Camera, FileText, User, Calendar, AlertCircle } from 'lucide-react';

interface ActionDetailsProps {
  actionId: string;
  onNavigate: (page: string) => void;
  onBack: () => void;
  onExit?: () => void;
}

export function ActionDetails({ actionId, onNavigate, onBack, onExit }: ActionDetailsProps) {
  const [closureNotes, setClosureNotes] = useState('');
  const [workOrderNo, setWorkOrderNo] = useState('');
  const [closureStatus, setClosureStatus] = useState('in-progress');
  const [evidence, setEvidence] = useState<string[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Mock actions with different statuses
  const mockActions: { [key: string]: any } = {
    'ACT-2025-045': {
      id: 'ACT-2025-045',
      auditId: 'AUD-2025-003',
      description: 'Missing work instruction at Station 3',
      category: 'Quality',
      department: 'Production Line 1',
      auditorName: 'Jane Doe',
      priority: 'high',
      createdDate: '2025-11-20',
      dueDate: '2025-11-26',
      status: 'overdue',
      originalQuestion: 'Are work instructions current and available at workstations?',
      auditorNotes: 'Work instruction for assembly process is missing at Station 3. Operator was working from memory.',
      auditDate: '2025-11-20',
    },
    'ACT-2025-048': {
      id: 'ACT-2025-048',
      auditId: 'AUD-2025-007',
      description: 'Calibration certificate expired for gauge #125',
      category: 'Safety',
      department: 'Quality Control',
      auditorName: 'Mike Johnson',
      priority: 'medium',
      createdDate: '2025-11-22',
      dueDate: '2025-11-29',
      status: 'open',
      originalQuestion: 'Are all measuring instruments properly calibrated?',
      auditorNotes: 'Calibration certificate for gauge #125 expired on 11/15. Equipment still in use.',
      auditDate: '2025-11-22',
    },
    'ACT-2025-051': {
      id: 'ACT-2025-051',
      auditId: 'AUD-2025-010',
      description: 'Safety guard damaged on press machine',
      category: 'Safety',
      department: 'Maintenance',
      auditorName: 'Sarah Williams',
      priority: 'high',
      createdDate: '2025-11-23',
      dueDate: '2025-11-30',
      status: 'in-progress',
      originalQuestion: 'Are all safety guards in place and properly secured on machinery?',
      auditorNotes: 'Safety guard on Machine #3 is damaged and not properly secured. Immediate attention required.',
      auditDate: '2025-11-23',
    },
    'ACT-2025-052': {
      id: 'ACT-2025-052',
      auditId: 'AUD-2025-012',
      description: 'Update 5S board with latest standards',
      category: 'Quality',
      department: 'Warehouse',
      auditorName: 'Sarah Williams',
      priority: 'low',
      createdDate: '2025-11-10',
      dueDate: '2025-11-18',
      status: 'closed',
      originalQuestion: 'Are 5S boards current and properly maintained?',
      auditorNotes: '5S board showing outdated information. Last update was 3 months ago.',
      auditDate: '2025-11-10',
      closureDetails: {
        closedBy: 'John Smith',
        closedDate: '2025-11-17',
        workOrderNo: 'WO-2025-1234',
        closureNotes: 'Updated 5S board with latest standards. Added new sections for safety procedures and quality metrics. Board now includes QR code linking to digital version.',
        closureEvidence: ['evidence-1.jpg', 'evidence-2.jpg']
      }
    }
  };

  const action = mockActions[actionId] || mockActions['ACT-2025-045'];

  const handleCaptureEvidence = () => {
    // Simulate camera capture
    setEvidence([...evidence, `evidence-${Date.now()}.jpg`]);
  };

  const handleCloseAction = () => {
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setShowConfirmModal(false);
      alert('Action closed successfully!');
      onBack();
    }, 1500);
  };

  const canClose = closureStatus === 'closed' && closureNotes.trim().length > 0 && workOrderNo.trim().length > 0 && evidence.length > 0;

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

  return (
    <div className="min-h-screen bg-[#F5F8F5]">
      <AppHeader 
        title="Action Details"
        onExit={onExit}
        actions={
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded">
            <ChevronLeft size={20} />
          </button>
        }
      />

      <div className="p-4 md:p-6 space-y-6 pb-24 max-w-7xl mx-auto">
        {/* Action Overview Card */}
        <Card>
          <div className="flex items-start justify-between gap-3 mb-5">
            <h3>{action.id}</h3>
            {getStatusBadge(action.status)}
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-label mb-2">Description</p>
              <p className="text-value-large">{action.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5 pt-5 border-t border-[rgba(0,0,0,0.08)]">
              <div>
                <p className="text-label mb-2">Department</p>
                <p className="text-value">{action.department}</p>
              </div>
              <div>
                <p className="text-label mb-2">Action Due Date</p>
                <p className="text-value text-[#D13438]">
                  {new Date(action.dueDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-label mb-2">Auditor Name</p>
                <p className="text-value">{action.auditorName}</p>
              </div>
              <div>
                <p className="text-label mb-2">Category</p>
                <p className="text-value">{action.category}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Overdue Alert - Only show for overdue actions */}
        {action.status === 'overdue' && (
          <div className="bg-[#FEF0F1] border border-[#F4C7CA] rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-[#D13438] mt-0.5 shrink-0" />
              <div>
                <p className="text-body-small text-emphasis text-[#D13438] mb-1">This action is overdue</p>
                <p className="text-caption-small text-[#6B7280]">
                  Please close this action as soon as possible to maintain compliance.
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
          </div>
        </Card>

        {/* Closure Details Card */}
        <Card>
          <h3 className="mb-5">Closure Details</h3>

          {action.status === 'closed' && action.closureDetails ? (
            // Read-only view for closed actions
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
                <p className="text-label mb-2">Work Order Number</p>
                <div className="p-4 bg-white rounded-lg border border-[#4CAF50]/10">
                  <p className="text-body-medium">{action.closureDetails.workOrderNo}</p>
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
          ) : (
            // Editable form for non-closed actions
            <div className="space-y-5">
              <Select
                label="Status"
                value={closureStatus}
                onChange={(e) => setClosureStatus(e.target.value)}
              >
                <option value="in-progress">In Progress</option>
                <option value="closed">Closed</option>
              </Select>

              <Textarea
                label="Closure Notes"
                placeholder="Describe the corrective actions taken..."
                value={closureNotes}
                onChange={(e) => setClosureNotes(e.target.value)}
                rows={4}
              />

              <Textarea
                label="Work Order Number"
                placeholder="Enter the work order number..."
                value={workOrderNo}
                onChange={(e) => setWorkOrderNo(e.target.value)}
                rows={1}
              />

              {/* Evidence Upload */}
              <div>
                <p className="text-xs text-[#605E5C] mb-1.5 uppercase tracking-wide">Closure Evidence</p>
                <p className="text-xs text-[#605E5C] mb-4 leading-relaxed">
                  Capture photos showing the corrective action completed
                </p>

                {/* Mobile View - Full Width Button */}
                <div className="md:hidden">
                  <Button variant="secondary" className="w-full mb-4" onClick={handleCaptureEvidence}>
                    <Camera size={16} />
                    Capture Evidence
                  </Button>
                </div>

                {/* Desktop View - Two Column Card Layout */}
                <div className="hidden md:grid md:grid-cols-2 gap-3 mb-4">
                  {/* Top Row - Capture Button */}
                  <div className="col-span-2">
                    <Button variant="secondary" className="w-full" onClick={handleCaptureEvidence}>
                      <Camera size={16} />
                      Capture Evidence
                    </Button>
                  </div>
                  
                  {/* Bottom Row - Placeholder for future action */}

                </div>

                {evidence.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {evidence.map((img, index) => (
                      <div key={index} className="aspect-video rounded-lg border border-[rgba(0,0,0,0.12)] bg-gray-100 flex items-center justify-center">
                        <Camera size={24} className="text-[#605E5C]" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Desktop Actions - Only show for non-closed actions */}
        {action.status !== 'closed' && (
          <div className="hidden md:flex gap-3 justify-end pt-2">
            <Button variant="secondary" onClick={onBack}>
              Cancel
            </Button>
            <Button variant="secondary">
              Save as Draft
            </Button>
            <Button 
              variant="primary" 
              disabled={!canClose}
              onClick={() => setShowConfirmModal(true)}
            >
              Close Action
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Bottom Action Bar - Only show for non-closed actions */}
      {action.status !== 'closed' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[rgba(0,0,0,0.12)] p-4">
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onBack}>
              Cancel
            </Button>
            <Button variant="secondary" className="flex-1">
              Save
            </Button>
            <Button 
              variant="primary" 
              className="flex-1"
              disabled={!canClose}
              onClick={() => setShowConfirmModal(true)}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} title="Close Action">
        <div className="space-y-4">
          <p className="text-sm text-[#1B1B1B]">
            Are you sure you want to close this action? This will mark the corrective action as complete.
          </p>
          
          <div className="bg-[#EEF7EE] rounded-lg p-3">
            <p className="text-sm text-[#2D5A29]">
              The action will be marked as closed and the Plant Manager will be notified.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCloseAction} loading={submitting} className="flex-1">
              Confirm Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}