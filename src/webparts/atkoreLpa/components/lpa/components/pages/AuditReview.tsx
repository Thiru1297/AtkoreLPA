// @ts-nocheck
import { useState } from 'react';
import { AppHeader } from '../AppHeader';
import { Card } from '../Card';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { CheckCircle, XCircle, MinusCircle, Camera, ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useLpaAppContext } from '../../../../context/LpaAppContext';

interface EvidenceSlot {
  id: string;
  label: string;
  captured: boolean;
}

interface QuestionReview {
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

interface AuditReviewProps {
  auditId: string;
  onNavigate: (page: string, auditId?: string) => void;
  onBack: () => void;
  onExit?: () => void;
}

export function AuditReview({ auditId, onNavigate, onBack, onExit }: AuditReviewProps) {
  const { service } = useLpaAppContext();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expandedInstructions, setExpandedInstructions] = useState<Record<number, boolean>>({});

  // Mock data with real LPA question structure
  const results: QuestionReview[] = [
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
  ];

  // Calculate statistics
  const stats = {
    compliant: results.filter(q => q.answer === 'compliant').length,
    nonCompliant: results.filter(q => q.answer === 'non-compliant').length,
    na: results.filter(q => q.answer === 'na').length
  };

  const nonCompliantCount = stats.nonCompliant;

  const handleSubmit = () => {
    setSubmitting(true);
    const auditItemId: number = Number(String(auditId).replace(/[^\d]/g, '')) || 0;
    Promise.resolve()
      .then(() => (auditItemId ? service.submitAudit(auditItemId) : undefined))
      .finally(() => {
        setSubmitting(false);
        setShowConfirmModal(false);
        onNavigate('audit-summary', auditId);
      });
  };

  const toggleInstructions = (questionId: number) => {
    setExpandedInstructions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const getAnswerBadge = (answer: string) => {
    const styles = {
      'compliant': 'bg-[#EEF7EE] text-[#2D5A29] border-[#4CAC48]',
      'non-compliant': 'bg-[#FCE5E7] text-[#D13438] border-[#D13438]',
      'na': 'bg-[#F3F2F1] text-[#605E5C] border-[#605E5C]'
    };

    const labels = {
      'compliant': 'Compliance',
      'non-compliant': 'Non-Compliance',
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

  // Group questions by category
  const categories = Array.from(new Set(results.map(q => q.category)));

  return (
    <div className="min-h-screen bg-[#F5F8F5]">
      <AppHeader 
        title="Review & Submit"
        onExit={onExit}
        actions={
          <button onClick={onBack} className="p-2 hover:bg-[rgba(0,0,0,0.04)] rounded-md transition-colors">
            <ChevronLeft size={20} className="text-[#323130]" />
          </button>
        }
      />

      <div className="p-4 md:p-6 space-y-6 pb-24 max-w-4xl mx-auto">
        {/* Summary Card */}
        <Card>
          <h2 className="mb-6">Audit Summary</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle size={22} className="text-[#4CAC48]" />
                <p className="text-3xl font-medium text-[#323130]">{stats.compliant}</p>
              </div>
              <p className="text-sm text-[#605E5C]">Compliant</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <XCircle size={22} className="text-[#D13438]"/>
                <p className="text-3xl font-medium text-[#323130]">{stats.nonCompliant}</p>
              </div>
              <p className="text-sm text-[#605E5C]">Non-Compliance</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MinusCircle size={22} className="text-[#605E5C]" />
                <p className="text-3xl font-medium text-[#323130]">{stats.na}</p>
              </div>
              <p className="text-sm text-[#605E5C]">N/A</p>
            </div>
          </div>
        </Card>

        {/* Non-Compliances Alert */}
        {nonCompliantCount > 0 && (
          <div className="bg-[#FCE5E7] border border-[#D13438] rounded-lg p-5">
            <h4 className="text-[#D13438] mb-2">Non-Compliances Detected</h4>
            <p className="text-sm text-[#605E5C] leading-relaxed">
              {nonCompliantCount} non-compliant item(s) require attention. 
              Actions will be created for each non-compliance and assigned to department owners.
            </p>
          </div>
        )}

        {/* Questions by Category */}
        <div className="space-y-5">
          <h2 className="pt-2">Questions by Category</h2>
          
          {categories.map(category => {
            const categoryQuestions = results.filter(q => q.category === category);

            return (
              <Card key={category}>
                {/* Category Header */}
                <div className="mb-6 pb-4 border-b border-[rgba(0,0,0,0.08)]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block px-3 py-1.5 rounded-full bg-[#EEF7EE] text-[#2D5A29] font-medium">
                      {category}
                    </span>
                    <span className="text-sm text-[#605E5C]">
                      {categoryQuestions.length} question{categoryQuestions.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                
                {/* Questions */}
                <div className="space-y-6">
                  {categoryQuestions.map((question, index) => (
                    <div 
                      key={question.id}
                      className={`${index < categoryQuestions.length - 1 ? 'pb-6 border-b border-[rgba(0,0,0,0.08)]' : ''}`}
                    >
                      {/* Question Title */}
                      <div className="mb-4">
                        <h3 className="text-[#323130] mb-3">{question.id}. {question.question}</h3>
                      </div>

                      {/* Instructions removed from review page */}
                      {/* <div className="mb-4 bg-[#F3F2F1] rounded-lg p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="font-medium text-[#323130] mb-1">Instructions</p>
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
                      </div> */}

                      {/* Response */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-[#605E5C] mb-2">Response</p>
                        {getAnswerBadge(question.answer)}
                      </div>

                      {/* Evidence */}
                      {question.evidence.length > 0 && question.evidence.some(e => e.captured) && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-[#605E5C] mb-3">Evidence</p>
                          <div className="flex flex-wrap gap-3">
                            {question.evidence.filter(e => e.captured).map(evidence => (
                              <div key={evidence.id} className="w-32">
                                <div className="rounded-lg border-2 border-[#4CAC48] overflow-hidden mb-2 bg-[#E1E1E1]">
                                  <div className="aspect-square flex items-center justify-center">
                                    <Camera size={28} className="text-[#605E5C]" />
                                  </div>
                                </div>
                                <p className="text-xs text-[#605E5C] text-center">{evidence.label}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Comments */}
                      {question.comments && (
                        <div className="bg-[rgba(0,0,0,0.03)] rounded-lg p-4 border-l-4 border-[#4CAC48]">
                          <p className="text-xs font-medium text-[#605E5C] mb-2 uppercase tracking-wide">
                            {question.commentsLabel || 'Comments'}
                          </p>
                          <p className="text-sm text-[#323130] leading-relaxed">{question.comments}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex gap-3 pt-2">
          <Button variant="secondary" onClick={onBack}>
            Back to Questions
          </Button>
          <Button variant="primary" className="flex-1" onClick={() => setShowConfirmModal(true)}>
            Submit Audit
          </Button>
        </div>
      </div>

      {/* Mobile Bottom Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[rgba(0,0,0,0.12)] p-4 shadow-lg">
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button variant="primary" className="flex-1" onClick={() => setShowConfirmModal(true)}>
            Submit Audit
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} title="Submit Audit">
        <div className="space-y-4">
          <p className="text-sm text-[#323130] leading-relaxed">
            Are you sure you want to submit this audit? Once submitted, you will not be able to make changes.
          </p>
          
          {nonCompliantCount > 0 && (
            <div className="bg-[#EEF7EE] rounded-lg p-4 border border-[#4CAC48]">
              <p className="text-sm text-[#2D5A29] leading-relaxed">
                {nonCompliantCount} action(s) will be created for the non-compliances and assigned to the respective department owners.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit} loading={submitting} className="flex-1">
              Confirm Submit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

