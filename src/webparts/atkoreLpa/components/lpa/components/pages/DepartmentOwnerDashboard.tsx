// @ts-nocheck
import { useEffect, useState } from 'react';
import { AppHeader } from '../AppHeader';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Input } from '../Input';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, TrendingUp, Filter, LayoutDashboard, ListTodo, Search, X } from 'lucide-react';
import { Tabs } from '../Tabs';
import { useLpaAppContext } from '../../../../context/LpaAppContext';

interface DepartmentOwnerDashboardProps {
  onNavigate: (page: string, actionId?: string) => void;
  onExit?: () => void;
}

export function DepartmentOwnerDashboard({ onNavigate, onExit }: DepartmentOwnerDashboardProps) {
  const { service } = useLpaAppContext();
  const [liveActions, setLiveActions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterAudit, setFilterAudit] = useState<string>('all');
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    service
      .getActionsForRole('department-owner')
      .then((items) => {
        if (!mounted) {
          return;
        }
        setLiveActions(
          items.map((item) => ({
            id: item.Title || `ACT-${item.Id}`,
            audit: item.AuditReference || 'AUD',
            description: item.Description || item.Title,
            auditorName: item.AssignedToEmail || 'Owner',
            dueDate: item.DueDate || new Date().toISOString().slice(0, 10),
            status: (item.Status || 'open').toLowerCase(),
            department: item.DepartmentName || 'Department',
            priority: (item.Priority || 'medium').toLowerCase()
          }))
        );
      })
      .catch(() => {
        if (mounted) {
          setLiveActions([]);
        }
      });

    return () => {
      mounted = false;
    };
  }, [service]);

  const actionSource = liveActions;
  const overdueCount = actionSource.filter((action) => action.status === 'overdue').length;

  const actionsByStatus = [
    { name: 'Open', value: actionSource.filter((a) => a.status === 'open').length, color: '#F7630C' },
    { name: 'In Progress', value: actionSource.filter((a) => a.status === 'in-progress').length, color: '#4CAC48' },
    { name: 'Overdue', value: actionSource.filter((a) => a.status === 'overdue').length, color: '#D13438' },
    { name: 'Closed', value: actionSource.filter((a) => a.status === 'closed').length, color: '#6B7280' }
  ].filter((item) => item.value > 0);

  const ncTrendData = (() => {
    const now = new Date();
    const buckets: Record<string, number> = {};
    for (let i = 4; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets[d.toLocaleString('en-US', { month: 'short' })] = 0;
    }
    actionSource
      .filter((a) => a.status === 'overdue')
      .forEach((a) => {
        const date = new Date(a.dueDate);
        if (!isNaN(date.getTime())) {
          const key = date.toLocaleString('en-US', { month: 'short' });
          if (key in buckets) {
            buckets[key] += 1;
          }
        }
      });
    return Object.entries(buckets).map(([month, count]) => ({ month, count }));
  })();
  
  // Get unique audits for filter
  const uniqueAudits = Array.from(new Set(actionSource.map(a => a.audit)));
  
  // Filter logic
  const getFilteredActions = () => {
    return actionSource.filter(action => {
      const matchesSearch = searchQuery === '' || 
        action.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        action.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        action.auditorName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || action.status === filterStatus;
      const matchesAudit = filterAudit === 'all' || action.audit === filterAudit;
      
      return matchesSearch && matchesStatus && matchesAudit;
    });
  };
  
  // Get actions to display - only overdue on overview, filtered on actions tab
  const getDisplayedActions = () => {
    if (activeTab === 'overview') {
      return actionSource.filter(action => action.status === 'overdue');
    }
    return getFilteredActions();
  };
  
  // Check if any filters are active
  const hasActiveFilters = filterStatus !== 'all' || filterAudit !== 'all';
  
  // Clear all filters
  const handleClearFilters = () => {
    setFilterStatus('all');
    setFilterAudit('all');
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <AppHeader 
        title="Department Dashboard"
        onExit={onExit}
      />

      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Desktop Tabs - Now handles mobile view internally */}
        <div className="hidden md:block">
          <Tabs 
            tabs={[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'actions', label: 'Actions', icon: ListTodo }
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Urgent Actions Alert */}
            <div className="bg-[#FEF0F1] border border-destructive rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} strokeWidth={1.5} className="text-destructive mt-0.5 shrink-0" />
                <div className="flex-1">
                  <h4 className="text-destructive mb-1.5">Actions Need Attention</h4>
                  <p className="text-sm text-text-secondary">
                    You have {overdueCount} overdue action{overdueCount === 1 ? '' : 's'} that require immediate attention.
                  </p>
                </div>
                <Button variant="tertiary" className="shrink-0" onClick={() => setActiveTab('actions')}>
                  View All
                </Button>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* NC Trend Chart */}
              <Card>
                <div className="flex items-center justify-between mb-5">
                  <h3>Non-Conformances Trend (My Department)</h3>
                  <TrendingUp size={20} strokeWidth={1.5} className="text-primary" />
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={ncTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E1DFDD" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#605E5C' }} stroke="#605E5C" />
                    <YAxis tick={{ fontSize: 12, fill: '#605E5C' }} stroke="#605E5C" />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 4px 8px rgba(0,0,0,0.07)' }} />
                    <Bar dataKey="count" fill="#43A047" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Actions by Status */}
              <Card>
                <h3 className="mb-5">Actions by Status</h3>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={actionsByStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        dataKey="value"
                        label={(entry) => `${entry.name}: ${entry.value}`}
                      >
                        {actionsByStatus.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 8px rgba(0,0,0,0.07)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {actionsByStatus.length === 0 && (
                  <p className="text-sm text-text-muted text-center mt-2">No action status data available.</p>
                )}
              </Card>
            </div>
          </>
        )}

        {/* Actions List - Show when activeTab is 'actions' OR as part of overview on desktop */}
        {(activeTab === 'actions' || activeTab === 'overview') && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3>{activeTab === 'overview' ? 'Actions Needing Attention' : 'All Actions'}</h3>
              {activeTab === 'overview' && (
                <Button variant="tertiary" onClick={() => setActiveTab('actions')}>
                  View All
                </Button>
              )}
            </div>
            
            {/* Search and Filter Toolbar - Only show on Actions tab */}
            {activeTab === 'actions' && (
              <div className="mb-4 flex gap-2">
                {/* Mobile: Search + Filter Button */}
                <div className="md:hidden flex gap-2 w-full">
                  <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                    <Input 
                      placeholder="Search actions..." 
                      className="pl-10 w-full" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
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

                {/* Desktop: Search + Filters */}
                <div className="hidden md:flex items-center gap-3 w-full">
                  <div className="relative flex-1 max-w-md">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                    <Input 
                      placeholder="Search actions..." 
                      className="pl-10 w-full" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <select 
                    className="px-3 py-2 border border-[rgba(0,0,0,0.12)] rounded text-sm bg-white"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="overdue">Overdue</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                  
                  <select 
                    className="px-3 py-2 border border-[rgba(0,0,0,0.12)] rounded text-sm bg-white"
                    value={filterAudit}
                    onChange={(e) => setFilterAudit(e.target.value)}
                  >
                    <option value="all">All Audits</option>
                    {uniqueAudits.map(audit => (
                      <option key={audit} value={audit}>{audit}</option>
                    ))}
                  </select>
                  
                  {hasActiveFilters && (
                    <Button variant="tertiary" onClick={handleClearFilters}>
                      Clear All
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Mobile: Card View */}
            <div className="space-y-3 md:hidden">
              {getDisplayedActions().map((action) => (
                <div 
                  key={action.id} 
                  className="p-4 border border-border rounded-lg cursor-pointer hover:bg-surface active:bg-surface transition-colors bg-white"
                  onClick={() => onNavigate('action-details', action.id)}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4>{action.id}</h4>
                    <Badge variant={
                      action.status === 'overdue' ? 'overdue' : 
                      action.status === 'in-progress' ? 'in-progress' : 
                      action.status === 'closed' ? 'submitted' :
                      'open'
                    }>
                      {action.status === 'overdue' ? 'Overdue' : 
                       action.status === 'in-progress' ? 'In Progress' : 
                       action.status === 'closed' ? 'Closed' :
                       'Open'}
                    </Badge>
                  </div>
                  <p className="text-sm text-text mb-2.5">{action.description}</p>
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>{action.auditorName}</span>
                    <span>Due: {new Date(action.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Table View */}
            <Card className="overflow-hidden hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-divider">
                      <th className="text-left py-3 px-2 text-xs font-medium text-text-secondary">Action ID</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-text-secondary">Audit Title</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-text-secondary">Auditor Name</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-text-secondary">Due Date</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-text-secondary">Status</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-text-secondary">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getDisplayedActions().map((action) => (
                      <tr key={action.id} className="border-b border-divider hover:bg-surface cursor-pointer transition-colors">
                        <td className="py-3.5 px-2 text-sm font-medium">{action.id}</td>
                        <td className="py-3.5 px-2 text-sm">{action.description}</td>
                        <td className="py-3.5 px-2 text-sm text-text-secondary">{action.auditorName}</td>
                        <td className="py-3.5 px-2 text-sm text-text-secondary">
                          {new Date(action.dueDate).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-2">
                          <Badge variant={
                            action.status === 'overdue' ? 'overdue' : 
                            action.status === 'in-progress' ? 'in-progress' : 
                            action.status === 'closed' ? 'submitted' :
                            'open'
                          }>
                            {action.status === 'overdue' ? 'Overdue' : 
                             action.status === 'in-progress' ? 'In Progress' : 
                             action.status === 'closed' ? 'Closed' :
                             'Open'}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-2">
                          <Button variant="tertiary" onClick={() => onNavigate('action-details', action.id)}>
                            View
                          </Button>
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

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-divider z-50 pb-safe safe-area-bottom">
        <div className="flex h-16">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`relative flex-1 flex flex-col items-center justify-center h-full gap-1 active:bg-surface transition-colors ${
              activeTab === 'overview' ? 'text-primary' : 'text-text-secondary'
            }`}
          >
            <LayoutDashboard size={24} strokeWidth={1.5} />
            <span className="text-[10px] font-medium leading-none">Overview</span>
          </button>
          <button 
            onClick={() => setActiveTab('actions')}
            className={`relative flex-1 flex flex-col items-center justify-center h-full gap-1 active:bg-surface transition-colors ${
              activeTab === 'actions' ? 'text-primary' : 'text-text-secondary'
            }`}
          >
            <ListTodo size={24} strokeWidth={1.5} />
            <span className="text-[10px] font-medium leading-none">Actions</span>
          </button>
        </div>
      </div>
      
      {/* Mobile Filter Dialog - Bottom Sheet */}
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
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="overdue">Overdue</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="closed">Closed</option>
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
                  {uniqueAudits.map(audit => (
                    <option key={audit} value={audit}>{audit}</option>
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
    </div>
  );
}


