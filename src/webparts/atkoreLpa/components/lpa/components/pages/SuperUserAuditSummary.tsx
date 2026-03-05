// @ts-nocheck
import { useState } from 'react';
import { AppHeader } from '../AppHeader';
import { Card } from '../Card';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { ActionDetailsDialog } from '../ActionDetailsDialog';
import { CheckCircle, XCircle, MinusCircle, ChevronDown, ChevronUp, Calendar, MapPin, Layers, Camera, AlertCircle } from 'lucide-react';

interface EvidenceSlot {
  id: string;
  label: string;
  captured: boolean;
}

interface QuestionDetail {
  id: number;
  category: string;
  question: string;
  instructions?: string;
  answer: 'compliant' | 'non-compliant' | 'n/a';
  comments?: string;
  commentsLabel?: string;
  evidence: EvidenceSlot[];
  actionId?: string;
}

interface Action {
  id: string;
  questionId: number;
  description: string;
  assignedTo: string;
  department: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'closed';
}

interface SuperUserAuditSummaryProps {
  auditId: string;
  returnTo?: string;
  returnTab?: string;
  onNavigate: (page: string, params?: any) => void;
  onExit?: () => void;
}

export function SuperUserAuditSummary({ auditId, returnTo, returnTab, onNavigate, onExit }: SuperUserAuditSummaryProps) {
  const [expandedSection, setExpandedSection] = useState<'compliant' | 'non-compliant' | 'na' | null>(null);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);

  // Mock audit data
  const auditInfo = {
    id: auditId,
    plant: 'Plant A',
    department: 'Production Line 1',
    layer: 'Layer 3',
    completedDate: '2025-12-04',
    completedBy: 'John Smith',
  };

  // Mock questions with real LPA structure
  const questions: QuestionDetail[] = [
    {
      id: 1,
      category: 'VS1',
      question: 'DO WE HAVE ANY MIXED PALLETS ON COILS?',
      instructions: 'CHECK ALL PALLET LOCATIONS VISUALLY',
      answer: 'non-compliant',
      comments: 'Found mixed pallets at location A-3 and B-7. Stop tags filled and placed.',
      commentsLabel: 'Comments',
      evidence: [
        { id: 'nc-photo', label: 'NC Photo', captured: true }
      ],
      actionId: 'ACT-2025-050'
    },
    {
      id: 2,
      category: 'VS1',
      question: 'ARE THE CORRECT TAGS BEING USED ON THE FINISHED PRODUCT? SAMPLE 10 RANDOM COILS/REELS',
      instructions: 'Inspect 10 random coils or reels and verify tag correctness',
      answer: 'compliant',
      comments: 'All sampled coils had correct tags with proper information filled out.',
      commentsLabel: 'Please input findings',
      evidence: [
        { id: 'photo-1', label: 'Photo 1', captured: true },
        { id: 'photo-2', label: 'Photo 2', captured: false }
      ]
    },
    {
      id: 3,
      category: 'VS1',
      question: 'ARE THE COILER AND REELER OPERATORS STORING WIP TAGS IN BLACK BINS?',
      instructions: 'Ensure no more than one tag per coiler and 2 tags per reeler at the workstation.',
      answer: 'compliant',
      comments: 'All workstations compliant. Tags properly stored in black bins.',
      commentsLabel: 'Comments on findings',
      evidence: [
        { id: 'workstation-1', label: 'Any workstation photo 1', captured: true },
        { id: 'workstation-2', label: 'Any workstation photo 2', captured: true }
      ]
    },
    {
      id: 4,
      category: 'VS2',
      question: 'DO WE HAVE ANY MIXED PALLETS ON REELS AT ALL 16 PALLET LOCATIONS?',
      instructions: 'Check all pallet locations visually.',
      answer: 'compliant',
      comments: 'All 16 locations checked. No mixed pallets found. Material handler John Doe recognized for excellent organization.',
      commentsLabel: 'Comments',
      evidence: [
        { id: 'nc-photo', label: 'NC Photo', captured: false },
        { id: 'location-1', label: 'Pallet Location Photo 1', captured: true },
        { id: 'location-2', label: 'Pallet Location Photo 2', captured: true },
        { id: 'location-3', label: 'Pallet Location Photo 3', captured: true }
      ]
    },
    {
      id: 5,
      category: 'SHRINK WRAPPING',
      question: 'DO WE HAVE A PALLET STACKING CHECKLIST ATTACHED AND COMPLETELY FILLED?',
      instructions: 'Verify the checklist is present and all fields are completed',
      answer: 'compliant',
      comments: 'Checklist present and fully completed with all required signatures.',
      commentsLabel: 'Comments',
      evidence: [
        { id: 'checklist', label: 'Checklist Photo', captured: true }
      ]
    },
    {
      id: 6,
      category: 'SAFETY',
      question: 'ARE ALL EMERGENCY EXITS CLEARLY MARKED AND UNOBSTRUCTED?',
      instructions: 'Inspect all emergency exits in the area',
      answer: 'n/a',
      comments: 'Area under renovation - exits temporarily relocated.',
      commentsLabel: 'Reason for N/A',
      evidence: []
    },
    {
      id: 7,
      category: 'VS2',
      question: 'IS THE PRODUCTION SCHEDULE BOARD UP TO DATE?',
      instructions: 'Check the board matches current production plan',
      answer: 'non-compliant',
      comments: 'Schedule board showing yesterday\'s data. Production supervisor notified.',
      commentsLabel: 'Comments',
      evidence: [
        { id: 'board-photo', label: 'Board Photo', captured: true }
      ],
      actionId: 'ACT-2025-051'
    }
  ];

  // Mock actions data
  const actions: Action[] = [
    {
      id: 'ACT-2025-050',
      questionId: 1,
      description: 'Correct mixed pallet storage at locations A-3 and B-7',
      assignedTo: 'John Smith',
      department: 'Production Line 1',
      dueDate: '2025-11-30',
      priority: 'high',
      status: 'open'
    },
    {
      id: 'ACT-2025-051',
      questionId: 7,
      description: 'Update production schedule board daily',
      assignedTo: 'Mike Davis',
      department: 'Production Line 1',
      dueDate: '2025-11-28',
      priority: 'medium',
      status: 'in-progress'
    }
  ];

  const compliantQuestions = questions.filter(q => q.answer === 'compliant');
  const nonCompliantQuestions = questions.filter(q => q.answer === 'non-compliant');
  const naQuestions = questions.filter(q => q.answer === 'n/a');

  const getAnswerIcon = (answer: string) => {
    switch (answer) {
      case 'compliant':
        return <CheckCircle className="text-success" size={20} strokeWidth={2} />;
      case 'non-compliant':
        return <XCircle className="text-destructive" size={20} strokeWidth={2} />;
      case 'n/a':
        return <MinusCircle className="text-text-muted" size={20} strokeWidth={2} />;
      default:
        return null;
    }
  };

  const handleBack = () => {
    if (returnTo && returnTab) {
      onNavigate(returnTo, { activeTab: returnTab });
    } else if (returnTo) {
      onNavigate(returnTo);
    } else {
      onNavigate('super-user', { activeTab: 'audits' });
    }
  };

  const renderQuestionDetail = (question: QuestionDetail) => {
    const relatedAction = actions.find(a => a.id === question.actionId);
    
    return (
      <div key={question.id} className="border-b border-divider last:border-0 pb-4 last:pb-0">
        {/* Question Header */}
        <div className="flex items-start gap-3 mb-3">
          {getAnswerIcon(question.answer)}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="text-xs">{question.category}</Badge>
              <span className="text-xs text-text-secondary">Q{question.id}</span>
            </div>
            <p className="text-sm font-medium mb-1">{question.question}</p>
            {question.instructions && (
              <p className="text-xs text-text-secondary italic mb-2">{question.instructions}</p>
            )}
          </div>
        </div>

        {/* Comments */}
        {question.comments && (
          <div className="ml-8 mb-3">
            <p className="text-xs text-text-secondary mb-1">{question.commentsLabel || 'Comments'}:</p>
            <p className="text-sm bg-surface p-3 rounded border border-border">{question.comments}</p>
          </div>
        )}

        {/* Evidence */}
        {question.evidence.length > 0 && (
          <div className="ml-8 mb-3">
            <p className="text-xs text-text-secondary mb-2">Evidence:</p>
            <div className="flex flex-wrap gap-2">
              {question.evidence.map(ev => (
                <div
                  key={ev.id}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs ${
                    ev.captured
                      ? 'bg-success/10 text-success border border-success/20'
                      : 'bg-surface text-text-muted border border-border'
                  }`}
                >
                  <Camera size={12} strokeWidth={2} />
                  <span>{ev.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Action */}
        {relatedAction && (
          <div 
            className="ml-8 mt-3 bg-warning/5 border-2 border-warning/30 rounded-lg p-3 hover:border-warning/50 hover:bg-warning/10 transition-all cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedAction(relatedAction);
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <AlertCircle size={16} className="text-warning" strokeWidth={2} />
                  <span className="text-xs font-medium">Action Created</span>
                  <Badge variant="secondary" className="text-xs">{relatedAction.id}</Badge>
                  <Badge 
                    variant={
                      relatedAction.priority === 'high' 
                        ? 'priority-high' 
                        : relatedAction.priority === 'medium'
                        ? 'priority-medium'
                        : 'priority-low'
                    } 
                    className="text-xs"
                  >
                    {relatedAction.priority.toUpperCase()}
                  </Badge>
                  <Badge 
                    variant={
                      relatedAction.status === 'closed' 
                        ? 'success' 
                        : relatedAction.status === 'in-progress' 
                        ? 'warning' 
                        : 'secondary'
                    } 
                    className="text-xs"
                  >
                    {relatedAction.status === 'in-progress' ? 'IN PROGRESS' : relatedAction.status.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm mb-2">{relatedAction.description}</p>
                <div className="space-y-1">
                  <p className="text-xs text-text-secondary">
                    <span className="font-medium">Assigned to:</span> {relatedAction.assignedTo}
                  </p>
                  <p className="text-xs text-text-secondary">
                    <span className="font-medium">Due:</span> {new Date(relatedAction.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-warning/20">
              <p className="text-xs text-primary font-medium">Click to view details →</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <AppHeader 
        title="Audit Summary" 
        onBack={handleBack}
        onExit={onExit}
      />

      <div className="space-y-4 px-4 md:px-[100px] py-6">
        {/* Audit Info Card */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="mb-2">{auditInfo.id}</h2>
                <Badge variant="submitted">Submitted</Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-divider">
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={16} strokeWidth={1.5} className="text-text-secondary" />
                <span><span className="font-medium">Plant:</span> {auditInfo.plant}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Layers size={16} strokeWidth={1.5} className="text-text-secondary" />
                <span><span className="font-medium">Department:</span> {auditInfo.department}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Layers size={16} strokeWidth={1.5} className="text-text-secondary" />
                <span><span className="font-medium">Layer:</span> {auditInfo.layer}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={16} strokeWidth={1.5} className="text-text-secondary" />
                <span>Completed: {auditInfo.completedDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm col-span-1 md:col-span-2">
                <span><span className="font-medium">Auditor:</span> {auditInfo.completedBy}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Summary Stats */}
        <Card>
          <h3 className="mb-4">Results Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="text-success" size={24} strokeWidth={2} />
              </div>
              <p className="text-2xl font-medium text-success">{compliantQuestions.length}</p>
              <p className="text-xs text-text-secondary mt-1">Compliant</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <XCircle className="text-destructive" size={24} strokeWidth={2} />
              </div>
              <p className="text-2xl font-medium text-destructive">{nonCompliantQuestions.length}</p>
              <p className="text-xs text-text-secondary mt-1">NC</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MinusCircle className="text-text-muted" size={24} strokeWidth={2} />
              </div>
              <p className="text-2xl font-medium text-text-muted">{naQuestions.length}</p>
              <p className="text-xs text-text-secondary mt-1">N/A</p>
            </div>
          </div>
        </Card>

        {/* Compliant Questions - Expandable */}
        {compliantQuestions.length > 0 && (
          <Card 
            onClick={() => setExpandedSection(expandedSection === 'compliant' ? null : 'compliant')}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-success" size={24} strokeWidth={2} />
                <div>
                  <h3 className="mb-1">Compliant ({compliantQuestions.length})</h3>
                  <p className="text-xs text-text-secondary">Click to view details</p>
                </div>
              </div>
              {expandedSection === 'compliant' ? (
                <ChevronUp size={20} className="text-text-secondary" strokeWidth={2} />
              ) : (
                <ChevronDown size={20} className="text-text-secondary" strokeWidth={2} />
              )}
            </div>

            {expandedSection === 'compliant' && (
              <div className="mt-6 pt-6 border-t border-divider space-y-4" onClick={(e) => e.stopPropagation()}>
                {compliantQuestions.map(renderQuestionDetail)}
              </div>
            )}
          </Card>
        )}

        {/* Non-Compliant Questions - Expandable */}
        {nonCompliantQuestions.length > 0 && (
          <Card 
            onClick={() => setExpandedSection(expandedSection === 'non-compliant' ? null : 'non-compliant')}
            className="cursor-pointer border-destructive/20"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <XCircle className="text-destructive" size={24} strokeWidth={2} />
                <div>
                  <h3 className="mb-1">Non-Compliant ({nonCompliantQuestions.length})</h3>
                  <p className="text-xs text-text-secondary">Click to view details and actions</p>
                </div>
              </div>
              {expandedSection === 'non-compliant' ? (
                <ChevronUp size={20} className="text-text-secondary" strokeWidth={2} />
              ) : (
                <ChevronDown size={20} className="text-text-secondary" strokeWidth={2} />
              )}
            </div>

            {expandedSection === 'non-compliant' && (
              <div className="mt-6 pt-6 border-t border-divider space-y-4" onClick={(e) => e.stopPropagation()}>
                {nonCompliantQuestions.map(renderQuestionDetail)}
              </div>
            )}
          </Card>
        )}

        {/* N/A Questions - Expandable */}
        {naQuestions.length > 0 && (
          <Card 
            onClick={() => setExpandedSection(expandedSection === 'na' ? null : 'na')}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <MinusCircle className="text-text-muted" size={24} strokeWidth={2} />
                <div>
                  <h3 className="mb-1">N/A ({naQuestions.length})</h3>
                  <p className="text-xs text-text-secondary">Click to view details</p>
                </div>
              </div>
              {expandedSection === 'na' ? (
                <ChevronUp size={20} className="text-text-secondary" strokeWidth={2} />
              ) : (
                <ChevronDown size={20} className="text-text-secondary" strokeWidth={2} />
              )}
            </div>

            {expandedSection === 'na' && (
              <div className="mt-6 pt-6 border-t border-divider space-y-4" onClick={(e) => e.stopPropagation()}>
                {naQuestions.map(renderQuestionDetail)}
              </div>
            )}
          </Card>
        )}

        {/* Back Navigation Button */}
        <div className="pt-4">
          <Button 
            variant="primary" 
            className="w-full"
            onClick={handleBack}
          >
            Back to Audits
          </Button>
        </div>
      </div>

      {/* Action Details Dialog */}
      {selectedAction && (
        <ActionDetailsDialog
          action={selectedAction}
          onClose={() => setSelectedAction(null)}
        />
      )}
    </div>
  );
}
