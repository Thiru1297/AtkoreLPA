import { useState } from 'react';
import { AppHeader } from '../AppHeader';
import { Tabs } from '../Tabs';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Calendar, MapPin, Building2, Clock, ArrowLeft, AlertCircle, User, Filter, CheckCircle, XCircle, MinusCircle, Search, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../Input";

interface Audit {
  id: string;
  plant: string;
  department: string;
  dueDate: string;
  status: 'pending' | 'accepted' | 'denied' | 'in-progress' | 'submitted';
  isOverdue?: boolean;
  responseSummary?: {
    total: number;
    compliant: number;
    nonCompliant: number;
    na: number;
  };
}

interface Action {
  id: string;
  auditId: string;
  department: string;
  auditorName: string;
  description: string;
  dueDate: string;
  status: 'open' | 'in-progress' | 'overdue' | 'closed';
  priority: 'high' | 'medium' | 'low';
  closureDetails?: {
    closedBy: string;
    closedDate: string;
    workOrderNo: string;
    closureNotes: string;
    closureEvidence?: string[];
  };
}

const mockAudits: Audit[] = [
  {
    id: 'AUD-2025-001',
    plant: 'Plant A',
    department: 'Production Line 1',
    dueDate: '2025-11-28',
    status: 'pending',
    responseSummary: {
      total: 12,
      compliant: 8,
      nonCompliant: 3,
      na: 1,
    },
  },
  {
    id: 'AUD-2025-002',
    plant: 'Plant A',
    department: 'Quality Control',
    dueDate: '2025-11-28',
    status: 'accepted',
  },
  {
    id: 'AUD-2025-004',
    plant: 'Plant A',
    department: 'Maintenance',
    dueDate: '2025-11-30',
    status: 'accepted',
  },
  {
    id: 'AUD-2025-010',
    plant: 'Plant A',
    department: 'Production Line 2',
    dueDate: '2025-11-25',
    status: 'submitted',
    responseSummary: {
      total: 10,
      compliant: 8,
      nonCompliant: 1,
      na: 1,
    },
  },
  {
    id: 'AUD-2025-011',
    plant: 'Plant B',
    department: 'Assembly',
    dueDate: '2025-11-24',
    status: 'submitted',
    responseSummary: {
      total: 15,
      compliant: 12,
      nonCompliant: 2,
      na: 1,
    },
  },
  {
    id: 'AUD-2025-012',
    plant: 'Plant A',
    department: 'Packaging',
    dueDate: '2025-11-23',
    status: 'submitted',
    responseSummary: {
      total: 5,
      compliant: 4,
      nonCompliant: 0,
      na: 1,
    },
  },
];

const mockActions: Action[] = [
  {
    id: 'ACT-2025-045',
    auditId: 'AUD-2025-001',
    department: 'Production Line 1',
    auditorName: 'John Smith',
    description: 'Replace damaged safety guard on Machine #3',
    dueDate: '2025-11-25',
    status: 'overdue',
    priority: 'high',
  },
  {
    id: 'ACT-2025-046',
    auditId: 'AUD-2025-002',
    department: 'Quality Control',
    auditorName: 'Sarah Johnson',
    description: 'Update calibration records for testing equipment',
    dueDate: '2025-11-28',
    status: 'open',
    priority: 'medium',
  },
  {
    id: 'ACT-2025-048',
    auditId: 'AUD-2025-004',
    department: 'Maintenance',
    auditorName: 'Emily Chen',
    description: 'Install missing emergency exit signage',
    dueDate: '2025-12-01',
    status: 'open',
    priority: 'high',
  },
  {
    id: 'ACT-2025-042',
    auditId: 'AUD-2025-001',
    department: 'Production Line 1',
    auditorName: 'John Smith',
    description: 'Update work instructions to current revision',
    dueDate: '2025-11-20',
    status: 'closed',
    priority: 'low',
    closureDetails: {
      closedBy: 'John Smith',
      closedDate: '2025-11-21',
      workOrderNo: 'WO-2025-9876',
      closureNotes: 'Work instructions updated and reviewed by John Smith.',
      closureEvidence: ['photo1.jpg', 'photo2.jpg'],
    },
  },
  {
    id: 'ACT-2025-043',
    auditId: 'AUD-2025-001',
    department: 'Production Line 1',
    auditorName: 'John Smith',
    description: 'Missing PPE signage at workstation',
    dueDate: '2025-11-27',
    status: 'in-progress',
    priority: 'medium',
  },
];

interface AuditorHomeProps {
  onNavigate: (page: string, auditId?: string) => void;
  onExit?: () => void;
}

export function AuditorHome({ onNavigate, onExit }: AuditorHomeProps) {
  const [activeTab, setActiveTab] = useState('today');
  const [actionsTab, setActionsTab] = useState('all');
  const [mainTab, setMainTab] = useState<'audits' | 'actions'>('audits'); // Desktop parent-level tab
  
  // Search States
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [actionSearchQuery, setActionSearchQuery] = useState('');
  
  // Filter State for Actions
  const [filterAudit, setFilterAudit] = useState<string>('all');
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  
  // Filter Dialog for My Audits (mobile)
  const [isAuditFilterDialogOpen, setIsAuditFilterDialogOpen] = useState(false);
  
  // Audit Filter State
  const [auditFilterDateFrom, setAuditFilterDateFrom] = useState<string>('');
  const [auditFilterDateTo, setAuditFilterDateTo] = useState<string>('');
  const [auditFilterStatus, setAuditFilterStatus] = useState<string>('all');

  // Popup State
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const [updateNote, setUpdateNote] = useState('');
  const [newStatus, setNewStatus] = useState<Action['status']>('open');

  // Audit Accept/Deny State
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false);
  const [isDenyDialogOpen, setIsDenyDialogOpen] = useState(false);
  const [denyReason, setDenyReason] = useState('');

  const handleViewDetails = (action: Action) => {
    setSelectedAction(action);
    setIsDetailsOpen(true);
  };

  const handleOpenUpdateStatus = (action: Action) => {
    setSelectedAction(action);
    setNewStatus(action.status);
    setUpdateNote('');
    setIsUpdateStatusOpen(true);
  };

  const handleUpdateStatusSubmit = () => {
    // In a real app, you would update the action via API here
    setIsUpdateStatusOpen(false);
  };

  const handleOpenAcceptDialog = (audit: Audit) => {
    setSelectedAudit(audit);
    setIsAcceptDialogOpen(true);
  };

  const handleOpenDenyDialog = (audit: Audit) => {
    setSelectedAudit(audit);
    setDenyReason('');
    setIsDenyDialogOpen(true);
  };

  const handleAcceptAudit = () => {
    // In a real app, you would accept the audit via API here
    console.log('Accepting audit:', selectedAudit?.id);
    setIsAcceptDialogOpen(false);
    setSelectedAudit(null);
    // Navigate to audit details after accepting
    if (selectedAudit) {
      onNavigate('audit-details', selectedAudit.id);
    }
  };

  const handleDenyAudit = () => {
    if (!denyReason.trim()) {
      return; // Don't submit if reason is empty
    }
    // In a real app, you would deny the audit via API here
    console.log('Denying audit:', selectedAudit?.id, 'Reason:', denyReason);
    setIsDenyDialogOpen(false);
    setSelectedAudit(null);
    setDenyReason('');
  };

  const todayAudits = mockAudits.filter(a => a.dueDate === '2025-11-28' && a.status !== 'submitted');
  const upcomingAudits = mockAudits.filter(a => a.dueDate > '2025-11-28' && a.status !== 'submitted');
  const completedAudits = mockAudits.filter(a => a.status === 'submitted');

  const allActions = mockActions;
  const openActions = mockActions.filter(a => a.status === 'open');
  const overdueActions = mockActions.filter(a => a.status === 'overdue');
  const closedActions = mockActions.filter(a => a.status === 'closed');
  
  // Get unique audit IDs and departments for filters
  const uniqueAudits = Array.from(new Set(mockActions.map(a => a.auditId)));
  const uniqueDepartments = Array.from(new Set(mockActions.map(a => a.department)));
  
  // Get unique values for audit filters
  const uniqueAuditStatuses = Array.from(new Set(mockAudits.map(a => a.status)));
  
  // Clear all action filters
  const handleClearFilters = () => {
    setActionsTab('all');
    setFilterAudit('all');
  };
  
  // Clear all audit filters
  const handleClearAuditFilters = () => {
    setAuditFilterDateFrom('');
    setAuditFilterDateTo('');
    setAuditFilterStatus('all');
  };
  
  // Check if any filters are active
  const hasActiveFilters = actionsTab !== 'all' || filterAudit !== 'all';
  
  // Check if any audit filters are active
  const hasActiveAuditFilters = auditFilterDateFrom !== '' || auditFilterDateTo !== '' || auditFilterStatus !== 'all';
  
  // Filter actions based on tab and filters
  const getFilteredActions = () => {
    let filtered = mockActions;
    
    // Filter by tab
    if (actionsTab === 'open') filtered = filtered.filter(a => a.status === 'open');
    else if (actionsTab === 'overdue') filtered = filtered.filter(a => a.status === 'overdue');
    else if (actionsTab === 'in-progress') filtered = filtered.filter(a => a.status === 'in-progress');
    
    // Filter by audit
    if (filterAudit !== 'all') filtered = filtered.filter(a => a.auditId === filterAudit);
    
    return filtered;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'pending': 'pending',
      'accepted': 'accepted',
      'denied': 'denied',
      'in-progress': 'in-progress',
      'submitted': 'submitted',
    };
    const labels: Record<string, string> = {
      'pending': 'Pending Acceptance',
      'accepted': 'Accepted',
      'denied': 'Denied',
      'in-progress': 'In Progress',
      'submitted': 'Submitted',
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const getActionStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'open': 'open',
      'in-progress': 'in-progress',
      'overdue': 'overdue',
      'closed': 'submitted',
    };
    const labels: Record<string, string> = {
      'open': 'Open',
      'in-progress': 'In Progress',
      'overdue': 'Overdue',
      'closed': 'Closed',
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const renderActionCard = (action: Action) => (
    <Card 
      key={action.id} 
      status={action.status === 'overdue' ? 'Overdue' : undefined}
      onClick={() => handleViewDetails(action)}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h4 className="mb-2">{action.id}</h4>
            <p className="text-sm text-text mb-3">{action.description}</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <User size={14} strokeWidth={1.5} />
                <span>Assigned to: {action.auditorName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Calendar size={14} strokeWidth={1.5} />
                <span>Due: {new Date(action.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <AlertCircle size={14} strokeWidth={1.5} />
                <span>From Audit: {action.auditId}</span>
              </div>
            </div>
          </div>
          {getActionStatusBadge(action.status)}
        </div>
      </div>
    </Card>
  );

  const renderAuditCard = (audit: Audit) => (
    <Card 
      key={audit.id}
      onClick={audit.status === 'submitted' ? () => onNavigate('audit-summary', audit.id) : undefined}
    >
      {/* Response Summary - Only for Submitted Audits - Mobile Only */}
      {audit.status === 'submitted' && audit.responseSummary && (
        <>
          <div className="md:hidden flex flex-wrap items-center gap-2 mb-3 pb-3 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#4CAF50]/10 border border-[#4CAF50]/20">
              <CheckCircle size={14} strokeWidth={2} className="text-[#4CAF50]" />
              <span className="text-xs font-medium text-[#4CAF50]">{audit.responseSummary.compliant}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D32F2F]/10 border border-[#D32F2F]/20">
              <XCircle size={14} strokeWidth={2} className="text-[#D32F2F]" />
              <span className="text-xs font-medium text-[#D32F2F]">{audit.responseSummary.nonCompliant}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#9CA3AF]/10 border border-[#9CA3AF]/20">
              <MinusCircle size={14} strokeWidth={2} className="text-[#9CA3AF]" />
              <span className="text-xs font-medium text-[#9CA3AF]">{audit.responseSummary.na}</span>
            </div>
            <span className="text-xs text-[#605E5C] ml-1">
              {audit.responseSummary.total} questions
            </span>
          </div>
        </>
      )}

      {/* Mobile View - Stacked Layout */}
      <div className="md:hidden space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h4 className="mb-2">{audit.id}</h4>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <MapPin size={14} strokeWidth={1.5} />
                <span>{audit.plant}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Calendar size={14} strokeWidth={1.5} />
                <span>Due: {new Date(audit.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          {getStatusBadge(audit.status)}
        </div>

        {audit.status !== 'submitted' && (
          <div className="flex gap-2 pt-3 border-t border-divider">
            {audit.status === 'pending' && (
              <>
                <Button variant="primary" className="flex-1" onClick={() => handleOpenAcceptDialog(audit)}>
                  Accept
                </Button>
                <Button variant="destructive" className="flex-1" onClick={() => handleOpenDenyDialog(audit)}>
                  Deny
                </Button>
              </>
            )}
            {audit.status === 'accepted' && (
              <>
                <Button variant="primary" className="flex-1" onClick={() => onNavigate('questionnaire', audit.id)}>
                  Start Audit
                </Button>
                <Button variant="tertiary" onClick={() => onNavigate('audit-details', audit.id)}>
                  View Details
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Desktop View - Left Info, Right Buttons */}
      <div className="hidden md:flex md:gap-6">
        {/* Left Column - Audit Information */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h4>{audit.id}</h4>
            {getStatusBadge(audit.status)}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <MapPin size={14} strokeWidth={1.5} />
              <span>{audit.plant}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <Calendar size={14} strokeWidth={1.5} />
                <span>Due: {new Date(audit.dueDate).toLocaleDateString()}</span>
              </div>
              {/* Response Summary - Desktop Only - Right side of Due Date */}
              {audit.status === 'submitted' && audit.responseSummary && (
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#4CAF50]/10 border border-[#4CAF50]/20">
                    <CheckCircle size={14} strokeWidth={2} className="text-[#4CAF50]" />
                    <span className="text-xs font-medium text-[#4CAF50]">{audit.responseSummary.compliant}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D32F2F]/10 border border-[#D32F2F]/20">
                    <XCircle size={14} strokeWidth={2} className="text-[#D32F2F]" />
                    <span className="text-xs font-medium text-[#D32F2F]">{audit.responseSummary.nonCompliant}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#9CA3AF]/10 border border-[#9CA3AF]/20">
                    <MinusCircle size={14} strokeWidth={2} className="text-[#9CA3AF]" />
                    <span className="text-xs font-medium text-[#9CA3AF]">{audit.responseSummary.na}</span>
                  </div>
                  <span className="text-xs text-[#605E5C]">
                    {audit.responseSummary.total} questions
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Action Buttons */}
        {audit.status !== 'submitted' && (
          <div className="flex flex-col gap-2 w-40">
            {audit.status === 'pending' && (
              <>
                <Button variant="primary" className="w-full" onClick={() => handleOpenAcceptDialog(audit)}>
                  Accept
                </Button>
                <Button variant="destructive" className="w-full" onClick={() => handleOpenDenyDialog(audit)}>
                  Deny
                </Button>
              </>
            )}
            {audit.status === 'accepted' && (
              <>
                <Button variant="primary" className="w-full" onClick={() => onNavigate('questionnaire', audit.id)}>
                  Start Audit
                </Button>
                <Button variant="tertiary" className="w-full" onClick={() => onNavigate('audit-details', audit.id)}>
                  View Details
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader 
        title={mainTab === 'audits' ? 'My Audits' : 'My Actions'}
        onExit={onExit} 
        showMenu={true} 
      />

      <div className="space-y-5 md:px-[100px] py-6">
        {/* Desktop: Parent-level Tabs (My Audits | Actions) with Filter */}
        <div className="hidden md:flex md:items-center md:justify-between md:gap-4 px-4">
          <Tabs
            tabs={[
              { id: 'audits', label: 'My Audits' },
              { id: 'actions', label: 'Actions' },
            ]}
            activeTab={mainTab}
            onTabChange={(tab) => setMainTab(tab as 'audits' | 'actions')}
          />
          
          {/* Filter Dropdown - Only show when on Audits tab */}
          {mainTab === 'audits' && (
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-fit min-w-[160px] rounded-full border-[#D1D1D1] bg-white hover:bg-[#F3F2F1] transition-colors">
                <div className="flex items-center gap-2">
                  <Filter size={16} strokeWidth={1.5} className="text-[#605E5C]" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today ({todayAudits.length})</SelectItem>
                <SelectItem value="upcoming">Upcoming ({upcomingAudits.length})</SelectItem>
                <SelectItem value="completed">Completed ({completedAudits.length})</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* Action Filters - Only show when on Actions tab */}
          {mainTab === 'actions' && (
            <div className="flex items-center gap-3">
              <Select value={actionsTab} onValueChange={setActionsTab}>
                <SelectTrigger className="w-fit min-w-[160px] rounded-full border-[#D1D1D1] bg-white hover:bg-[#F3F2F1] transition-colors">
                  <div className="flex items-center gap-2">
                    <Filter size={16} strokeWidth={1.5} className="text-[#605E5C]" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All ({mockActions.length})</SelectItem>
                  <SelectItem value="overdue">Overdue ({mockActions.filter(a => a.status === 'overdue').length})</SelectItem>
                  <SelectItem value="open">Open ({mockActions.filter(a => a.status === 'open').length})</SelectItem>
                  <SelectItem value="in-progress">In Progress ({mockActions.filter(a => a.status === 'in-progress').length})</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterAudit} onValueChange={setFilterAudit}>
                <SelectTrigger className="w-fit min-w-[160px] rounded-full border-[#D1D1D1] bg-white hover:bg-[#F3F2F1] transition-colors">
                  <div className="flex items-center gap-2">
                    <Filter size={16} strokeWidth={1.5} className="text-[#605E5C]" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Audits</SelectItem>
                  {uniqueAudits.map(auditId => (
                    <SelectItem key={auditId} value={auditId}>{auditId}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Clear All Button - Only show when filters are active */}
              {hasActiveFilters && (
                <Button 
                  variant="tertiary" 
                  onClick={handleClearFilters}
                  className="text-xs px-3 py-1 h-auto"
                >
                  Clear All
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Audit List - Show when mainTab is 'audits' */}
        {mainTab === 'audits' && (
          <div className="space-y-3 px-4">
            {/* Mobile Toolbar: Search + Filter Button - Above Tabs */}
            <div className="flex gap-2 w-full md:hidden mb-4">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#605E5C]" />
                <Input 
                  placeholder="Search audits..." 
                  className="pl-10 w-full" 
                  value={auditSearchQuery}
                  onChange={(e) => setAuditSearchQuery(e.target.value)}
                />
              </div>
              <button
                onClick={() => setIsAuditFilterDialogOpen(true)}
                className="relative flex items-center justify-center w-11 h-11 bg-white border border-[rgba(0,0,0,0.12)] rounded text-[#605E5C] hover:bg-gray-50 flex-shrink-0"
              >
                <Filter size={20} />
                {hasActiveAuditFilters && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
                )}
              </button>
            </div>
            
            {/* Mobile Tabs: Today | Upcoming | Completed */}
            <div className="md:hidden">
              <Tabs
                tabs={[
                  { id: 'today', label: 'Today' },
                  { id: 'upcoming', label: 'Upcoming' },
                  { id: 'completed', label: 'Completed' },
                ]}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>

            {activeTab === 'today' && todayAudits.map(renderAuditCard)}
            {activeTab === 'upcoming' && upcomingAudits.map(renderAuditCard)}
            {activeTab === 'completed' && completedAudits.length > 0 && completedAudits.map(renderAuditCard)}
            {activeTab === 'completed' && completedAudits.length === 0 && (
              <Card className="text-center py-12">
                <p className="text-text-muted">No completed audits</p>
              </Card>
            )}
          </div>
        )}

        {/* Actions Content - Show when mainTab is 'actions' */}
        {mainTab === 'actions' && (
          <div className="px-4">
            {/* Mobile Toolbar: Search + Filter Button */}
            <div className="flex gap-2 w-full md:hidden mb-4">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#605E5C]" />
                <Input 
                  placeholder="Search actions..." 
                  className="pl-10 w-full" 
                  value={actionSearchQuery}
                  onChange={(e) => setActionSearchQuery(e.target.value)}
                />
              </div>
              <button
                onClick={() => setIsFilterDialogOpen(true)}
                className="relative flex items-center justify-center w-11 h-11 bg-white border border-[rgba(0,0,0,0.12)] rounded text-[#605E5C] hover:bg-gray-50 flex-shrink-0"
              >
                <Filter size={20} />
                {hasActiveFilters && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
                )}
              </button>
            </div>

            {/* Mobile: Card View */}
            <div className="md:hidden space-y-3">
              {getFilteredActions().map(renderActionCard)}
            </div>
            
            {/* Desktop: Table View */}
            <Card className="overflow-hidden hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-surface border-b border-divider">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-medium text-text-secondary">Action ID</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-text-secondary">Audit</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-text-secondary">Assigned To</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-text-secondary">Due Date</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-text-secondary">Status</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-text-secondary">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredActions().map((action, index) => (
                      <tr 
                        key={action.id} 
                        className="border-b border-divider hover:bg-surface/50 transition-colors cursor-pointer"
                        onClick={() => handleViewDetails(action)}
                      >
                        <td className="px-4 py-3 text-sm font-medium">{action.id}</td>
                        <td className="px-4 py-3 text-sm">{action.auditId}</td>
                        <td className="px-4 py-3 text-sm">{action.auditorName}</td>
                        <td className="px-4 py-3 text-sm">{new Date(action.dueDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-sm">{getActionStatusBadge(action.status)}</td>
                        <td className="px-4 py-3 text-sm">
                          <Badge variant={action.priority === 'high' ? 'destructive' : action.priority === 'medium' ? 'secondary' : 'secondary'}>
                            {action.priority.toUpperCase()}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Mobile Filter Dialog for Actions - Bottom Sheet */}
      {isFilterDialogOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:hidden animate-in fade-in duration-200" onClick={() => setIsFilterDialogOpen(false)}>
          <div className="bg-white w-full rounded-t-2xl space-y-4 animate-in slide-in-from-bottom duration-300 pt-[24px] pr-[24px] pl-[24px] pb-[80px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Filters</h3>
              <button
                onClick={() => setIsFilterDialogOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-[#605E5C]" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#605E5C] mb-1">Status</label>
                <select 
                  className="w-full px-3 py-2 border border-[rgba(0,0,0,0.12)] rounded-lg text-sm"
                  value={actionsTab}
                  onChange={(e) => setActionsTab(e.target.value)}
                >
                  <option value="all">All ({mockActions.length})</option>
                  <option value="overdue">Overdue ({mockActions.filter(a => a.status === 'overdue').length})</option>
                  <option value="open">Open ({mockActions.filter(a => a.status === 'open').length})</option>
                  <option value="in-progress">In Progress ({mockActions.filter(a => a.status === 'in-progress').length})</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-[#605E5C] mb-1">Audit</label>
                <select 
                  className="w-full px-3 py-2 border border-[rgba(0,0,0,0.12)] rounded-lg text-sm"
                  value={filterAudit}
                  onChange={(e) => setFilterAudit(e.target.value)}
                >
                  <option value="all">All Audits</option>
                  {uniqueAudits.map(auditId => (
                    <option key={auditId} value={auditId}>{auditId}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              {hasActiveFilters && (
                <Button variant="tertiary" className="flex-1" onClick={handleClearFilters}>
                  Clear
                </Button>
              )}
              <Button variant="primary" className={hasActiveFilters ? 'flex-1' : 'w-full'} onClick={() => setIsFilterDialogOpen(false)}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Filter Dialog for My Audits - Bottom Sheet */}
      {isAuditFilterDialogOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:hidden animate-in fade-in duration-200" onClick={() => setIsAuditFilterDialogOpen(false)}>
          <div className="bg-white w-full rounded-t-2xl space-y-4 animate-in slide-in-from-bottom duration-300 pt-[24px] pr-[24px] pl-[24px] pb-[80px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Filters</h3>
              <button
                onClick={() => setIsAuditFilterDialogOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-[#605E5C]" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-[#605E5C] mb-1">Date From</label>
                  <Input 
                    type="date" 
                    className="w-full px-3 py-2 border border-[rgba(0,0,0,0.12)] rounded-lg text-sm"
                    value={auditFilterDateFrom}
                    onChange={(e) => setAuditFilterDateFrom(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-[#605E5C] mb-1">Date To</label>
                  <Input 
                    type="date" 
                    className="w-full px-3 py-2 border border-[rgba(0,0,0,0.12)] rounded-lg text-sm"
                    value={auditFilterDateTo}
                    onChange={(e) => setAuditFilterDateTo(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-[#605E5C] mb-1">Status</label>
                  <select 
                    className="w-full px-3 py-2 border border-[rgba(0,0,0,0.12)] rounded-lg text-sm"
                    value={auditFilterStatus}
                    onChange={(e) => setAuditFilterStatus(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="submitted">Submitted</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button variant="tertiary" className="w-full" onClick={handleClearAuditFilters}>
                Clear All
              </Button>
              <Button variant="primary" className="w-full" onClick={() => setIsAuditFilterDialogOpen(false)}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-divider z-50 pb-safe safe-area-bottom">
        <div className="flex h-16">
          <button 
            onClick={() => setMainTab('audits')}
            className={`relative flex-1 flex flex-col items-center justify-center h-full gap-1 active:bg-surface transition-colors ${
              mainTab === 'audits' ? 'text-primary' : 'text-text-secondary'
            }`}
          >
            <Clock size={24} strokeWidth={1.5} />
            <span className="text-[10px] font-medium leading-none">Audits</span>
          </button>
          <button 
            onClick={() => setMainTab('actions')}
            className={`relative flex-1 flex flex-col items-center justify-center h-full gap-1 active:bg-surface transition-colors ${
              mainTab === 'actions' ? 'text-primary' : 'text-text-secondary'
            }`}
          >
            <AlertCircle size={24} strokeWidth={1.5} />
            <span className="text-[10px] font-medium leading-none">Actions</span>
          </button>
        </div>
      </div>

      {/* Accept Audit Dialog */}
      <Dialog open={isAcceptDialogOpen} onOpenChange={setIsAcceptDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept Audit</DialogTitle>
            <DialogDescription>Are you sure you want to accept this audit?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="tertiary" onClick={() => setIsAcceptDialogOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAcceptAudit}>Accept</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deny Audit Dialog */}
      <Dialog open={isDenyDialogOpen} onOpenChange={setIsDenyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deny Audit</DialogTitle>
            <DialogDescription>Please provide a reason for denying this audit assignment.</DialogDescription>
          </DialogHeader>
          {selectedAudit && (
            <div className="space-y-4 py-4">
              <div className="bg-surface p-4 rounded-lg border border-border">
                <p className="text-sm"><strong>Audit ID:</strong> {selectedAudit.id}</p>
                <p className="text-sm"><strong>Due Date:</strong> {new Date(selectedAudit.dueDate).toLocaleDateString()}</p>
              </div>
              <div className="space-y-2">
                <Label>Reason for Denial <span className="text-destructive">*</span></Label>
                <Textarea 
                  placeholder="Enter reason for denial..." 
                  value={denyReason}
                  onChange={(e) => setDenyReason(e.target.value)}
                  className={!denyReason.trim() && denyReason !== '' ? 'border-destructive' : ''}
                />
                {!denyReason.trim() && denyReason !== '' && (
                  <p className="text-xs text-destructive">Reason is required</p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="tertiary" onClick={() => { setIsDenyDialogOpen(false); setDenyReason(''); }}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleDenyAudit}
              disabled={!denyReason.trim()}
            >
              Deny Audit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Action Details</DialogTitle>
            
          </DialogHeader>
          {selectedAction && (
            <div className="space-y-4 mt-[-15px] mr-[0px] mb-[0px] ml-[0px]">
              {/* Action Summary */}
              <div className="bg-surface p-4 rounded-lg border border-border">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-text-secondary mb-1">Action ID</p>
                    <p className="text-sm font-medium">{selectedAction.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary mb-1">Status</p>
                    {getActionStatusBadge(selectedAction.status)}
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary mb-1">Priority</p>
                    <Badge variant={selectedAction.priority === 'high' ? 'destructive' : 'secondary'}>
                      {selectedAction.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary mb-1">Assigned To</p>
                    <p className="text-sm">{selectedAction.auditorName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary mb-1">Due Date</p>
                    <p className="text-sm">{new Date(selectedAction.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary mb-1">Audit ID</p>
                    <p 
                      className="text-sm text-primary underline hover:no-underline cursor-pointer font-medium bg-primary/5 px-2 py-1 rounded w-fit" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('audit-summary', selectedAction.auditId);
                      }}
                    >
                      {selectedAction.auditId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label className="mb-2 block">Description</Label>
                <div className="bg-surface p-4 rounded-lg border border-border">
                  <p className="text-sm">{selectedAction.description}</p>
                </div>
              </div>

              {/* Original Non-Conformance */}
              <div>
                <Label className="mb-2 block">Original Non-Conformance</Label>
                <div className="bg-surface p-4 rounded-lg border border-border space-y-3">
                  <div>
                    <p className="text-xs text-text-secondary mb-1">Question</p>
                    <p className="text-sm">Are all safety guards in place and properly secured on machinery?</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary mb-1">Auditor Response</p>
                    <Badge variant="destructive">Non-Conforming</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary mb-1">Auditor Notes</p>
                    <p className="text-sm">Safety guard on Machine #3 is damaged and not properly secured. Immediate attention required.</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary mb-1">Evidence</p>
                    <div className="flex gap-2">
                      <div className="w-20 h-20 bg-gray-200 rounded border border-border flex items-center justify-center">
                        <span className="text-xs text-text-secondary">Photo 1</span>
                      </div>
                      <div className="w-20 h-20 bg-gray-200 rounded border border-border flex items-center justify-center">
                        <span className="text-xs text-text-secondary">Photo 2</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Closure Details - Only shown for closed actions */}
              {selectedAction.status === 'closed' && selectedAction.closureDetails && (
                <div>
                  <Label className="mb-2 block">Closure Details</Label>
                  <div className="bg-[#E8F5E9] p-4 rounded-lg border border-[#4CAF50]/20 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-text-secondary mb-1">Closed By</p>
                        <p className="text-sm font-medium">{selectedAction.closureDetails.closedBy}</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-secondary mb-1">Closed Date</p>
                        <p className="text-sm">{new Date(selectedAction.closureDetails.closedDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary mb-1">Work Order Number</p>
                      <p className="text-sm font-medium">{selectedAction.closureDetails.workOrderNo}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary mb-1">Closure Notes</p>
                      <p className="text-sm">{selectedAction.closureDetails.closureNotes}</p>
                    </div>
                    {selectedAction.closureDetails.closureEvidence && selectedAction.closureDetails.closureEvidence.length > 0 && (
                      <div>
                        <p className="text-xs text-text-secondary mb-1">Closure Evidence</p>
                        <div className="flex gap-2 flex-wrap">
                          {selectedAction.closureDetails.closureEvidence.map((evidence, index) => (
                            <div key={index} className="w-20 h-20 bg-gray-200 rounded border border-border flex items-center justify-center">
                              <span className="text-xs text-text-secondary">Photo {index + 1}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Other Actions From This Audit */}
              {(() => {
                const otherActions = mockActions.filter(a => a.auditId === selectedAction.auditId && a.id !== selectedAction.id);
                const ncCount = mockActions.filter(a => a.auditId === selectedAction.auditId).length;
                
                // Get audit response summary
                const auditSummary = mockAudits.find(a => a.id === selectedAction.auditId)?.responseSummary || {
                  conforming: 8,
                  nonConforming: ncCount,
                  na: 1,
                };
                
                if (otherActions.length > 0) {
                  return (
                    <div>
                      <Label className="mb-2 block">Other Actions From This Audit</Label>
                      <div className="bg-[#F3F2F1] p-4 rounded-lg border border-[rgba(0,0,0,0.08)] mb-3">
                        <div className="grid grid-cols-3 gap-4">
                          {/* Conforming */}
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-1.5">
                              <CheckCircle size={16} strokeWidth={2} className="text-[#4CAF50]" />
                              <span className="text-xs text-[#605E5C]">Compliant</span>
                            </div>
                            <span className="text-2xl font-semibold text-[#4CAF50]">{auditSummary.conforming}</span>
                          </div>
                          
                          {/* Non-Conforming */}
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-1.5">
                              <XCircle size={16} strokeWidth={2} className="text-[#D32F2F]" />
                              <span className="text-xs text-[#605E5C]">NC</span>
                            </div>
                            <span className="text-2xl font-semibold text-[#D32F2F]">{auditSummary.nonConforming}</span>
                          </div>
                          
                          {/* N/A */}
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-1.5">
                              <MinusCircle size={16} strokeWidth={2} className="text-[#9CA3AF]" />
                              <span className="text-xs text-[#605E5C]">N/A</span>
                            </div>
                            <span className="text-2xl font-semibold text-[#9CA3AF]">{auditSummary.na}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {otherActions.map((action) => (
                          <div 
                            key={action.id}
                            className="bg-white p-3 rounded-lg border border-border hover:bg-surface/50 transition-colors cursor-pointer"
                            onClick={() => {
                              setSelectedAction(action);
                            }}
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <p className="text-sm font-medium">{action.id}</p>
                              {getActionStatusBadge(action.status)}
                            </div>
                            <p className="text-xs text-text-secondary mb-2">{action.description}</p>
                            <div className="flex items-center justify-between text-xs text-text-secondary">
                              <span>Due: {new Date(action.dueDate).toLocaleDateString()}</span>
                              <Badge variant={action.priority === 'high' ? 'destructive' : 'secondary'} className="text-[10px] px-1.5 py-0.5">
                                {action.priority.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          )}
          <DialogFooter>
            <Button variant="tertiary" onClick={() => setIsDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isUpdateStatusOpen} onOpenChange={setIsUpdateStatusOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Action Status</DialogTitle>
            <DialogDescription>Update the status and add notes for this action</DialogDescription>
          </DialogHeader>
          {selectedAction && (
            <div className="space-y-4 py-4">
              <div className="bg-surface p-4 rounded-lg border border-border">
                <p className="text-sm"><strong>Action ID:</strong> {selectedAction.id}</p>
                <p className="text-sm"><strong>Description:</strong> {selectedAction.description}</p>
              </div>
              
              <div className="space-y-2">
                <Label>New Status</Label>
                <Select value={newStatus} onValueChange={(value) => setNewStatus(value as Action['status'])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Update Notes</Label>
                <Textarea 
                  placeholder="Add notes about this status update..." 
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="tertiary" onClick={() => setIsUpdateStatusOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleUpdateStatusSubmit}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}