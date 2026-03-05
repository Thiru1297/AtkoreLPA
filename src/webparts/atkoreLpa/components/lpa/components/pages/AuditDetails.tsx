// @ts-nocheck
import { AppHeader } from '../AppHeader';
import { Card } from '../Card';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { Calendar, MapPin, User, FileText, ChevronLeft } from 'lucide-react';

interface AuditDetailsProps {
  auditId: string;
  onNavigate: (page: string, auditId?: string) => void;
  onBack: () => void;
  onExit?: () => void;
}

export function AuditDetails({ auditId, onNavigate, onBack, onExit }: AuditDetailsProps) {
  const audit = {
    id: auditId,
    plant: 'Plant A',
    department: 'Production Line 1',
    plannedDate: '2025-11-28',
    scheduledAuditor: 'John Smith',
    status: 'accepted',
  };

  return (
    <div className="min-h-screen bg-[#F5F8F5]">
      <AppHeader 
        title="Audit Details"
        onExit={onExit}
        actions={
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded md:hidden">
            <ChevronLeft size={20} />
          </button>
        }
      />

      <div className="p-4 space-y-4 pb-24 md:pb-4 max-w-3xl mx-auto">
        {/* Header Card */}
        <Card>
          <div className="flex items-start justify-between gap-2 mb-4">
            <h2>{audit.id}</h2>
            <Badge variant="accepted">Accepted</Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-[#605E5C] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-[#1B1B1B]">{audit.plant}</p>
                <p className="text-sm text-[#605E5C]">{audit.department}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User size={18} className="text-[#605E5C] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-[#1B1B1B]">Scheduled Auditor</p>
                <p className="text-sm text-[#605E5C]">{audit.scheduledAuditor}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Audit Summary Card */}
        <Card>
          <h3 className="mb-5">Audit Summary</h3>
          
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <div>
              <p className="text-label mb-2">Due Date</p>
              <p className="text-value text-[#D13438]">
                {new Date(audit.dueDate).toLocaleDateString('en-US', { 
                  weekday: 'short',
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
            </div>
            
            <div>
              <p className="text-label mb-2">Total Questions</p>
              <p className="text-value">12 questions</p>
            </div>

            <div>
              <p className="text-label mb-2">Departments</p>
              <p className="text-value">VS1, VS2, Shrink Wrapping</p>
            </div>

            <div>
              <p className="text-label mb-2">Estimated Time</p>
              <p className="text-value">20-30 minutes</p>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-[rgba(0,0,0,0.08)]">
            <p className="text-label mb-2">Audit Purpose</p>
            <p className="text-body-medium text-[#111827]">
              Verify compliance with production standards, assess proper tagging procedures, 
              and ensure correct pallet management across all production lines and storage locations.
            </p>
          </div>
        </Card>

        {/* Instructions Card */}
        <Card>
          <h3 className="mb-5">How to Complete This Audit</h3>
          
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#4CAC48] text-white flex items-center justify-center text-caption-small text-emphasis">
                1
              </div>
              <div className="flex-1">
                <h4 className="mb-1">Review all questions</h4>
                <p className="text-body-small text-[#6B7280]">
                  Questions are organized by category (VS1, VS2, etc.). Read each question carefully before responding.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#4CAC48] text-white flex items-center justify-center text-caption-small text-emphasis">
                2
              </div>
              <div className="flex-1">
                <h4 className="mb-1">Select your response</h4>
                <p className="text-body-small text-[#6B7280]">
                  Choose <span className="text-emphasis">Compliant</span>, <span className="text-emphasis">Non-Compliant (NC)</span>, or <span className="text-emphasis">N/A</span> for each question based on your observations.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#4CAC48] text-white flex items-center justify-center text-caption-small text-emphasis">
                3
              </div>
              <div className="flex-1">
                <h4 className="mb-1">Capture evidence for NCs</h4>
                <p className="text-body-small text-[#6B7280]">
                  If you mark a question as Non-Compliant, you must capture photo evidence. Some questions may require multiple photos.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#4CAC48] text-white flex items-center justify-center text-caption-small text-emphasis">
                4
              </div>
              <div className="flex-1">
                <h4 className="mb-1">Add required comments</h4>
                <p className="text-body-small text-[#6B7280]">
                  Some questions require comments regardless of your answer. Watch for the red asterisk (*) indicator.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#4CAC48] text-white flex items-center justify-center text-caption-small text-emphasis">
                5
              </div>
              <div className="flex-1">
                <h4 className="mb-1">Review and submit</h4>
                <p className="text-body-small text-[#6B7280]">
                  After answering all questions, review your responses. You can edit any answer before final submission.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-[rgba(0,0,0,0.08)] bg-[#FFF9E6] -mx-4 -mb-4 px-4 py-4 rounded-b-xl">
            <div className="flex gap-2">
              <FileText size={16} className="text-[#8A6D3B] mt-0.5 flex-shrink-0" />
              <p className="text-body-small text-[#8A6D3B]">
                <span className="text-emphasis">Important:</span> All questions must be answered before you can submit the audit. Your progress is automatically saved.
              </p>
            </div>
          </div>
        </Card>

        {/* Desktop Actions */}
        <div className="hidden md:flex gap-3">
          <Button variant="secondary" onClick={onBack}>
            Back to Audits
          </Button>
          <Button variant="primary" className="flex-1" onClick={() => onNavigate('questionnaire', audit.id)}>
            Start Audit
          </Button>
        </div>
      </div>

      {/* Mobile Bottom Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[rgba(0,0,0,0.12)] p-4">
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button variant="primary" className="flex-1" onClick={() => onNavigate('questionnaire', audit.id)}>
            Start Audit
          </Button>
        </div>
      </div>
    </div>
  );
}
