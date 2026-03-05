// @ts-nocheck
import { useEffect, useState } from 'react';
import { AppHeader } from '../AppHeader';
import { Card } from '../Card';
import { Button } from '../Button';
import { Textarea } from '../Input';
import { ChevronLeft, ChevronRight, Camera, X, ChevronDown, ChevronUp, MessageSquare, Image as ImageIcon, Edit } from 'lucide-react';
import { Badge } from '../Badge';
import { useLpaAppContext } from '../../../../context/LpaAppContext';

interface EvidenceSlot {
  id: string;
  label: string;
  required: boolean;
}

interface CommentsRequirement {
  required: boolean;
  label: string;
  placeholder: string;
}

interface Question {
  id: number;
  category: string;
  question: string;
  instructions?: string;
  detailedInstructions?: string;
  comments?: CommentsRequirement;
  evidence: EvidenceSlot[];
}

interface QuestionnaireProps {
  auditId: string;
  onNavigate: (page: string, auditId?: string) => void;
  onBack: () => void;
  onExit?: () => void;
}

interface ResponseData {
  answer?: string;
  comments?: string;
  evidence: Record<string, { file: string; comment: string }>;
}

// Group questions by department
const groupQuestionsByDepartment = (questions: Question[]) => {
  const grouped: Record<string, Question[]> = {};
  questions.forEach(q => {
    if (!grouped[q.category]) {
      grouped[q.category] = [];
    }
    grouped[q.category].push(q);
  });
  return grouped;
};

const shuffleQuestions = (questions: Question[]): Question[] => {
  const result: Question[] = [...questions];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j: number = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export function Questionnaire({ auditId, onNavigate, onBack, onExit }: QuestionnaireProps) {
  const { service } = useLpaAppContext();
  const [liveQuestions, setLiveQuestions] = useState<Question[]>([]);
  const questionSource: Question[] = liveQuestions;
  const departmentGroups = groupQuestionsByDepartment(questionSource);
  const departments = Object.keys(departmentGroups);
  
  const [responses, setResponses] = useState<Record<number, ResponseData>>({});
  const [expandedDepartment, setExpandedDepartment] = useState<string | null>(departments[0] || null);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [expandedInstructions, setExpandedInstructions] = useState<Record<number, boolean>>({});

  useEffect(() => {
    let mounted = true;
    service
      .getQuestionBankQuestions()
      .then((items) => {
        if (!mounted) {
          return;
        }
        const normalized: Question[] = items.map((item, index) => {
          const evidenceCount: number = Math.max(item.MaxPhotos || 0, item.IsEvidenceRequired ? 1 : 0);
          const evidence: EvidenceSlot[] = Array.from({ length: evidenceCount }, (_, evidenceIndex) => ({
            id: `e-${item.Id || index + 1}-${evidenceIndex + 1}`,
            label: evidenceCount > 1 ? `Evidence ${evidenceIndex + 1}` : 'Evidence',
            required: !!item.IsEvidenceRequired
          }));

          return {
            id: item.Id || index + 1,
            category: item.DepartmentName || item.Category || 'General',
            question: item.QuestionText || item.Title,
            instructions: item.Instructions || '',
            evidence
          };
        });

        setLiveQuestions(shuffleQuestions(normalized));
      })
      .catch(() => {
        if (mounted) {
          setLiveQuestions([]);
        }
      });

    return () => {
      mounted = false;
    };
  }, [auditId, service]);

  // Get department status
  const getDepartmentStatus = (department: string): 'not-started' | 'in-progress' | 'completed' => {
    const deptQuestions = departmentGroups[department];
    const answeredCount = deptQuestions.filter(q => responses[q.id]?.answer).length;
    
    if (answeredCount === 0) return 'not-started';
    if (answeredCount === deptQuestions.length) return 'completed';
    return 'in-progress';
  };

  // Get question response status
  const getQuestionStatus = (questionId: number): 'not-answered' | 'conforming' | 'non-conforming' | 'na' => {
    const response = responses[questionId];
    if (!response?.answer) return 'not-answered';
    return response.answer as any;
  };

  // Check if question has evidence
  const hasEvidence = (questionId: number): boolean => {
    const response = responses[questionId];
    return response?.evidence && Object.keys(response.evidence).length > 0;
  };

  // Check if question has comments
  const hasComments = (questionId: number): boolean => {
    const response = responses[questionId];
    return !!(response?.comments && response.comments.trim());
  };

  // Toggle department accordion
  const toggleDepartment = (department: string) => {
    setExpandedDepartment(expandedDepartment === department ? null : department);
  };

  // Toggle question expansion
  const toggleQuestion = (questionId: number) => {
    if (expandedQuestion === questionId) {
      setExpandedQuestion(null);
    } else {
      setExpandedQuestion(questionId);
      // Reset instruction expansion when opening a different question
      if (!expandedInstructions[questionId]) {
        setExpandedInstructions({ ...expandedInstructions, [questionId]: false });
      }
    }
  };

  // Toggle instructions for a specific question
  const toggleInstructions = (questionId: number) => {
    setExpandedInstructions({
      ...expandedInstructions,
      [questionId]: !expandedInstructions[questionId]
    });
  };

  // Validation logic for current editing question
  const validateResponse = (questionId: number) => {
    const question = questionSource.find(q => q.id === questionId);
    if (!question) return false;

    const currentResponse = responses[questionId] || { answer: '', comments: '', evidence: {} };

    // Check main answer
    if (!currentResponse.answer) return false;

    // Check required comments
    if (question.comments?.required && !currentResponse.comments?.trim()) {
      return false;
    }

    // Check required evidence
    const isNonConforming = currentResponse.answer === 'non-conforming';

    for (const evidenceSlot of question.evidence) {
      if (evidenceSlot.required && isNonConforming && !currentResponse.evidence[evidenceSlot.id]) {
        return false;
      }
    }

    return true;
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    const currentResponse = responses[questionId] || { answer: '', comments: '', evidence: {} };
    setResponses({
      ...responses,
      [questionId]: { ...currentResponse, answer }
    });
  };

  const handleCommentsChange = (questionId: number, comments: string) => {
    const currentResponse = responses[questionId] || { answer: '', comments: '', evidence: {} };
    setResponses({
      ...responses,
      [questionId]: { ...currentResponse, comments }
    });
  };

  const handleCaptureEvidence = (questionId: number, evidenceId: string) => {
    const currentResponse = responses[questionId] || { answer: '', comments: '', evidence: {} };
    const auditItemId: number = Number(String(auditId).replace(/[^\d]/g, '')) || 0;
    const blob: Blob = new Blob(['placeholder-image'], { type: 'image/jpeg' });
    const fileName: string = `audit-${auditItemId || 'x'}-q${questionId}-${Date.now()}.jpg`;

    service
      .uploadAuditEvidence(fileName, blob, {
        AuditInstanceId: auditItemId,
        AuditQuestionInstanceId: questionId
      })
      .then((url) => {
        setResponses({
          ...responses,
          [questionId]: {
            ...currentResponse,
            evidence: {
              ...currentResponse.evidence,
              [evidenceId]: { file: url || fileName, comment: '' }
            }
          }
        });
      })
      .catch(() => {
        setResponses({
          ...responses,
          [questionId]: {
            ...currentResponse,
            evidence: {
              ...currentResponse.evidence,
              [evidenceId]: { file: fileName, comment: '' }
            }
          }
        });
      });
  };

  const handleRemoveEvidence = (questionId: number, evidenceId: string) => {
    const currentResponse = responses[questionId] || { answer: '', comments: '', evidence: {} };
    const newEvidence = { ...currentResponse.evidence };
    delete newEvidence[evidenceId];
    setResponses({
      ...responses,
      [questionId]: { ...currentResponse, evidence: newEvidence }
    });
  };

  const handleEvidenceCommentChange = (questionId: number, evidenceId: string, comment: string) => {
    const currentResponse = responses[questionId] || { answer: '', comments: '', evidence: {} };
    if (currentResponse.evidence[evidenceId]) {
      setResponses({
        ...responses,
        [questionId]: {
          ...currentResponse,
          evidence: {
            ...currentResponse.evidence,
            [evidenceId]: {
              ...currentResponse.evidence[evidenceId],
              comment
            }
          }
        }
      });
    }
  };

  // Render status badge
  const renderStatusBadge = (status: 'not-started' | 'in-progress' | 'completed') => {
    const variants = {
      'not-started': { bg: '#F3F2F1', text: '#605E5C', label: 'Not Started' },
      'in-progress': { bg: '#FFF4CE', text: '#8A6D3B', label: 'In Progress' },
      'completed': { bg: '#EEF7EE', text: '#2D5A29', label: 'Completed' }
    };
    const variant = variants[status];
    return (
      <span 
        className="px-3 py-1 rounded-full text-xs font-medium"
        style={{ backgroundColor: variant.bg, color: variant.text }}
      >
        {variant.label}
      </span>
    );
  };

  // Render question status badge
  const renderQuestionStatusBadge = (status: 'not-answered' | 'conforming' | 'non-conforming' | 'na') => {
    if (status === 'not-answered') {
      return <span className="text-xs text-[#605E5C]">Not Answered</span>;
    }
    if (status === 'conforming') {
      return <Badge variant="accepted">Conforming</Badge>;
    }
    if (status === 'non-conforming') {
      return <Badge variant="overdue">NC</Badge>;
    }
    if (status === 'na') {
      return <Badge variant="secondary">N/A</Badge>;
    }
  };

  // Main accordion view
  const allAnswered = questionSource.every(q => responses[q.id]?.answer);

  useEffect(() => {
    if (!expandedDepartment && departments.length > 0) {
      setExpandedDepartment(departments[0]);
    }
  }, [departments, expandedDepartment]);

  useEffect(() => {
    const auditItemId: number = Number(String(auditId).replace(/[^\d]/g, '')) || 0;
    if (!auditItemId) {
      return;
    }

    const payload = Object.entries(responses)
      .filter(([, value]: any) => !!value?.answer)
      .map(([questionId, value]: any) => ({
        AuditInstanceId: auditItemId,
        AuditQuestionInstanceId: Number(questionId),
        ResponseValue: value.answer === 'non-conforming' ? 'non-compliant' : value.answer,
        Notes: value.comments || '',
        EvidenceUrls: Object.values(value.evidence || {})
          .map((e: any) => e.file)
          .join(';')
      }));

    if (!payload.length) {
      return;
    }

    const timer = setTimeout(() => {
      service.upsertAuditResponses(payload as any).catch(() => undefined);
    }, 400);

    return () => clearTimeout(timer);
  }, [responses, auditId, service]);

  return (
    <div className="min-h-screen bg-[#F5F8F5] pb-24">
      <AppHeader title="Audit Questionnaire" onBack={onBack} onExit={onExit} />

      {/* Progress Summary */}
      <div className="bg-white border-b border-[rgba(0,0,0,0.12)] px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h3>Progress</h3>
            <span className="text-body-small text-[#6B7280]">
              {questionSource.filter(q => responses[q.id]?.answer).length} of {questionSource.length} answered
            </span>
          </div>
          <div className="h-2 bg-[#F3F2F1] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#4CAC48] transition-all duration-300"
              style={{ width: `${questionSource.length > 0 ? (questionSource.filter(q => responses[q.id]?.answer).length / questionSource.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3 max-w-3xl mx-auto">
        {questionSource.length === 0 && (
          <Card className="text-center py-10">
            <p className="text-text-muted">No questionnaire items found for this audit.</p>
          </Card>
        )}
        {/* Department Accordion Cards */}
        {departments.map(department => {
          const deptQuestions = departmentGroups[department];
          const status = getDepartmentStatus(department);
          const isExpanded = expandedDepartment === department;
          const answeredCount = deptQuestions.filter(q => responses[q.id]?.answer).length;
          const totalCount = deptQuestions.length;

          return (
            <Card key={department} className="overflow-hidden shadow-md">
              {/* Department Header - Clickable */}
              <button
                onClick={() => toggleDepartment(department)}
                className={`w-full flex items-center justify-between gap-4 transition-colors ${
                  isExpanded ? 'bg-[#F5F8F5]' : 'hover:bg-[#F5F8F5]'
                }`}
              >
                <div className="flex-1 text-left">
                  <h3 className="mb-1">{department}</h3>
                  <p className="text-label">{totalCount} Question{totalCount !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Desktop: Count badges before status badge */}
                  <div className="hidden md:flex items-center gap-2">
                    {/* Conforming Count */}
                    {deptQuestions.filter(q => responses[q.id]?.answer === 'conforming').length > 0 && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#EEF7EE]">
                        <div className="w-3 h-3 rounded-full bg-[#4CAF50]"></div>
                        <span className="text-caption-small text-emphasis text-[#2D5A29]">
                          {deptQuestions.filter(q => responses[q.id]?.answer === 'conforming').length}
                        </span>
                      </div>
                    )}
                    {/* Non-Conforming Count */}
                    {deptQuestions.filter(q => responses[q.id]?.answer === 'non-conforming').length > 0 && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#FCE5E7]">
                        <div className="w-3 h-3 rounded-full bg-[#D13438]"></div>
                        <span className="text-caption-small text-emphasis text-[#D13438]">
                          {deptQuestions.filter(q => responses[q.id]?.answer === 'non-conforming').length}
                        </span>
                      </div>
                    )}
                    {/* N/A Count */}
                    {deptQuestions.filter(q => responses[q.id]?.answer === 'na').length > 0 && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#F3F2F1]">
                        <div className="w-3 h-3 rounded-full bg-[#605E5C]"></div>
                        <span className="text-caption-small text-emphasis text-[#605E5C]">
                          {deptQuestions.filter(q => responses[q.id]?.answer === 'na').length}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Mobile & Desktop: Status badge and chevron wrapper */}
                  <div className="flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-3">
                    {renderStatusBadge(status)}
                    
                    {/* Mobile: Count badges under status badge, right-aligned */}
                    <div className="flex md:hidden items-center gap-2">
                      {/* Conforming Count */}
                      {deptQuestions.filter(q => responses[q.id]?.answer === 'conforming').length > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-[#4CAF50]"></div>
                          <span className="text-caption-small text-emphasis text-[#2D5A29]">
                            {deptQuestions.filter(q => responses[q.id]?.answer === 'conforming').length}
                          </span>
                        </div>
                      )}
                      {/* Non-Conforming Count */}
                      {deptQuestions.filter(q => responses[q.id]?.answer === 'non-conforming').length > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-[#D13438]"></div>
                          <span className="text-caption-small text-emphasis text-[#D13438]">
                            {deptQuestions.filter(q => responses[q.id]?.answer === 'non-conforming').length}
                          </span>
                        </div>
                      )}
                      {/* N/A Count */}
                      {deptQuestions.filter(q => responses[q.id]?.answer === 'na').length > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-[#605E5C]"></div>
                          <span className="text-caption-small text-emphasis text-[#605E5C]">
                            {deptQuestions.filter(q => responses[q.id]?.answer === 'na').length}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <ChevronDown 
                    size={20} 
                    className={`text-[#4CAC48] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>

              {/* Expanded Question List */}
              {isExpanded && (
                <div className="border-t border-[rgba(0,0,0,0.12)] bg-white">
                  {/* Single Continuous View - All Questions Expanded */}
                  <div className="px-[4px] py-[24px] space-y-8">
                    {deptQuestions.map((question, index) => {
                      const questionStatus = getQuestionStatus(question.id);
                      const currentResponse = responses[question.id] || { answer: '', comments: '', evidence: {} };
                      const isNonConforming = currentResponse.answer === 'non-conforming';
                      
                      // Helper to capitalize first letter only
                      const formatInstructions = (text: string) => {
                        if (!text) return '';
                        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
                      };

                      // Helper function to get readable status text
                      const getStatusText = (status: 'not-answered' | 'conforming' | 'non-conforming' | 'na') => {
                        if (status === 'not-answered') return 'Not answered';
                        if (status === 'conforming') return 'Conforming';
                        if (status === 'non-conforming') return 'Non-conforming';
                        if (status === 'na') return 'N/A';
                        return '';
                      };

                      return (
                        <div key={question.id}>
                          {/* Question Block */}
                          <div className="space-y-5">
                            {/* Question Header */}
                            <div>
                              <h4 className="mb-2 text-medium">
                                {question.id}. {question.question}
                              </h4>
                              <p className={`text-body-small ${
                                questionStatus === 'not-answered' ? 'text-[#6B7280]' :
                                questionStatus === 'conforming' ? 'text-[#2D5A29]' :
                                questionStatus === 'non-conforming' ? 'text-[#D13438]' :
                                'text-[#6B7280]'
                              }`}>
                                {getStatusText(questionStatus)}
                              </p>
                            </div>

                            {/* Instructions - Compact Box */}
                            {question.instructions && (
                              <div className="bg-[#F3F4F6] rounded-lg px-3 py-2">
                                <p className="text-[12px] text-[#605E5C] leading-relaxed">
                                  {formatInstructions(question.instructions)}
                                </p>
                                {question.detailedInstructions && (
                                  <>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleInstructions(question.id);
                                      }}
                                      className="flex items-center gap-1 text-[11px] text-[#4CAF50] hover:text-[#2D5A29] transition-colors mt-2 font-medium"
                                    >
                                      {expandedInstructions[question.id] ? (
                                        <>
                                          <ChevronUp size={14} />
                                          <span>Less</span>
                                        </>
                                      ) : (
                                        <>
                                          <ChevronDown size={14} />
                                          <span>More details</span>
                                        </>
                                      )}
                                    </button>
                                    {expandedInstructions[question.id] && (
                                      <div className="mt-2 pt-2 border-t border-[#E5E7EB]">
                                        <p className="text-[12px] text-[#605E5C] leading-relaxed">
                                          {formatInstructions(question.detailedInstructions)}
                                        </p>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            )}

                            {/* Response Buttons */}
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <h5 className="font-semibold text-[#323130] text-sm">Response</h5>
                                <span className="text-[11px] text-[#D13438] font-medium">* Required</span>
                              </div>

                              <div className="grid grid-cols-3 gap-3">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAnswerChange(question.id, 'conforming');
                                  }}
                                  className={`h-11 rounded-lg border-2 font-semibold transition-all text-sm shadow-sm
                                    ${currentResponse.answer === 'conforming'
                                      ? 'border-[#4CAF50] bg-[#4CAF50] text-white shadow-md'
                                      : 'border-[#E5E7EB] bg-white text-[#323130] hover:border-[#4CAF50] hover:bg-[#EEF7EE]'
                                    }`}
                                >
                                  Compliance
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAnswerChange(question.id, 'non-conforming');
                                  }}
                                  className={`h-11 rounded-lg border-2 font-semibold transition-all text-sm shadow-sm
                                    ${currentResponse.answer === 'non-conforming'
                                      ? 'border-[#D13438] bg-[#D13438] text-white shadow-md'
                                      : 'border-[#E5E7EB] bg-white text-[#323130] hover:border-[#D13438] hover:bg-[#FCE5E7]'
                                    }`}
                                >
                                  <span className="md:hidden">NC</span>
                                  <span className="hidden md:inline">Non-Compliant</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAnswerChange(question.id, 'na');
                                  }}
                                  className={`h-11 rounded-lg border-2 font-semibold transition-all text-sm shadow-sm
                                    ${currentResponse.answer === 'na'
                                      ? 'border-[#605E5C] bg-[#605E5C] text-white shadow-md'
                                      : 'border-[#E5E7EB] bg-white text-[#605E5C] hover:border-[#605E5C] hover:bg-[#F3F2F1]'
                                    }`}
                                >
                                  N/A
                                </button>
                              </div>
                            </div>

                            {/* Evidence Section - Always show if question has evidence slots */}
                            {question.evidence.length > 0 && (
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h5 className="font-semibold text-[#323130] text-sm">Evidence</h5>
                                  {question.evidence.some(e => e.required) && (
                                    <span className="text-[11px] text-[#D13438] font-medium">* Required for NC</span>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {question.evidence.map((evidenceSlot) => {
                                    const evidenceData = currentResponse.evidence[evidenceSlot.id];
                                    const hasEvidenceForSlot = !!evidenceData;
                                    const showRequired = evidenceSlot.required && isNonConforming;

                                    return (
                                      <div 
                                        key={evidenceSlot.id} 
                                        className="bg-white border border-[#D8E5D8] rounded-lg p-4 space-y-3 shadow-sm hover:shadow-md transition-shadow"
                                      >
                                        {/* Evidence Title */}
                                        <div className="flex items-center justify-between">
                                          <p className="text-[13px] font-semibold text-[#323130]">
                                            {evidenceSlot.label}
                                          </p>
                                          {showRequired && !hasEvidenceForSlot && (
                                            <span className="text-[11px] text-[#D13438] font-medium">* Required</span>
                                          )}
                                        </div>

                                        {/* Photo Upload Area */}
                                        {!hasEvidenceForSlot ? (
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleCaptureEvidence(question.id, evidenceSlot.id);
                                            }}
                                            className={`w-full h-36 rounded-lg border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2
                                              ${showRequired 
                                                ? 'border-[#D13438] bg-[#FCE5E7] hover:bg-[#FCDADC]' 
                                                : 'border-[#8AC88A] bg-[#FAFAFA] hover:border-[#4CAF50] hover:bg-[#F5F8F5]'
                                              }`}
                                          >
                                            <Camera size={28} className={showRequired ? 'text-[#D13438]' : 'text-[#8AC88A]'} />
                                            <span className={`text-[13px] font-medium ${showRequired ? 'text-[#D13438]' : 'text-[#4CAF50]'}`}>
                                              Capture Photo
                                            </span>
                                          </button>
                                        ) : (
                                          <div className="relative">
                                            <div className="relative rounded-lg overflow-hidden border border-[#D8E5D8]">
                                              <div className="aspect-video bg-[#E8EDE8] flex items-center justify-center">
                                                <div className="text-center">
                                                  <Camera size={32} className="text-[#4CAF50] mx-auto mb-1" />
                                                  <p className="text-[11px] text-[#4CAF50] font-medium">Photo captured</p>
                                                </div>
                                              </div>
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleRemoveEvidence(question.id, evidenceSlot.id);
                                                }}
                                                className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors border border-[#E5E7EB]"
                                                title="Delete photo"
                                              >
                                                <X size={16} className="text-[#D13438]" />
                                              </button>
                                            </div>
                                          </div>
                                        )}

                                        {/* Comment Field for This Evidence */}
                                        {hasEvidenceForSlot && (
                                          <div className="space-y-1.5">
                                            <label className="text-[12px] font-medium text-[#605E5C]">
                                              Comment for this evidence
                                            </label>
                                            <Textarea
                                              placeholder="Add comment for this photo…"
                                              value={evidenceData?.comment || ''}
                                              onChange={(e) => {
                                                e.stopPropagation();
                                                handleEvidenceCommentChange(question.id, evidenceSlot.id, e.target.value);
                                              }}
                                              rows={2}
                                              className="text-[12px] border border-[#C5CBC5] rounded-lg px-2.5 py-2 hover:border-[#4CAF50] focus:border-[#4CAF50] transition-colors resize-none"
                                            />
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Comments Field */}
                            {question.comments && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <h5 className="font-medium text-[#323130] text-sm">{question.comments.label}</h5>
                                  {question.comments.required && (
                                    <span className="text-[11px] text-[#D13438] font-medium">*</span>
                                  )}
                                </div>
                                <Textarea
                                  placeholder="Enter comments…"
                                  value={currentResponse.comments || ''}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    handleCommentsChange(question.id, e.target.value);
                                  }}
                                  rows={4}
                                  className={`shadow-sm rounded-lg px-3 py-2.5 hover:border-[#4CAF50] transition-colors text-sm ${question.comments.required && !currentResponse.comments?.trim() 
                                    ? 'border-2 border-[#D13438] focus:ring-[#D13438]' 
                                    : 'border border-[#E5E7EB] focus:border-[#4CAF50]'
                                  }`}
                                />
                                {question.comments.required && !currentResponse.comments?.trim() && currentResponse.answer && (
                                  <p className="text-[11px] text-[#D13438] mt-1">This field is required.</p>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Divider between questions */}
                          {index < deptQuestions.length - 1 && (
                            <div className="mt-8 pt-0 border-t border-[#E5E7EB]"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[rgba(0,0,0,0.12)] p-4 shadow-lg">
        <div className="flex gap-3 max-w-3xl mx-auto">
          <Button
            variant="secondary"
            onClick={onBack}
            className="flex-1"
          >
            <ChevronLeft size={18} />
            Back
          </Button>
          <Button
            variant="primary"
            onClick={() => onNavigate('review', auditId)}
            disabled={!allAnswered}
            className="flex-1"
          >
            Review Audit
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}

