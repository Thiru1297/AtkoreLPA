import { AppHeader } from '../AppHeader';
import { Card, KPICard } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Input, Select } from '../Input';
import { Tabs } from '../Tabs';
import { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from 'recharts';
import { TrendingDown, TrendingUp, Filter, Download, Search, X, LayoutGrid, FileText, Building2, Calendar } from 'lucide-react';

interface PlantManagerDashboardProps {
  onNavigate: (page: string, params?: any) => void;
  onExit?: () => void;
}

export function PlantManagerDashboard({ onNavigate, onExit }: PlantManagerDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFilters, setSelectedFilters] = useState({
    dateRange: '30days',
    status: 'all',
    auditor: 'all',
    department: 'all'
  });
  const [showActionFilterPopup, setShowActionFilterPopup] = useState(false);
  const [selectedActionFilters, setSelectedActionFilters] = useState({
    status: 'all',
    priority: 'all',
    department: 'all'
  });
  const [showAuditFilterPopup, setShowAuditFilterPopup] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState(null);

  // Check if any action filters are active
  const hasActiveActionFilters = 
    selectedActionFilters.status !== 'all' || 
    selectedActionFilters.priority !== 'all' ||
    selectedActionFilters.department !== 'all';

  // Check if any audit filters are active
  const hasActiveAuditFilters = 
    selectedFilters.dateRange !== '30days' ||
    selectedFilters.status !== 'all' ||
    selectedFilters.auditor !== 'all' ||
    selectedFilters.department !== 'all';

  const ncByDepartment = [
    { name: 'Prod Line 1', count: 5 },
    { name: 'Prod Line 2', count: 3 },
    { name: 'Quality', count: 2 },
    { name: 'Warehouse', count: 4 },
    { name: 'Maintenance', count: 1 },
  ];

  const trendData = [
    { month: 'Jun', audits: 24, ncs: 8 },
    { month: 'Jul', audits: 26, ncs: 12 },
    { month: 'Aug', audits: 28, ncs: 10 },
    { month: 'Sep', audits: 25, ncs: 7 },
    { month: 'Oct', audits: 30, ncs: 9 },
    { month: 'Nov', audits: 22, ncs: 6 },
  ];

  const recentAudits = [
    { id: 'AUD-2025-012', department: 'Production Line 1', layer: 'Layer 3', date: '2025-11-27', result: 'Pass', ncCount: 0, compliantCount: 12, naCount: 3, auditor: 'John Smith' },
    { id: 'AUD-2025-011', department: 'Quality Control', layer: 'Layer 2', date: '2025-11-26', result: 'Fail', ncCount: 2, compliantCount: 8, naCount: 1, auditor: 'Sarah Johnson' },
    { id: 'AUD-2025-010', department: 'Warehouse', layer: 'Layer 1', date: '2025-11-25', result: 'Pass', ncCount: 0, compliantCount: 15, naCount: 0, auditor: 'Mike Davis' },
    { id: 'AUD-2025-009', department: 'Production Line 2', layer: 'Layer 3', date: '2025-11-24', result: 'Fail', ncCount: 1, compliantCount: 10, naCount: 4, auditor: 'John Smith' },
  ];

  const allAudits = [
    { id: 'AUD-2025-012', department: 'Production Line 1', layer: 'Layer 3', date: '2025-11-27', result: 'Pass', ncCount: 0, compliantCount: 12, naCount: 3, auditor: 'John Smith', status: 'Completed' },
    { id: 'AUD-2025-011', department: 'Quality Control', layer: 'Layer 2', date: '2025-11-26', result: 'Fail', ncCount: 2, compliantCount: 8, naCount: 1, auditor: 'Sarah Johnson', status: 'Submitted' },
    { id: 'AUD-2025-010', department: 'Warehouse', layer: 'Layer 1', date: '2025-11-25', result: 'Pass', ncCount: 0, compliantCount: 15, naCount: 0, auditor: 'Mike Davis', status: 'Completed' },
    { id: 'AUD-2025-009', department: 'Production Line 2', layer: 'Layer 3', date: '2025-11-24', result: 'Fail', ncCount: 1, compliantCount: 10, naCount: 4, auditor: 'John Smith', status: 'In Progress' },
    { id: 'AUD-2025-008', department: 'Production Line 1', layer: 'Layer 2', date: '2025-11-23', result: 'Pass', ncCount: 0, compliantCount: 14, naCount: 2, auditor: 'Sarah Johnson', status: 'Completed' },
    { id: 'AUD-2025-007', department: 'Maintenance', layer: 'Layer 1', date: '2025-11-22', result: 'Pass', ncCount: 0, compliantCount: 8, naCount: 5, auditor: 'Mike Davis', status: 'Completed' },
    { id: 'AUD-2025-006', department: 'Quality Control', layer: 'Layer 3', date: '2025-11-21', result: 'Fail', ncCount: 3, compliantCount: 7, naCount: 1, auditor: 'John Smith', status: 'In Progress' },
    { id: 'AUD-2025-005', department: 'Production Line 2', layer: 'Layer 2', date: '2025-11-20', result: 'Pass', ncCount: 0, compliantCount: 11, naCount: 2, auditor: 'Sarah Johnson', status: 'Completed' },
    { id: 'AUD-2025-004', department: 'Warehouse', layer: 'Layer 1', date: '2025-11-19', result: 'Pass', ncCount: 0, compliantCount: 13, naCount: 0, auditor: 'Mike Davis', status: 'Completed' },
    { id: 'AUD-2025-003', department: 'Production Line 1', layer: 'Layer 3', date: '2025-11-18', result: 'Fail', ncCount: 1, compliantCount: 9, naCount: 3, auditor: 'John Smith', status: 'In Progress' },
    { id: 'AUD-2025-002', department: 'Quality Control', layer: 'Layer 2', date: '2025-11-17', result: 'Pass', ncCount: 0, compliantCount: 10, naCount: 2, auditor: 'Sarah Johnson', status: 'Completed' },
    { id: 'AUD-2025-001', department: 'Maintenance', layer: 'Layer 1', date: '2025-11-16', result: 'Pass', ncCount: 0, compliantCount: 6, naCount: 4, auditor: 'Mike Davis', status: 'Completed' },
  ];

  const allActions = [
    { id: 'ACT-2025-001', title: 'Fix safety guard', department: 'Production Line 1', assignee: 'Mike Ross', dueDate: '2025-12-01', status: 'Open', priority: 'High' },
    { id: 'ACT-2025-002', title: 'Update work instructions', department: 'Quality Control', assignee: 'Sarah Johnson', dueDate: '2025-11-30', status: 'Overdue', priority: 'Medium' },
    { id: 'ACT-2025-003', title: 'Replace worn labels', department: 'Warehouse', assignee: 'Jane Smith', dueDate: '2025-12-05', status: 'In Progress', priority: 'Low' },
    { id: 'ACT-2025-004', title: 'Calibrate scale #4', department: 'Production Line 2', assignee: 'John Doe', dueDate: '2025-12-10', status: 'Open', priority: 'High' },
    { id: 'ACT-2025-005', title: 'Clean sensor array', department: 'Maintenance', assignee: 'Mike Davis', dueDate: '2025-11-28', status: 'Closed', priority: 'Medium' },
    { id: 'ACT-2025-006', title: 'Check fire extinguishers', department: 'Safety', assignee: 'Robert Wilson', dueDate: '2025-12-15', status: 'Open', priority: 'High' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <AppHeader 
        title="Plant Dashboard"
        onExit={onExit}
      />

      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="hidden md:block">
          <Tabs
            tabs={[
              { id: 'overview', label: 'Overview' },
              { id: 'audits', label: 'Audits' },
              { id: 'actions', label: 'Actions' },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {activeTab === 'overview' && (
          <>
            {/* KPI Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KPICard 
                label="Completed Audits" 
                value="86" 
                trend="+8% this month" 
              />
              <KPICard 
                label="NC Rate" 
                value="2.4%" 
                trend="-0.8% improvement" 
              />
              <KPICard 
                label="Open Actions" 
                value="23" 
              />
              <KPICard 
                label="Overdue Actions" 
                value="4" 
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* NC by Department */}
              <Card>
                <div className="flex items-center justify-between mb-5">
                  <h3>NCs by Department (Quality, Safety, Production)</h3>
                  <TrendingDown size={20} strokeWidth={1.5} className="text-primary" />
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ncByDepartment} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis type="number" tick={{ fontSize: 12, fill: '#616161' }} stroke="#8A8A8A" />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#616161' }} stroke="#8A8A8A" width={100} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 8px rgba(0,0,0,0.07)' }} />
                    <Bar dataKey="count" fill="#4CAC48" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Trend Over Time */}
              <Card>
                <div className="flex items-center justify-between mb-5">
                  <h3>Audit & NC Trends</h3>
                  <TrendingUp size={20} strokeWidth={1.5} className="text-primary" />
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#616161' }} stroke="#8A8A8A" />
                    <YAxis tick={{ fontSize: 12, fill: '#616161' }} stroke="#8A8A8A" />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 8px rgba(0,0,0,0.07)' }} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line type="monotone" dataKey="audits" stroke="#4CAC48" strokeWidth={2.5} name="Audits" dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="ncs" stroke="#D13438" strokeWidth={2.5} name="NCs" dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Recent Audits Table */}
            <div className="md:bg-white md:rounded-lg md:p-5 md:border md:border-border">
              <div className="flex items-center justify-between mb-5">
                <h3>Recent Audits</h3>
                <Button variant="tertiary" onClick={() => setActiveTab('audits')}>
                  View All
                </Button>
              </div>

              {/* Mobile: Card View */}
              <div className="space-y-3 md:hidden">
                {recentAudits.map((audit) => (
                  <div 
                    key={audit.id} 
                    className="p-4 border border-border rounded-lg cursor-pointer hover:bg-surface active:bg-surface transition-colors bg-white"
                    onClick={() => onNavigate('audit-detail', { auditId: audit.id })}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4>{audit.id}</h4>
                    </div>
                    <p className="text-sm text-text-secondary mb-1.5">{audit.department} • {audit.layer}</p>
                    <div className="flex items-center justify-between text-xs text-text-muted">
                      <span>{new Date(audit.date).toLocaleDateString()}</span>
                      <span>{audit.ncCount} NC{audit.ncCount !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop: Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-divider">
                      <th className="text-left py-3 px-2 text-xs font-medium text-text-secondary">Audit ID</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-text-secondary">Department</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-text-secondary">Layer</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-text-secondary">Date</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-text-secondary">Conforming</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-text-secondary">NC Count</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-text-secondary">N/A Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAudits.map((audit) => (
                      <tr 
                        key={audit.id} 
                        className="border-b border-divider hover:bg-surface cursor-pointer transition-colors"
                        onClick={() => onNavigate('audit-detail', { auditId: audit.id })}
                      >
                        <td className="py-3.5 px-2 text-sm font-medium">{audit.id}</td>
                        <td className="py-3.5 px-2 text-sm">{audit.department}</td>
                        <td className="py-3.5 px-2 text-sm text-text-secondary">{audit.layer}</td>
                        <td className="py-3.5 px-2 text-sm text-text-secondary">
                          {new Date(audit.date).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-2 text-sm text-primary">{audit.compliantCount}</td>
                        <td className="py-3.5 px-2 text-sm text-destructive">{audit.ncCount}</td>
                        <td className="py-3.5 px-2 text-sm text-text-secondary">{audit.naCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'audits' && (
          <>
            {/* Audit Filter Popup */}
            {showAuditFilterPopup && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:hidden animate-in fade-in duration-200">
                <div className="bg-white w-full rounded-t-2xl space-y-4 animate-in slide-in-from-bottom duration-300 pt-[24px] pr-[24px] pb-[50px] pl-[24px]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">Filters</h3>
                    <button
                      onClick={() => setShowAuditFilterPopup(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X size={20} className="text-[#605E5C]" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-[#605E5C] mb-1">Date Range</label>
                      <select 
                        className="w-full px-3 py-2 border border-[rgba(0,0,0,0.12)] rounded-lg text-sm"
                        value={selectedFilters.dateRange}
                        onChange={(e) => setSelectedFilters({...selectedFilters, dateRange: e.target.value})}
                      >
                        <option value="7days">Last 7 days</option>
                        <option value="30days">Last 30 days</option>
                        <option value="90days">Last 90 days</option>
                        <option value="all">All time</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-[#605E5C] mb-1">Status</label>
                      <select 
                        className="w-full px-3 py-2 border border-[rgba(0,0,0,0.12)] rounded-lg text-sm"
                        value={selectedFilters.status}
                        onChange={(e) => setSelectedFilters({...selectedFilters, status: e.target.value})}
                      >
                        <option value="all">All Statuses</option>
                        <option value="completed">Completed</option>
                        <option value="submitted">Submitted</option>
                        <option value="in-progress">In Progress</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-[#605E5C] mb-1">Auditor</label>
                      <select 
                        className="w-full px-3 py-2 border border-[rgba(0,0,0,0.12)] rounded-lg text-sm"
                        value={selectedFilters.auditor}
                        onChange={(e) => setSelectedFilters({...selectedFilters, auditor: e.target.value})}
                      >
                        <option value="all">All Auditors</option>
                        <option value="john-smith">John Smith</option>
                        <option value="sarah-johnson">Sarah Johnson</option>
                        <option value="mike-davis">Mike Davis</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-[#605E5C] mb-1">Department</label>
                      <select 
                        className="w-full px-3 py-2 border border-[rgba(0,0,0,0.12)] rounded-lg text-sm"
                        value={selectedFilters.department}
                        onChange={(e) => setSelectedFilters({...selectedFilters, department: e.target.value})}
                      >
                        <option value="all">All Departments</option>
                        <option value="production-line-1">Production Line 1</option>
                        <option value="production-line-2">Production Line 2</option>
                        <option value="quality-control">Quality Control</option>
                        <option value="warehouse">Warehouse</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button variant="tertiary" className="flex-1" onClick={() => setShowAuditFilterPopup(false)}>
                      Clear
                    </Button>
                    <Button variant="primary" className="flex-1" onClick={() => setShowAuditFilterPopup(false)}>
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Toolbar */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex gap-2 w-full md:w-auto md:flex-1">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#605E5C]" />
                    <Input placeholder="Search audits..." className="pl-10 w-full" />
                  </div>
                  <button
                    onClick={() => setShowAuditFilterPopup(true)}
                    className="relative md:hidden flex items-center justify-center w-11 h-11 bg-white border border-[rgba(0,0,0,0.12)] rounded text-[#605E5C] hover:bg-gray-50 flex-shrink-0"
                  >
                    <Filter size={20} />
                    {hasActiveAuditFilters && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
                    )}
                  </button>
                </div>
                
                {/* Desktop Actions */}
                <div className="hidden md:flex gap-2">
                  <Select 
                    value={selectedFilters.status}
                    onChange={(e) => setSelectedFilters({...selectedFilters, status: e.target.value})}
                    className="h-11"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="submitted">Submitted</option>
                    <option value="in-progress">In Progress</option>
                  </Select>
                  <Select 
                    value={selectedFilters.department}
                    onChange={(e) => setSelectedFilters({...selectedFilters, department: e.target.value})}
                    className="h-11"
                  >
                    <option value="all">All Departments</option>
                    <option value="production-line-1">Production Line 1</option>
                    <option value="production-line-2">Production Line 2</option>
                    <option value="quality-control">Quality Control</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="maintenance">Maintenance</option>
                  </Select>
                  <Select 
                    value={selectedFilters.auditor}
                    onChange={(e) => setSelectedFilters({...selectedFilters, auditor: e.target.value})}
                    className="h-11"
                  >
                    <option value="all">All Auditors</option>
                    <option value="john-smith">John Smith</option>
                    <option value="sarah-johnson">Sarah Johnson</option>
                    <option value="mike-davis">Mike Davis</option>
                  </Select>
                  {(selectedFilters.status !== 'all' || selectedFilters.department !== 'all' || selectedFilters.auditor !== 'all') && (
                    <Button 
                      variant="tertiary" 
                      onClick={() => setSelectedFilters({...selectedFilters, status: 'all', department: 'all', auditor: 'all'})}
                    >
                      Clear All
                    </Button>
                  )}
                  <Button variant="secondary">
                     <Download size={16} className="mr-2"/> Export
                  </Button>
                </div>
              </div>

              {/* All Audits Table */}
              <div className="md:bg-white md:rounded-lg md:p-4 md:border md:border-[rgba(0,0,0,0.12)]">
              <div className="flex items-center justify-between mb-4">
                <h3>Audit History</h3>
                <span className="text-sm text-[#605E5C]">
                  {allAudits.filter(audit => audit.status !== 'Not Started' && audit.status !== 'Denied').length} audits
                </span>
              </div>

              {/* Mobile: Card View */}
              <div className="space-y-3 md:hidden">
                {allAudits
                  .filter(audit => audit.status !== 'Not Started' && audit.status !== 'Denied')
                  .map((audit) => (
                  <div 
                    key={audit.id} 
                    className="p-4 border border-[rgba(0,0,0,0.12)] rounded-lg cursor-pointer hover:bg-gray-50 active:bg-gray-100 bg-white"
                    onClick={() => onNavigate('audit-detail', { auditId: audit.id })}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="mb-1">{audit.id}</h3>
                        <Badge variant={audit.status === 'Completed' ? 'completed' : audit.status === 'Submitted' ? 'submitted' : 'in-progress'}>
                          {audit.status}
                        </Badge>
                      </div>
                      {audit.ncCount > 0 && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-[#FCE5E7] text-[#D13438] rounded">
                          <X size={14} />
                          <span className="text-xs font-medium">{audit.ncCount} NC</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar size={14} className="text-[#605E5C]" />
                        <span className="text-[#605E5C]">Date:</span>
                        <span className="text-[#1B1B1B]">{new Date(audit.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-[#605E5C]">Auditor:</span>
                        <span className="text-[#1B1B1B]">{audit.auditor}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop: Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[rgba(0,0,0,0.12)]">
                      <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Audit ID</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Auditor</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Date</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Compliant</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Non-Compliant</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">N/A</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allAudits
                      .filter(audit => audit.status !== 'Not Started' && audit.status !== 'Denied')
                      .map((audit) => (
                      <tr 
                        key={audit.id} 
                        className="border-b border-[rgba(0,0,0,0.12)] hover:bg-gray-50 cursor-pointer"
                        onClick={() => onNavigate('audit-detail', { auditId: audit.id })}
                      >
                        <td className="py-3 px-2 text-sm font-medium">{audit.id}</td>
                        <td className="py-3 px-2 text-sm text-[#605E5C]">{audit.auditor}</td>
                        <td className="py-3 px-2 text-sm text-[#605E5C]">
                          {new Date(audit.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-2 text-sm text-[#4CAC48]">{audit.compliantCount}</td>
                        <td className="py-3 px-2 text-sm text-[#D13438]">{audit.ncCount}</td>
                        <td className="py-3 px-2 text-sm text-[#605E5C]">{audit.naCount}</td>
                        <td className="py-3 px-2">
                          <Badge variant={audit.status === 'Completed' ? 'completed' : audit.status === 'Submitted' ? 'submitted' : 'in-progress'}>
                            {audit.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            </div>
          </>
        )}

        {activeTab === 'actions' && (
          <>
            {/* Mobile Filter Popup */}
            {showActionFilterPopup && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:hidden animate-in fade-in duration-200">
                <div className="bg-white w-full rounded-t-2xl space-y-4 animate-in slide-in-from-bottom duration-300 pt-[24px] pr-[24px] pb-[55px] pl-[24px]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">Filters</h3>
                    <button
                      onClick={() => setShowActionFilterPopup(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X size={20} className="text-[#605E5C]" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-[#605E5C] mb-1">Status</label>
                      <Select 
                        value={selectedActionFilters.status}
                        onChange={(e) => setSelectedActionFilters({...selectedActionFilters, status: e.target.value})}
                      >
                        <option value="all">All Statuses</option>
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="overdue">Overdue</option>
                        <option value="closed">Closed</option>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-[#605E5C] mb-1">Priority</label>
                      <Select 
                        value={selectedActionFilters.priority}
                        onChange={(e) => setSelectedActionFilters({...selectedActionFilters, priority: e.target.value})}
                      >
                        <option value="all">All Priorities</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-[#605E5C] mb-1">Department</label>
                      <Select 
                        value={selectedActionFilters.department}
                        onChange={(e) => setSelectedActionFilters({...selectedActionFilters, department: e.target.value})}
                      >
                        <option value="all">All Departments</option>
                        <option value="production-line-1">Production Line 1</option>
                        <option value="production-line-2">Production Line 2</option>
                        <option value="quality-control">Quality Control</option>
                        <option value="warehouse">Warehouse</option>
                        <option value="maintenance">Maintenance</option>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button variant="tertiary" className="flex-1" onClick={() => setShowActionFilterPopup(false)}>
                      Clear
                    </Button>
                    <Button variant="primary" className="flex-1" onClick={() => setShowActionFilterPopup(false)}>
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Toolbar */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex gap-2 w-full md:w-auto md:flex-1">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#605E5C]" />
                    <Input placeholder="Search actions..." className="pl-10 w-full" />
                  </div>
                  <button
                    onClick={() => setShowActionFilterPopup(true)}
                    className="relative md:hidden flex items-center justify-center w-11 h-11 bg-white border border-[rgba(0,0,0,0.12)] rounded text-[#605E5C] hover:bg-gray-50 flex-shrink-0"
                  >
                    <Filter size={20} />
                    {hasActiveActionFilters && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
                    )}
                  </button>
                </div>
                
                {/* Desktop Actions */}
                <div className="hidden md:flex gap-2">
                  <Select 
                    value={selectedActionFilters.status}
                    onChange={(e) => setSelectedActionFilters({...selectedActionFilters, status: e.target.value})}
                    className="h-11"
                  >
                    <option value="all">All Status</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="overdue">Overdue</option>
                    <option value="closed">Closed</option>
                  </Select>
                  <Select 
                    value={selectedActionFilters.priority}
                    onChange={(e) => setSelectedActionFilters({...selectedActionFilters, priority: e.target.value})}
                    className="h-11"
                  >
                    <option value="all">All Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </Select>
                  <Select 
                    value={selectedActionFilters.department}
                    onChange={(e) => setSelectedActionFilters({...selectedActionFilters, department: e.target.value})}
                    className="h-11"
                  >
                    <option value="all">All Departments</option>
                    <option value="production-line-1">Production Line 1</option>
                    <option value="production-line-2">Production Line 2</option>
                    <option value="quality-control">Quality Control</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="maintenance">Maintenance</option>
                  </Select>
                  {(selectedActionFilters.status !== 'all' || selectedActionFilters.priority !== 'all' || selectedActionFilters.department !== 'all') && (
                    <Button 
                      variant="tertiary" 
                      onClick={() => setSelectedActionFilters({status: 'all', priority: 'all', department: 'all'})}
                    >
                      Clear All
                    </Button>
                  )}
                  <Button variant="secondary">
                     <Download size={16} className="mr-2"/> Export
                  </Button>
                </div>
              </div>

              <div className="md:bg-white md:rounded-lg md:p-4 md:border md:border-[rgba(0,0,0,0.12)]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">All Actions</h3>
                  <span className="text-sm text-[#605E5C]">{allActions.length} actions</span>
                </div>

              {/* Mobile: Card View */}
              <div className="space-y-3 md:hidden">
                {allActions.map((action) => (
                  <div 
                    key={action.id} 
                    className="p-4 border border-[rgba(0,0,0,0.12)] rounded-lg bg-white cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors mb-3"
                    onClick={() => onNavigate('plant-manager-action-details', { actionId: action.id })}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="mb-2">{action.id}</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant={
                            action.status === 'Open' ? 'open' :
                            action.status === 'Overdue' ? 'overdue' :
                            action.status === 'In Progress' ? 'in-progress' : 'closed'
                          }>
                            {action.status}
                          </Badge>
                          <Badge variant={
                            action.priority === 'High' ? 'priority-high' :
                            action.priority === 'Medium' ? 'priority-medium' : 'priority-low'
                          }>
                            {action.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm mb-3">{action.title}</p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 size={14} className="text-[#605E5C]" />
                        <span className="text-[#605E5C]">Department:</span>
                        <span className="text-[#1B1B1B]">{action.department}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-[#605E5C]">Assigned to:</span>
                        <span className="text-[#1B1B1B]">{action.assignee}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar size={14} className="text-[#605E5C]" />
                        <span className="text-[#605E5C]">Due Date:</span>
                        <span className={action.status === 'Overdue' ? 'text-[#D13438] font-medium' : 'text-[#1B1B1B]'}>
                          {new Date(action.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop: Table View */}
              <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgba(0,0,0,0.12)]">
                    <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Action ID</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Title</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Department</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Assignee</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Due Date</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Status</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {allActions.map((action) => (
                    <tr 
                      key={action.id} 
                      className="border-b border-[rgba(0,0,0,0.12)] hover:bg-gray-50 cursor-pointer"
                      onClick={() => onNavigate('plant-manager-action-details', { actionId: action.id })}
                    >
                      <td className="py-3 px-2 text-sm font-medium">{action.id}</td>
                      <td className="py-3 px-2 text-sm">{action.title}</td>
                      <td className="py-3 px-2 text-sm text-[#605E5C]">{action.department}</td>
                      <td className="py-3 px-2 text-sm text-[#605E5C]">{action.assignee}</td>
                      <td className="py-3 px-2 text-sm text-[#605E5C]">
                        {new Date(action.dueDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2">
                        <Badge variant={
                          action.status === 'Open' ? 'open' :
                          action.status === 'Overdue' ? 'overdue' :
                          action.status === 'In Progress' ? 'in-progress' : 'accepted'
                        }>
                          {action.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-sm">
                        <span className={
                          action.priority === 'High' ? 'text-[#D13438]' :
                          action.priority === 'Medium' ? 'text-[#E69A00]' :
                          'text-[#605E5C]'
                        }>
                          {action.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
          </>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-divider z-50 pb-safe safe-area-bottom">
        <div className="flex h-16">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`relative flex-1 flex flex-col items-center justify-center h-full gap-1 active:bg-surface transition-colors ${
              activeTab === 'overview' ? 'text-primary' : 'text-text-secondary'
            }`}
          >
            <LayoutGrid size={24} strokeWidth={1.5} />
            <span className="text-[10px] font-medium leading-none">Overview</span>
          </button>
          <button 
            onClick={() => setActiveTab('audits')}
            className={`relative flex-1 flex flex-col items-center justify-center h-full gap-1 active:bg-surface transition-colors ${
              activeTab === 'audits' ? 'text-primary' : 'text-text-secondary'
            }`}
          >
            <FileText size={24} strokeWidth={1.5} />
            <span className="text-[10px] font-medium leading-none">Audits</span>
          </button>
          <button 
            onClick={() => setActiveTab('actions')}
            className={`relative flex-1 flex flex-col items-center justify-center h-full gap-1 active:bg-surface transition-colors ${
              activeTab === 'actions' ? 'text-primary' : 'text-text-secondary'
            }`}
          >
            <Building2 size={24} strokeWidth={1.5} />
            <span className="text-[10px] font-medium leading-none">Actions</span>
          </button>
        </div>
      </div>
    </div>
  );
}