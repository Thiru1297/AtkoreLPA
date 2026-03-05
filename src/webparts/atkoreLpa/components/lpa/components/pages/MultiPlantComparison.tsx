// @ts-nocheck
import { useState } from 'react';
import { AppHeader } from '../AppHeader';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { Calendar, MapPin, Layers, AlertCircle, LayoutGrid, FileText, Clipboard, Check, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface MultiPlantComparisonProps {
  onExit?: () => void;
}

export function MultiPlantComparison({ onExit }: MultiPlantComparisonProps) {
  const [selectedPlants, setSelectedPlants] = useState<string[]>(['plant-a', 'plant-b']);
  const [showPlantDropdown, setShowPlantDropdown] = useState(false);
  const [activeView, setActiveView] = useState('overview');
  const [activeTab, setActiveTab] = useState('audits');
  const [carouselIndex, setCarouselIndex] = useState(0);

  const plants = [
    { id: 'plant-a', name: 'Plant A', color: '#4CAC48' },
    { id: 'plant-b', name: 'Plant B', color: '#0078D4' },
    { id: 'plant-c', name: 'Plant C', color: '#F7630C' },
  ];

  const togglePlant = (plantId: string) => {
    if (selectedPlants.includes(plantId)) {
      setSelectedPlants(selectedPlants.filter(id => id !== plantId));
    } else {
      setSelectedPlants([...selectedPlants, plantId]);
    }
  };

  const getSelectedPlantNames = () => {
    return plants
      .filter(p => selectedPlants.includes(p.id))
      .map(p => p.name)
      .join(', ');
  };

  // KPI Data
  const kpis = [
    { label: 'Total Audits', value: '312' },
    { label: 'Completed Audits', value: '287' },
    { label: 'NC Count', value: '68' },
    { label: 'NC Rate', value: '4.2%' },
    { label: 'Audit Compliance', value: '89%' },
    { label: 'Overdue Actions', value: '14' },
  ];

  // Plant-wise Compliance Data (Clustered Bar Chart)
  const complianceByPlant = [
    { month: 'Jun', 'Plant A': 85, 'Plant B': 82, 'Plant C': 80 },
    { month: 'Jul', 'Plant A': 87, 'Plant B': 85, 'Plant C': 83 },
    { month: 'Aug', 'Plant A': 90, 'Plant B': 86, 'Plant C': 85 },
    { month: 'Sep', 'Plant A': 88, 'Plant B': 89, 'Plant C': 87 },
    { month: 'Oct', 'Plant A': 91, 'Plant B': 90, 'Plant C': 88 },
    { month: 'Nov', 'Plant A': 93, 'Plant B': 91, 'Plant C': 90 },
  ];

  // NC Category Distribution per Plant (Donut Charts)
  const ncByPlantCategory = {
    'Plant A': [
      { name: 'Safety', value: 15, color: '#D13438' },
      { name: 'Quality', value: 10, color: '#F7630C' },
      { name: '5S', value: 8, color: '#FFB900' },
      { name: 'Process', value: 5, color: '#0078D4' },
    ],
    'Plant B': [
      { name: 'Safety', value: 12, color: '#D13438' },
      { name: 'Quality', value: 8, color: '#F7630C' },
      { name: '5S', value: 6, color: '#FFB900' },
      { name: 'Process', value: 4, color: '#0078D4' },
    ],
    'Plant C': [
      { name: 'Safety', value: 10, color: '#D13438' },
      { name: 'Quality', value: 7, color: '#F7630C' },
      { name: '5S', value: 5, color: '#FFB900' },
      { name: 'Process', value: 3, color: '#0078D4' },
    ],
  };

  // Audits by Plant
  const auditsByPlant = {
    'Plant A': [
      { id: 'AUD-2025-056', department: 'Production Line 1', layer: 'Layer 3', date: '2025-12-04', auditor: 'John Smith', ncCount: 2, status: 'Submitted' },
      { id: 'AUD-2025-054', department: 'Warehouse', layer: 'Layer 1', date: '2025-12-02', auditor: 'Mike Davis', ncCount: 1, status: 'Submitted' },
      { id: 'AUD-2025-052', department: 'Maintenance', layer: 'Layer 2', date: '2025-11-30', auditor: 'John Smith', ncCount: 0, status: 'Submitted' },
    ],
    'Plant B': [
      { id: 'AUD-2025-055', department: 'Quality Control', layer: 'Layer 2', date: '2025-12-03', auditor: 'Sarah Johnson', ncCount: 0, status: 'Submitted' },
      { id: 'AUD-2025-051', department: 'Production Line 1', layer: 'Layer 3', date: '2025-11-29', auditor: 'Sarah Johnson', ncCount: 1, status: 'Submitted' },
    ],
    'Plant C': [
      { id: 'AUD-2025-053', department: 'Production Line 2', layer: 'Layer 3', date: '2025-12-01', auditor: 'Emily Chen', ncCount: 3, status: 'Submitted' },
      { id: 'AUD-2025-049', department: 'Warehouse', layer: 'Layer 1', date: '2025-11-27', auditor: 'Emily Chen', ncCount: 2, status: 'Submitted' },
    ],
  };

  // Actions by Plant
  const actionsByPlant = {
    'Plant A': [
      { id: 'ACT-2025-089', department: 'Production Line 1', assignee: 'Mike Ross', dueDate: '2025-12-08', status: 'Open', priority: 'High', description: 'Fix safety guard on machine #3' },
      { id: 'ACT-2025-087', department: 'Warehouse', assignee: 'Robert Wilson', dueDate: '2025-12-10', status: 'In Progress', priority: 'Medium', description: 'Reorganize pallet storage area' },
      { id: 'ACT-2025-085', department: 'Maintenance', assignee: 'John Doe', dueDate: '2025-11-28', status: 'Closed', priority: 'Low', description: 'Clean HVAC filters' },
    ],
    'Plant B': [
      { id: 'ACT-2025-088', department: 'Quality Control', assignee: 'Jane Smith', dueDate: '2025-12-05', status: 'Overdue', priority: 'High', description: 'Update calibration records' },
      { id: 'ACT-2025-084', department: 'Safety', assignee: 'Sarah Lee', dueDate: '2025-12-15', status: 'Open', priority: 'High', description: 'Conduct fire drill and update logs' },
    ],
    'Plant C': [
      { id: 'ACT-2025-086', department: 'Production Line 2', assignee: 'Emily Davis', dueDate: '2025-12-12', status: 'Open', priority: 'Medium', description: 'Replace worn conveyor belt' },
      { id: 'ACT-2025-082', department: 'Quality Control', assignee: 'Jane Smith', dueDate: '2025-12-20', status: 'Open', priority: 'Low', description: 'Update SOP documentation' },
    ],
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted': return 'submitted';
      case 'open': return 'open';
      case 'overdue': return 'overdue';
      case 'in progress': return 'in-progress';
      case 'closed': return 'closed';
      default: return 'secondary';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'secondary';
    }
  };

  const renderAuditCard = (audit: any, plantName: string) => (
    <Card key={audit.id} className="mb-3">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="mb-1">{audit.id}</h3>
          <Badge variant={getStatusBadgeVariant(audit.status)}>{audit.status}</Badge>
        </div>
        {audit.ncCount > 0 && (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-[#FCE5E7] text-[#D13438] rounded">
            <AlertCircle size={14} />
            <span className="text-xs font-medium">{audit.ncCount} NC</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <MapPin size={14} className="text-[#605E5C]" />
          <span className="text-[#605E5C]">Plant:</span>
          <span className="text-[#1B1B1B]">{plantName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Layers size={14} className="text-[#605E5C]" />
          <span className="text-[#605E5C]">Department:</span>
          <span className="text-[#1B1B1B]">{audit.department}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Layers size={14} className="text-[#605E5C]" />
          <span className="text-[#605E5C]">Layer:</span>
          <span className="text-[#1B1B1B]">{audit.layer}</span>
        </div>
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
    </Card>
  );

  const renderActionCard = (action: any, plantName: string) => (
    <Card key={action.id} className="mb-3">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="mb-2">{action.id}</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant={getStatusBadgeVariant(action.status)}>{action.status}</Badge>
            <Badge variant={getPriorityBadgeVariant(action.priority)}>{action.priority}</Badge>
          </div>
        </div>
      </div>

      <p className="text-sm mb-3">{action.description}</p>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <MapPin size={14} className="text-[#605E5C]" />
          <span className="text-[#605E5C]">Plant:</span>
          <span className="text-[#1B1B1B]">{plantName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Layers size={14} className="text-[#605E5C]" />
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
    </Card>
  );

  const selectedPlantObjects = plants.filter(p => selectedPlants.includes(p.id));
  const carouselPlants = Object.keys(ncByPlantCategory);

  return (
    <div className="min-h-screen bg-[#F5F8F5] pb-20 md:pb-0">
      <AppHeader 
        title="Multi-Plant Comparison"
        onExit={onExit}
      />

      <div className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Multi-Plant Selector */}
        <div className="sticky top-0 z-10 bg-[#F5F8F5] pb-2 -mt-4 pt-4">
          <div className="relative">
            <button
              onClick={() => setShowPlantDropdown(!showPlantDropdown)}
              className="w-full md:w-auto min-w-64 flex items-center justify-between gap-2 px-4 py-2.5 bg-white border-2 border-[#4CAC48] rounded-full text-sm"
            >
              <span className="text-[#1B1B1B]">
                {selectedPlants.length === 0 ? 'Select plants...' : getSelectedPlantNames()}
              </span>
              <ChevronDown size={16} className="text-[#605E5C]" />
            </button>

            {showPlantDropdown && (
              <div className="absolute top-full left-0 right-0 md:right-auto md:w-64 mt-2 bg-white rounded-lg border border-[rgba(0,0,0,0.12)] shadow-lg z-20">
                {plants.map(plant => (
                  <button
                    key={plant.id}
                    onClick={() => togglePlant(plant.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F5F8F5] transition-colors border-b border-[rgba(0,0,0,0.06)] last:border-b-0"
                  >
                    <div 
                      className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${
                        selectedPlants.includes(plant.id)
                          ? 'bg-[#4CAC48] border-[#4CAC48]'
                          : 'bg-white border-[#8A8A8A]'
                      }`}
                    >
                      {selectedPlants.includes(plant.id) && (
                        <Check size={14} className="text-white" strokeWidth={3} />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: plant.color }}
                      />
                      <span className="text-sm text-[#1B1B1B]">{plant.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Plants Chips */}
          {selectedPlants.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedPlantObjects.map(plant => (
                <div
                  key={plant.id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-[rgba(0,0,0,0.12)]"
                >
                  <div 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: plant.color }}
                  />
                  <span className="text-xs text-[#1B1B1B]">{plant.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Overview View */}
        {activeView === 'overview' && (
          <>
            {/* Horizontally Scrollable KPI Cards */}
            <div className="overflow-x-auto -mx-4 px-4">
              <div className="flex gap-3 pb-2 min-w-max">
                {kpis.map((kpi, index) => (
                  <Card key={index} className="min-w-[140px] p-4">
                    <p className="text-xs text-[#605E5C] mb-2 whitespace-nowrap">{kpi.label}</p>
                    <p className="text-2xl font-medium text-[#1B1B1B]">{kpi.value}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Plant-wise Compliance (Clustered Bar Chart) */}
            <Card className="p-5">
              <h3 className="mb-4">Audit Compliance by Plant</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={complianceByPlant}
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E1DFDD" />
                    <XAxis dataKey="month" stroke="#605E5C" />
                    <YAxis stroke="#605E5C" domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid rgba(0,0,0,0.12)',
                        borderRadius: '8px'
                      }}
                      formatter={(value) => `${value}%`}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '16px' }}
                      iconType="circle"
                    />
                    <Bar dataKey="Plant A" fill="#4CAC48" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Plant B" fill="#0078D4" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Plant C" fill="#F7630C" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* NC Category Distribution - Carousel */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3>NC by Category</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCarouselIndex(Math.max(0, carouselIndex - 1))}
                    disabled={carouselIndex === 0}
                    className="p-1 rounded hover:bg-[#F5F8F5] disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} className="text-[#605E5C]" />
                  </button>
                  <span className="text-xs text-[#605E5C]">
                    {carouselIndex + 1} / {carouselPlants.length}
                  </span>
                  <button
                    onClick={() => setCarouselIndex(Math.min(carouselPlants.length - 1, carouselIndex + 1))}
                    disabled={carouselIndex === carouselPlants.length - 1}
                    className="p-1 rounded hover:bg-[#F5F8F5] disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={20} className="text-[#605E5C]" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-[#605E5C] mb-4">{carouselPlants[carouselIndex]}</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ncByPlantCategory[carouselPlants[carouselIndex] as keyof typeof ncByPlantCategory]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                      labelLine={false}
                    >
                      {ncByPlantCategory[carouselPlants[carouselIndex] as keyof typeof ncByPlantCategory].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Comparative Compliance Trend (Multi-line Chart) */}
            <Card className="p-5">
              <h3 className="mb-4">Comparative Compliance Performance</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={complianceByPlant}
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E1DFDD" />
                    <XAxis dataKey="month" stroke="#605E5C" />
                    <YAxis stroke="#605E5C" domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid rgba(0,0,0,0.12)',
                        borderRadius: '8px'
                      }}
                      formatter={(value) => `${value}%`}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '16px' }}
                      iconType="circle"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Plant A" 
                      stroke="#4CAC48" 
                      strokeWidth={2}
                      dot={{ fill: '#4CAC48', r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Plant B" 
                      stroke="#0078D4" 
                      strokeWidth={2}
                      dot={{ fill: '#0078D4', r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Plant C" 
                      stroke="#F7630C" 
                      strokeWidth={2}
                      dot={{ fill: '#F7630C', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Tabs - Audits / Actions */}
            <div className="overflow-x-auto -mx-4 px-4">
              <div className="flex gap-2 border-b border-[rgba(0,0,0,0.12)] min-w-max">
                <button
                  onClick={() => setActiveTab('audits')}
                  className={`px-4 py-3 text-sm font-medium transition-all ${
                    activeTab === 'audits'
                      ? 'text-[#4CAC48] border-b-2 border-[#4CAC48]'
                      : 'text-[#605E5C] hover:text-[#1B1B1B]'
                  }`}
                >
                  Audits
                </button>
                <button
                  onClick={() => setActiveTab('actions')}
                  className={`px-4 py-3 text-sm font-medium transition-all ${
                    activeTab === 'actions'
                      ? 'text-[#4CAC48] border-b-2 border-[#4CAC48]'
                      : 'text-[#605E5C] hover:text-[#1B1B1B]'
                  }`}
                >
                  Actions
                </button>
              </div>
            </div>

            {/* Tab Content - Grouped by Plant */}
            {activeTab === 'audits' && (
              <div>
                {selectedPlantObjects.map(plant => (
                  <div key={plant.id} className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: plant.color }}
                      />
                      <h3>{plant.name}</h3>
                    </div>
                    {auditsByPlant[plant.name as keyof typeof auditsByPlant]?.map(audit => 
                      renderAuditCard(audit, plant.name)
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'actions' && (
              <div>
                {selectedPlantObjects.map(plant => (
                  <div key={plant.id} className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: plant.color }}
                      />
                      <h3>{plant.name}</h3>
                    </div>
                    {actionsByPlant[plant.name as keyof typeof actionsByPlant]?.map(action => 
                      renderActionCard(action, plant.name)
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Audits View */}
        {activeView === 'audits' && (
          <div>
            {selectedPlantObjects.map(plant => (
              <div key={plant.id} className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: plant.color }}
                  />
                  <h3>{plant.name}</h3>
                </div>
                {auditsByPlant[plant.name as keyof typeof auditsByPlant]?.map(audit => 
                  renderAuditCard(audit, plant.name)
                )}
              </div>
            ))}
          </div>
        )}

        {/* Actions View */}
        {activeView === 'actions' && (
          <div>
            {selectedPlantObjects.map(plant => (
              <div key={plant.id} className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: plant.color }}
                  />
                  <h3>{plant.name}</h3>
                </div>
                {actionsByPlant[plant.name as keyof typeof actionsByPlant]?.map(action => 
                  renderActionCard(action, plant.name)
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[rgba(0,0,0,0.12)] z-50">
        <div className="flex h-16">
          <button 
            onClick={() => setActiveView('overview')}
            className={`relative flex-1 flex flex-col items-center justify-center h-full gap-1 active:bg-[#F5F8F5] transition-colors ${
              activeView === 'overview' ? 'text-[#4CAC48]' : 'text-[#605E5C]'
            }`}
          >
            <LayoutGrid size={24} strokeWidth={1.5} />
            <span className="text-[10px] font-medium leading-none">Overview</span>
          </button>
          <button 
            onClick={() => setActiveView('audits')}
            className={`relative flex-1 flex flex-col items-center justify-center h-full gap-1 active:bg-[#F5F8F5] transition-colors ${
              activeView === 'audits' ? 'text-[#4CAC48]' : 'text-[#605E5C]'
            }`}
          >
            <FileText size={24} strokeWidth={1.5} />
            <span className="text-[10px] font-medium leading-none">Audits</span>
          </button>
          <button 
            onClick={() => setActiveView('actions')}
            className={`relative flex-1 flex flex-col items-center justify-center h-full gap-1 active:bg-[#F5F8F5] transition-colors ${
              activeView === 'actions' ? 'text-[#4CAC48]' : 'text-[#605E5C]'
            }`}
          >
            <Clipboard size={24} strokeWidth={1.5} />
            <span className="text-[10px] font-medium leading-none">Actions</span>
          </button>
        </div>
      </div>
    </div>
  );
}

