import { useState } from 'react';
import { AppHeader } from '../AppHeader';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { ChevronLeft, Calendar, User, MapPin, Clock, Camera, CheckCircle, XCircle, MinusCircle, ChevronDown, ChevronUp } from 'lucide-react';

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
  detailedInstructions?: string;
  answer: string;
  comments?: string;
  commentsLabel?: string;
  evidence: EvidenceSlot[];
}

interface ActionItem {
  id: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: string;
}

interface SuperUserAuditDetailProps {
  auditId: string;
  returnTo?: string;
  returnTab?: string;
  onBack: () => void;
  onExit?: () => void;
  onNavigateToAction?: (actionId: string) => void;
}

export function SuperUserAuditDetail({ auditId, returnTo, returnTab, onBack, onExit, onNavigateToAction }: SuperUserAuditDetailProps) {
  const [expandedInstructions, setExpandedInstructions] = useState<Record<number, boolean>>({});
  const [expandedDepartments, setExpandedDepartments] = useState<Record<string, boolean>>({});

  // Determine status based on auditId for demo purposes
  const getStatusFromAuditId = (id: string) => {
    if (id === 'AUD-2025-050') return 'Not Started';
    if (id === 'AUD-2025-056' || id === 'AUD-2025-055' || id === 'AUD-2025-053') return 'Submitted';
    if (id === 'AUD-2025-054' || id === 'AUD-2025-049') return 'In Progress';
    if (id === 'AUD-2025-052' || id === 'AUD-2025-051') return 'Completed';
    if (id === 'AUD-2025-047' || id === 'AUD-2025-048') return 'Denied';
    return 'Submitted';
  };

  const status = getStatusFromAuditId(auditId);
  const showQuestions = status !== 'Not Started' && status !== 'Denied';

  // Mock data with real LPA question structure
  const auditData = {
    id: auditId,
    department: 'Production Line 1',
    plant: 'Plant A',
    auditor: 'John Smith',
    date: '2025-12-04',
    startTime: '09:00 AM',
    endTime: '10:15 AM',
    status: status,
    questions: showQuestions ? [
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
        ]
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
        detailedInstructions: 'Check all coiler and reeler workstations. Verify that WIP (Work In Progress) tags are stored properly in designated black bins. Each coiler should have no more than one tag, and each reeler should have no more than two tags present at their station.',
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
        commentsLabel: 'Comments in shrink wrapping area',
        evidence: [
          { id: 'checklist', label: 'Pallet stacking checklist photo', captured: true }
        ]
      }
    ] as QuestionDetail[] : [],
    actions: showQuestions ? (
      status === 'Completed' ? [
        {
          id: 'ACT-2025-089',
          description: 'Separate mixed pallets and properly organize coils by type',
          assignedTo: 'Department Owner - Production',
          dueDate: '2025-12-08',
          status: 'Closed'
        }
      ] : status === 'In Progress' ? [
        {
          id: 'ACT-2025-089',
          description: 'Separate mixed pallets and properly organize coils by type',
          assignedTo: 'Department Owner - Production',
          dueDate: '2025-12-08',
          status: 'Closed'
        },
        {
          id: 'ACT-2025-090',
          description: 'Update safety procedures documentation',
          assignedTo: 'Department Owner - Safety',
          dueDate: '2025-12-10',
          status: 'Open'
        }
      ] : [
        {
          id: 'ACT-2025-089',
          description: 'Separate mixed pallets and properly organize coils by type',
          assignedTo: 'Department Owner - Production',
          dueDate: '2025-12-08',
          status: 'Open'
        }
      ]
    ) as ActionItem[] : [],
    deniedComments: status === 'Denied' ? 'Audit failed due to non-compliance with safety protocols.' : undefined,
    deniedDate: status === 'Denied' ? '2025-12-05' : undefined
  };

  // Calculate statistics
  const stats = {
    compliant: auditData.questions.filter(q => q.answer === 'compliant').length,
    nonCompliant: auditData.questions.filter(q => q.answer === 'non-compliant').length,
    na: auditData.questions.filter(q => q.answer === 'na').length
  };

  const toggleInstructions = (questionId: number) => {
    setExpandedInstructions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const toggleDepartment = (category: string) => {
    setExpandedDepartments(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'not started': return 'secondary';
      case 'denied': return 'denied';
      case 'in progress': return 'in-progress';
      case 'submitted': return 'submitted';
      case 'completed': return 'completed';
      case 'open': return 'open';
      case 'closed': return 'closed';
      default: return 'secondary';
    }
  };

  const getActionBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'open';
      case 'closed': return 'closed';
      case 'overdue': return 'overdue';
      default: return 'secondary';
    }
  };

  const getAnswerBadge = (answer: string) => {
    const styles = {
      'compliant': 'bg-[#EEF7EE] text-[#2D5A29] border-[#4CAC48]',
      'non-compliant': 'bg-[#FCE5E7] text-[#D13438] border-[#D13438]',
      'na': 'bg-[#F3F2F1] text-[#605E5C] border-[#605E5C]'
    };

    const labels = {
      'compliant': 'Compliant',
      'non-compliant': 'Non-Compliant',
      'na': 'N/A'
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-medium ${styles[answer as keyof typeof styles]}`}>
        {answer === 'compliant' && <CheckCircle size={14} />}
        {answer === 'non-compliant' && <XCircle size={14} />}
        {answer === 'na' && <MinusCircle size={14} />}
        {labels[answer as keyof typeof labels]}
      </span>
    );
  };

  const categories = Array.from(new Set(auditData.questions.map(q => q.category)));

  return (
    <div className="min-h-screen bg-[#F5F8F5]">
      <AppHeader 
        title="Audit Details"
        onExit={onExit}
      />

      <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto pb-8">
        {/* Audit Header Card */}
        <Card>
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="mb-2">{auditData.id}</h2>
                <p className="text-sm text-[#605E5C]">{auditData.department}</p>
              </div>
              <Badge variant={getStatusBadgeVariant(auditData.status)}>{auditData.status}</Badge>
            </div>

            {/* Audit Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-5 border-t border-[rgba(0,0,0,0.08)]">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-[#605E5C] shrink-0" />
                <div>
                  <p className="text-xs text-[#605E5C] mb-0.5 uppercase tracking-wide">Plant</p>
                  <p className="text-sm text-[#323130]">{auditData.plant}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User size={16} className="text-[#605E5C] shrink-0" />
                <div>
                  <p className="text-xs text-[#605E5C] mb-0.5 uppercase tracking-wide">Auditor</p>
                  <p className="text-sm text-[#323130]">{auditData.auditor}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-[#605E5C] shrink-0" />
                <div>
                  <p className="text-xs text-[#605E5C] mb-0.5 uppercase tracking-wide">Date</p>
                  <p className="text-sm text-[#323130]">{new Date(auditData.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-[#605E5C] shrink-0" />
                <div>
                  <p className="text-xs text-[#605E5C] mb-0.5 uppercase tracking-wide">Time</p>
                  <p className="text-sm text-[#323130]">{auditData.startTime} - {auditData.endTime}</p>
                </div>
              </div>
            </div>

            {/* Summary Stats - Only show if questions exist */}
            {showQuestions && (
              <div className="grid grid-cols-3 gap-6 pt-5 border-t border-[rgba(0,0,0,0.08)]">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CheckCircle size={22} className="text-[#4CAC48]" />
                    <p className="text-3xl font-medium text-[#323130]">{stats.compliant}</p>
                  </div>
                  <p className="text-sm text-[#605E5C]">Compliance</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <XCircle size={22} className="text-[#D13438]" />
                    <p className="text-3xl font-medium text-[#323130]">{stats.nonCompliant}</p>
                  </div>
                  <p className="text-sm text-[#605E5C]">Non-Compliant</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <MinusCircle size={22} className="text-[#605E5C]" />
                    <p className="text-3xl font-medium text-[#323130]">{stats.na}</p>
                  </div>
                  <p className="text-sm text-[#605E5C]">N/A</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Denied Comments - Only show if status is Denied */}
        {auditData.status === 'Denied' && auditData.deniedComments && (
          <Card>
            <div className="bg-[#FEF0F0] rounded-lg p-4 md:p-5 border-l-4 border-[#D13438]">
              <div className="flex items-start gap-3 mb-3">
                <XCircle size={20} className="text-[#D13438] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-[#D13438] mb-1">Audit Denied</h3>
                  <p className="text-xs text-[#605E5C] uppercase tracking-wide">
                    Denied on {new Date(auditData.deniedDate || auditData.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="pl-8">
                <p className="text-xs font-medium text-[#605E5C] mb-2 uppercase tracking-wide">Reason</p>
                <p className="text-sm text-[#323130] leading-relaxed">{auditData.deniedComments}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Questions by Category - Only show if questions exist */}
        {showQuestions && (
          <div className="space-y-3">
            <h2>Audit Questions</h2>
            
            {categories.map(category => {
              const categoryQuestions = auditData.questions.filter(q => q.category === category);
              const isExpanded = expandedDepartments[category];

              return (
                <div 
                  key={category}
                  className="bg-white rounded-lg border border-[rgba(0,0,0,0.12)] overflow-hidden transition-all duration-200"
                >
                  {/* Department Accordion Header - Collapsed/Expanded State */}
                  <button
                    onClick={() => toggleDepartment(category)}
                    className="w-full flex items-center justify-between gap-3 px-4 md:px-5 py-3 md:py-4 hover:bg-[#F5F8F5] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-block px-3 py-1.5 rounded-full bg-[#EEF7EE] text-[#2D5A29] font-medium text-sm">
                        {category}
                      </span>
                      <span className="text-sm text-[#605E5C]">
                        {categoryQuestions.length} question{categoryQuestions.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <ChevronDown 
                      size={20} 
                      className={`text-[#605E5C] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </button>
                  
                  {/* Department Accordion Content - Smooth Expand/Collapse */}
                  <div 
                    className={`transition-all duration-300 ease-in-out ${
                      isExpanded ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                    }`}
                  >
                    <div className="px-4 md:px-5 pb-4 md:pb-5 pt-2 border-t border-[rgba(0,0,0,0.08)]">
                      {/* Questions Grid */}
                      <div className="space-y-5 mt-3">
                        {categoryQuestions.map((question, index) => (
                          <div 
                            key={question.id}
                            className={`bg-[#FAFAFA] rounded-lg p-4 md:p-5 ${
                              index < categoryQuestions.length - 1 ? 'mb-3' : ''
                            }`}
                          >
                            {/* Question Title */}
                            <div className="mb-4">
                              <h3 className="text-[#323130]">{question.id}. {question.question}</h3>
                            </div>

                            {/* Instructions */}
                            {question.instructions && (
                              <div className="mb-4 bg-[#F3F2F1] rounded-lg p-3 md:p-4">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1">
                                    <p className="font-medium text-[#323130] mb-1 text-sm">Instructions</p>
                                    <p className="text-sm text-[#605E5C] leading-relaxed">{question.instructions}</p>
                                  </div>
                                  {question.detailedInstructions && (
                                    <button
                                      onClick={() => toggleInstructions(question.id)}
                                      className="flex items-center gap-1 text-sm text-[#4CAC48] hover:text-[#2D5A29] transition-colors shrink-0"
                                    >
                                      {expandedInstructions[question.id] ? (
                                        <>
                                          <ChevronUp size={16} />
                                          <span>Less</span>
                                        </>
                                      ) : (
                                        <>
                                          <ChevronDown size={16} />
                                          <span>More</span>
                                        </>
                                      )}
                                    </button>
                                  )}
                                </div>
                                
                                {expandedInstructions[question.id] && question.detailedInstructions && (
                                  <div className="pt-3 mt-3 border-t border-[rgba(0,0,0,0.08)]">
                                    <p className="text-sm text-[#605E5C] leading-relaxed">
                                      {question.detailedInstructions}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Response */}
                            <div className="mb-4">
                              <p className="text-xs font-medium text-[#605E5C] mb-2 uppercase tracking-wide">Response</p>
                              {getAnswerBadge(question.answer)}
                            </div>

                            {/* Evidence Gallery */}
                            {question.evidence.length > 0 && question.evidence.some(e => e.captured) && (
                              <div className="mb-4">
                                <p className="text-xs font-medium text-[#605E5C] mb-3 uppercase tracking-wide">Evidence</p>
                                <div className="flex flex-wrap gap-2 md:gap-3">
                                  {question.evidence.filter(e => e.captured).map(evidence => (
                                    <div key={evidence.id} className="w-32 md:w-36">
                                      <div className="rounded-lg border-2 border-[#4CAC48] overflow-hidden mb-2 bg-[#E1E1E1]">
                                        <div className="aspect-square flex items-center justify-center">
                                          <Camera size={28} className="text-[#605E5C]" />
                                        </div>
                                      </div>
                                      <p className="text-xs text-[#605E5C] text-center leading-tight">{evidence.label}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Comments */}
                            {question.comments && (
                              <div className="bg-white rounded-lg p-3 md:p-4 border-l-4 border-[#4CAC48]">
                                <p className="text-xs font-medium text-[#605E5C] mb-2 uppercase tracking-wide">
                                  {question.commentsLabel || 'Comments'}
                                </p>
                                <p className="text-sm text-[#323130] leading-relaxed">{question.comments}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Corrective Actions - Only show if actions exist */}
        {showQuestions && auditData.actions.length > 0 && (
          <Card>
            <h3 className="mb-5">Corrective Actions</h3>
            <div className="space-y-4">
              {auditData.actions.map((action) => (
                <div 
                  key={action.id}
                  className="p-5 border border-[rgba(0,0,0,0.08)] rounded-lg bg-[#F5F8F5]"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h4 
                          className="text-[#323130] cursor-pointer hover:text-[#4CAC48] transition-colors underline"
                          onClick={() => onNavigateToAction && onNavigateToAction(action.id)}
                        >
                          {action.id}
                        </h4>
                        <div className="md:hidden">
                          <Badge variant={getActionBadgeVariant(action.status)}>{action.status}</Badge>
                        </div>
                      </div>
                      <p className="text-xs text-[#605E5C] md:hidden mb-2 uppercase tracking-wide">
                        Due: {new Date(action.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="hidden md:block">
                      <Badge variant={getActionBadgeVariant(action.status)}>{action.status}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-[#323130] leading-relaxed mb-3">{action.description}</p>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs text-[#605E5C]">
                    <span>Assigned to: {action.assignedTo}</span>
                    <span className="hidden md:inline uppercase tracking-wide">
                      Due: {new Date(action.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Back Button */}
        <div className="flex justify-end">
          <Button variant="tertiary" onClick={onBack}>
            <ChevronLeft size={16} />
            Back to {returnTo === 'super-user' ? 'Super User Admin' : 'Dashboard'}
          </Button>
        </div>
      </div>
    </div>
  );
}