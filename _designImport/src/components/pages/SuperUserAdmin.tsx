import { useState, useEffect } from 'react';
import { AppHeader } from '../AppHeader';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Tabs } from '../Tabs';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { Calendar, MapPin, Layers, AlertCircle, LayoutGrid, FileText, Clipboard, Check, ChevronDown, ChevronLeft, ChevronRight, Search, Filter, X, Download, TrendingUp, TrendingDown, Info, Bell, Activity } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Input, Select } from "../Input";
import { Button } from '../Button';

interface SuperUserAdminProps {
  onExit?: () => void;
  onNavigate?: (page: string, params?: any) => void;
  activeTab?: string;
}

export function SuperUserAdmin({ onExit, onNavigate, activeTab }: SuperUserAdminProps) {
  const [selectedPlants, setSelectedPlants] = useState<string[]>(['plant-a', 'plant-b']);
  const [showPlantDropdown, setShowPlantDropdown] = useState(false);
  const [activeView, setActiveView] = useState(activeTab || 'overview');
  const [carouselIndex, setCarouselIndex] = useState(0);
  
  // Year filter state
  const [selectedYear, setSelectedYear] = useState(2025);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const availableYears = [2023, 2024, 2025];
  
  // Month filter state
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const availableMonths = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];
  
  // Initialize with current year and month on mount
  useEffect(() => {
    const now = new Date();
    setSelectedYear(now.getFullYear());
    setSelectedMonth(now.getMonth() + 1); // getMonth() returns 0-11
  }, []);
  
  // New state for nested tabs in Overview
  const [overviewNestedTab, setOverviewNestedTab] = useState<'audits' | 'actions'>('audits');
  
  // Audit search and filter states
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [isAuditFilterDialogOpen, setIsAuditFilterDialogOpen] = useState(false);
  const [auditFilters, setAuditFilters] = useState({
    department: '',
    layer: '',
    status: '',
    auditor: '',
    dateFrom: '',
    dateTo: '',
  });

  // Action search and filter states
  const [actionSearchQuery, setActionSearchQuery] = useState('');
  const [isActionFilterDialogOpen, setIsActionFilterDialogOpen] = useState(false);
  const [actionFilters, setActionFilters] = useState({
    department: '',
    status: '',
    priority: '',
    assignee: '',
    dateFrom: '',
    dateTo: '',
  });

  // Tooltip state for chart info buttons
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  
  // Desktop carousel page state for pie charts
  const [desktopCarouselPage, setDesktopCarouselPage] = useState(0);

  const plants = [
    { id: 'plant-a', name: 'Plant A', color: '#4CAC48' },
    { id: 'plant-b', name: 'Plant B', color: '#0078D4' },
    { id: 'plant-c', name: 'Plant C', color: '#F7630C' },
    { id: 'plant-d', name: 'Plant D', color: '#7B1FA2' },
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

  // Reset desktop carousel page when selected plants change
  useEffect(() => {
    setDesktopCarouselPage(0);
  }, [selectedPlants]);

  // Year-specific data
  const dataByYear = {
    2023: {
      kpis: [
        { label: 'Total Audits', value: '285' },
        { label: 'Completed Audits', value: '248' },
        { label: 'NC Count', value: '92' },
        { label: 'NC Rate', value: '6.8%' },
        { label: 'Audit Compliance', value: '82%' },
        { label: 'Overdue Actions', value: '22' },
      ],
      complianceByPlant: [
        { month: 'Jun', 'Plant A': 75, 'Plant B': 73, 'Plant C': 70, 'Plant D': 77 },
        { month: 'Jul', 'Plant A': 78, 'Plant B': 75, 'Plant C': 72, 'Plant D': 79 },
        { month: 'Aug', 'Plant A': 80, 'Plant B': 77, 'Plant C': 75, 'Plant D': 81 },
        { month: 'Sep', 'Plant A': 79, 'Plant B': 78, 'Plant C': 76, 'Plant D': 80 },
        { month: 'Oct', 'Plant A': 81, 'Plant B': 80, 'Plant C': 78, 'Plant D': 82 },
        { month: 'Nov', 'Plant A': 83, 'Plant B': 81, 'Plant C': 79, 'Plant D': 84 },
      ],
      ncByPlantCategory: {
        'Plant A': [
          { name: 'Safety', value: 22, color: '#D13438' },
          { name: 'Quality', value: 18, color: '#F7630C' },
          { name: '5S', value: 14, color: '#FFB900' },
          { name: 'Process', value: 11, color: '#0078D4' },
        ],
        'Plant B': [
          { name: 'Safety', value: 18, color: '#D13438' },
          { name: 'Quality', value: 15, color: '#F7630C' },
          { name: '5S', value: 11, color: '#FFB900' },
          { name: 'Process', value: 8, color: '#0078D4' },
        ],
        'Plant C': [
          { name: 'Safety', value: 16, color: '#D13438' },
          { name: 'Quality', value: 13, color: '#F7630C' },
          { name: '5S', value: 9, color: '#FFB900' },
          { name: 'Process', value: 7, color: '#0078D4' },
        ],
        'Plant D': [
          { name: 'Safety', value: 20, color: '#D13438' },
          { name: 'Quality', value: 16, color: '#F7630C' },
          { name: '5S', value: 12, color: '#FFB900' },
          { name: 'Process', value: 9, color: '#0078D4' },
        ],
      },
      departmentNcData: [
        { department: 'Production Line 1', count: 28, color: '#1B5E20' },
        { department: 'Production Line 2', count: 24, color: '#2E7D32' },
        { department: 'Quality Control', count: 15, color: '#388E3C' },
        { department: 'Warehouse', count: 18, color: '#43A047' },
        { department: 'Maintenance', count: 11, color: '#66BB6A' },
        { department: 'Safety', count: 16, color: '#81C784' },
      ],
      actionClosureData: [
        { month: 'Jun', totalActions: 52, closedActions: 41 },
        { month: 'Jul', totalActions: 58, closedActions: 46 },
        { month: 'Aug', totalActions: 54, closedActions: 43 },
        { month: 'Sep', totalActions: 61, closedActions: 49 },
        { month: 'Oct', totalActions: 56, closedActions: 45 },
        { month: 'Nov', totalActions: 63, closedActions: 51 },
      ],
    },
    2024: {
      kpis: [
        { label: 'Total Audits', value: '298' },
        { label: 'Completed Audits', value: '265' },
        { label: 'NC Count', value: '78' },
        { label: 'NC Rate', value: '5.3%' },
        { label: 'Audit Compliance', value: '85%' },
        { label: 'Overdue Actions', value: '18' },
      ],
      complianceByPlant: [
        { month: 'Jun', 'Plant A': 80, 'Plant B': 78, 'Plant C': 75, 'Plant D': 82 },
        { month: 'Jul', 'Plant A': 83, 'Plant B': 80, 'Plant C': 78, 'Plant D': 84 },
        { month: 'Aug', 'Plant A': 85, 'Plant B': 82, 'Plant C': 80, 'Plant D': 86 },
        { month: 'Sep', 'Plant A': 84, 'Plant B': 83, 'Plant C': 81, 'Plant D': 85 },
        { month: 'Oct', 'Plant A': 86, 'Plant B': 85, 'Plant C': 83, 'Plant D': 87 },
        { month: 'Nov', 'Plant A': 88, 'Plant B': 86, 'Plant C': 84, 'Plant D': 89 },
      ],
      ncByPlantCategory: {
        'Plant A': [
          { name: 'Safety', value: 18, color: '#D13438' },
          { name: 'Quality', value: 14, color: '#F7630C' },
          { name: '5S', value: 11, color: '#FFB900' },
          { name: 'Process', value: 8, color: '#0078D4' },
        ],
        'Plant B': [
          { name: 'Safety', value: 15, color: '#D13438' },
          { name: 'Quality', value: 11, color: '#F7630C' },
          { name: '5S', value: 8, color: '#FFB900' },
          { name: 'Process', value: 6, color: '#0078D4' },
        ],
        'Plant C': [
          { name: 'Safety', value: 13, color: '#D13438' },
          { name: 'Quality', value: 10, color: '#F7630C' },
          { name: '5S', value: 7, color: '#FFB900' },
          { name: 'Process', value: 5, color: '#0078D4' },
        ],
        'Plant D': [
          { name: 'Safety', value: 16, color: '#D13438' },
          { name: 'Quality', value: 12, color: '#F7630C' },
          { name: '5S', value: 9, color: '#FFB900' },
          { name: 'Process', value: 7, color: '#0078D4' },
        ],
      },
      departmentNcData: [
        { department: 'Production Line 1', count: 22, color: '#1B5E20' },
        { department: 'Production Line 2', count: 19, color: '#2E7D32' },
        { department: 'Quality Control', count: 11, color: '#388E3C' },
        { department: 'Warehouse', count: 15, color: '#43A047' },
        { department: 'Maintenance', count: 8, color: '#66BB6A' },
        { department: 'Safety', count: 13, color: '#81C784' },
      ],
      actionClosureData: [
        { month: 'Jun', totalActions: 48, closedActions: 40 },
        { month: 'Jul', totalActions: 54, closedActions: 46 },
        { month: 'Aug', totalActions: 50, closedActions: 43 },
        { month: 'Sep', totalActions: 57, closedActions: 49 },
        { month: 'Oct', totalActions: 52, closedActions: 45 },
        { month: 'Nov', totalActions: 60, closedActions: 52 },
      ],
    },
    2025: {
      kpis: [
        { label: 'Total Audits', value: '312' },
        { label: 'Completed Audits', value: '287' },
        { label: 'NC Count', value: '68' },
        { label: 'NC Rate', value: '4.2%' },
        { label: 'Audit Compliance', value: '89%' },
        { label: 'Overdue Actions', value: '14' },
      ],
      complianceByPlant: [
        { month: 'Jun', 'Plant A': 85, 'Plant B': 82, 'Plant C': 80, 'Plant D': 87 },
        { month: 'Jul', 'Plant A': 87, 'Plant B': 85, 'Plant C': 83, 'Plant D': 89 },
        { month: 'Aug', 'Plant A': 90, 'Plant B': 86, 'Plant C': 85, 'Plant D': 91 },
        { month: 'Sep', 'Plant A': 88, 'Plant B': 89, 'Plant C': 87, 'Plant D': 90 },
        { month: 'Oct', 'Plant A': 91, 'Plant B': 90, 'Plant C': 88, 'Plant D': 92 },
        { month: 'Nov', 'Plant A': 93, 'Plant B': 91, 'Plant C': 90, 'Plant D': 94 },
      ],
      ncByPlantCategory: {
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
        'Plant D': [
          { name: 'Safety', value: 13, color: '#D13438' },
          { name: 'Quality', value: 9, color: '#F7630C' },
          { name: '5S', value: 7, color: '#FFB900' },
          { name: 'Process', value: 4, color: '#0078D4' },
        ],
      },
      departmentNcData: [
        { department: 'Production Line 1', count: 18, color: '#1B5E20' },
        { department: 'Production Line 2', count: 15, color: '#2E7D32' },
        { department: 'Quality Control', count: 8, color: '#388E3C' },
        { department: 'Warehouse', count: 12, color: '#43A047' },
        { department: 'Maintenance', count: 5, color: '#66BB6A' },
        { department: 'Safety', count: 10, color: '#81C784' },
      ],
      actionClosureData: [
        { month: 'Jun', totalActions: 45, closedActions: 38 },
        { month: 'Jul', totalActions: 52, closedActions: 45 },
        { month: 'Aug', totalActions: 48, closedActions: 42 },
        { month: 'Sep', totalActions: 55, closedActions: 48 },
        { month: 'Oct', totalActions: 50, closedActions: 44 },
        { month: 'Nov', totalActions: 58, closedActions: 52 },
      ],
    },
  };

  // Dynamic data generation based on year/month selection
  const generateDynamicData = () => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const weekNames = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];
    const departments = ['Production Line 1', 'Production Line 2', 'Quality Control', 'Warehouse', 'Maintenance', 'Safety'];
    const departmentColors = ['#1B5E20', '#2E7D32', '#388E3C', '#43A047', '#66BB6A', '#81C784'];
    
    const random = (min: number, max: number, seed: number) => {
      const x = Math.sin(seed) * 10000;
      const rand = x - Math.floor(x);
      return Math.floor(rand * (max - min + 1)) + min;
    };
    
    const randomFloat = (min: number, max: number, seed: number) => {
      const x = Math.sin(seed) * 10000;
      const rand = x - Math.floor(x);
      return +(rand * (max - min) + min).toFixed(1);
    };
    
    const baseSeed = selectedYear * 10000 + (selectedMonth || 0) * 100;
    const baseCompliance = selectedYear === 2023 ? 75 : selectedYear === 2024 ? 82 : 88;
    const baseNCRate = selectedYear === 2023 ? 6.8 : selectedYear === 2024 ? 5.3 : 4.2;
    
    if (selectedMonth === null) {
      const complianceByPlant = monthNames.map((month, index) => {
        const seed = selectedYear * 100 + index;
        return {
          month,
          'Plant A': random(baseCompliance, baseCompliance + 15, seed + 1),
          'Plant B': random(baseCompliance - 3, baseCompliance + 12, seed + 2),
          'Plant C': random(baseCompliance - 5, baseCompliance + 10, seed + 3),
          'Plant D': random(baseCompliance + 2, baseCompliance + 17, seed + 4),
        };
      });
      
      const actionClosureData = monthNames.map((month, index) => {
        const seed = selectedYear * 100 + index;
        return {
          month,
          totalActions: random(45, 65, seed + 10),
          closedActions: random(35, 55, seed + 20),
        };
      });
      
      const totalAudits = random(280, 320, baseSeed + 1);
      const completedAudits = random(Math.floor(totalAudits * 0.85), Math.floor(totalAudits * 0.95), baseSeed + 2);
      const ncCount = random(60, 95, baseSeed + 3);
      const pendingActions = random(15, 35, baseSeed + 4);
      const completedActions = random(80, 120, baseSeed + 5);
      const overdueActions = random(10, 25, baseSeed + 6);
      
      const totalAuditsLastWeek = random(5, 8, baseSeed + 101);
      const totalAuditsThisWeek = random(5, 8, baseSeed + 102);
      const completedAuditsLastWeek = random(4, 7, baseSeed + 103);
      const completedAuditsThisWeek = random(4, 7, baseSeed + 104);
      const ncCountLastWeek = random(1, 4, baseSeed + 105);
      const ncCountThisWeek = random(1, 4, baseSeed + 106);
      const pendingActionsLastWeek = random(3, 8, baseSeed + 107);
      const pendingActionsThisWeek = random(3, 8, baseSeed + 108);
      const completedActionsLastWeek = random(6, 12, baseSeed + 109);
      const completedActionsThisWeek = random(6, 12, baseSeed + 110);
      const overdueActionsLastWeek = random(2, 6, baseSeed + 111);
      const overdueActionsThisWeek = random(2, 6, baseSeed + 112);
      
      const kpis = [
        { label: 'Total Audits', value: totalAudits.toString(), lastWeek: totalAuditsLastWeek, thisWeek: totalAuditsThisWeek },
        { label: 'Completed Audits', value: completedAudits.toString(), lastWeek: completedAuditsLastWeek, thisWeek: completedAuditsThisWeek },
        { label: 'NC Count', value: ncCount.toString(), lastWeek: ncCountLastWeek, thisWeek: ncCountThisWeek },
        { label: 'Pending Actions', value: pendingActions.toString(), lastWeek: pendingActionsLastWeek, thisWeek: pendingActionsThisWeek },
        { label: 'Completed Actions', value: completedActions.toString(), lastWeek: completedActionsLastWeek, thisWeek: completedActionsThisWeek },
        { label: 'Overdue Actions', value: overdueActions.toString(), lastWeek: overdueActionsLastWeek, thisWeek: overdueActionsThisWeek },
      ];
      
      const heatmapData = plants.map((plant, pIndex) => ({
        plant: plant.name,
        values: departments.map((_, dIndex) => random(3, 20, baseSeed + pIndex * 10 + dIndex + 100))
      }));
      
      const comparisonTableData = plants.map((plant, index) => ({
        plant: plant.name,
        ncRate: randomFloat(2.5, 7.0, baseSeed + index + 200),
        compliance: random(baseCompliance - 5, baseCompliance + 8, baseSeed + index + 300),
        audits: random(85, 120, baseSeed + index + 400),
        overdue: random(0, 10, baseSeed + index + 500),
        color: plant.color,
      }));
      
      const departmentNcData = departments.map((dept, index) => ({
        department: dept,
        count: random(8, 30, baseSeed + index + 600),
        color: departmentColors[index],
      }));
      
      const ncByPlantCategory = {
        'Plant A': [
          { name: 'Safety', value: random(10, 25, baseSeed + 701), color: '#D13438' },
          { name: 'Quality', value: random(7, 20, baseSeed + 702), color: '#F7630C' },
          { name: '5S', value: random(5, 15, baseSeed + 703), color: '#FFB900' },
          { name: 'Process', value: random(3, 12, baseSeed + 704), color: '#0078D4' },
        ],
        'Plant B': [
          { name: 'Safety', value: random(10, 25, baseSeed + 711), color: '#D13438' },
          { name: 'Quality', value: random(7, 20, baseSeed + 712), color: '#F7630C' },
          { name: '5S', value: random(5, 15, baseSeed + 713), color: '#FFB900' },
          { name: 'Process', value: random(3, 12, baseSeed + 714), color: '#0078D4' },
        ],
        'Plant C': [
          { name: 'Safety', value: random(10, 25, baseSeed + 721), color: '#D13438' },
          { name: 'Quality', value: random(7, 20, baseSeed + 722), color: '#F7630C' },
          { name: '5S', value: random(5, 15, baseSeed + 723), color: '#FFB900' },
          { name: 'Process', value: random(3, 12, baseSeed + 724), color: '#0078D4' },
        ],
        'Plant D': [
          { name: 'Safety', value: random(10, 25, baseSeed + 731), color: '#D13438' },
          { name: 'Quality', value: random(7, 20, baseSeed + 732), color: '#F7630C' },
          { name: '5S', value: random(5, 15, baseSeed + 733), color: '#FFB900' },
          { name: 'Process', value: random(3, 12, baseSeed + 734), color: '#0078D4' },
        ],
      };
      
      return { complianceByPlant, actionClosureData, kpis, heatmapData, comparisonTableData, departmentNcData, ncByPlantCategory };
    } else {
      const numWeeks = random(4, 5, selectedYear * 100 + selectedMonth);
      const weeks = weekNames.slice(0, numWeeks);
      
      const complianceByPlant = weeks.map((week, index) => {
        const seed = selectedYear * 1000 + selectedMonth * 10 + index;
        return {
          month: week,
          'Plant A': random(baseCompliance, baseCompliance + 15, seed + 1),
          'Plant B': random(baseCompliance - 3, baseCompliance + 12, seed + 2),
          'Plant C': random(baseCompliance - 5, baseCompliance + 10, seed + 3),
          'Plant D': random(baseCompliance + 2, baseCompliance + 17, seed + 4),
        };
      });
      
      const actionClosureData = weeks.map((week, index) => {
        const seed = selectedYear * 1000 + selectedMonth * 10 + index;
        return {
          month: week,
          totalActions: random(10, 18, seed + 10),
          closedActions: random(7, 15, seed + 20),
        };
      });
      
      const totalAudits = random(20, 30, baseSeed + 1);
      const completedAudits = random(Math.floor(totalAudits * 0.85), totalAudits, baseSeed + 2);
      const ncCount = random(5, 15, baseSeed + 3);
      const pendingActions = random(3, 10, baseSeed + 4);
      const completedActions = random(15, 25, baseSeed + 5);
      const overdueActions = random(1, 5, baseSeed + 6);
      
      const totalAuditsLastWeek = random(1, 2, baseSeed + 101);
      const totalAuditsThisWeek = random(1, 2, baseSeed + 102);
      const completedAuditsLastWeek = random(1, 2, baseSeed + 103);
      const completedAuditsThisWeek = random(1, 2, baseSeed + 104);
      const ncCountLastWeek = random(0, 2, baseSeed + 105);
      const ncCountThisWeek = random(0, 2, baseSeed + 106);
      const pendingActionsLastWeek = random(1, 3, baseSeed + 107);
      const pendingActionsThisWeek = random(1, 3, baseSeed + 108);
      const completedActionsLastWeek = random(2, 5, baseSeed + 109);
      const completedActionsThisWeek = random(2, 5, baseSeed + 110);
      const overdueActionsLastWeek = random(0, 2, baseSeed + 111);
      const overdueActionsThisWeek = random(0, 2, baseSeed + 112);
      
      const kpis = [
        { label: 'Total Audits', value: totalAudits.toString(), lastWeek: totalAuditsLastWeek, thisWeek: totalAuditsThisWeek },
        { label: 'Completed Audits', value: completedAudits.toString(), lastWeek: completedAuditsLastWeek, thisWeek: completedAuditsThisWeek },
        { label: 'NC Count', value: ncCount.toString(), lastWeek: ncCountLastWeek, thisWeek: ncCountThisWeek },
        { label: 'Pending Actions', value: pendingActions.toString(), lastWeek: pendingActionsLastWeek, thisWeek: pendingActionsThisWeek },
        { label: 'Completed Actions', value: completedActions.toString(), lastWeek: completedActionsLastWeek, thisWeek: completedActionsThisWeek },
        { label: 'Overdue Actions', value: overdueActions.toString(), lastWeek: overdueActionsLastWeek, thisWeek: overdueActionsThisWeek },
      ];
      
      const heatmapData = plants.map((plant, pIndex) => ({
        plant: plant.name,
        values: departments.map((_, dIndex) => random(1, 8, baseSeed + pIndex * 10 + dIndex + 100))
      }));
      
      const comparisonTableData = plants.map((plant, index) => ({
        plant: plant.name,
        ncRate: randomFloat(2.5, 7.0, baseSeed + index + 200),
        compliance: random(baseCompliance - 5, baseCompliance + 8, baseSeed + index + 300),
        audits: random(15, 30, baseSeed + index + 400),
        overdue: random(0, 4, baseSeed + index + 500),
        color: plant.color,
      }));
      
      const departmentNcData = departments.map((dept, index) => ({
        department: dept,
        count: random(2, 10, baseSeed + index + 600),
        color: departmentColors[index],
      }));
      
      const ncByPlantCategory = {
        'Plant A': [
          { name: 'Safety', value: random(2, 8, baseSeed + 701), color: '#D13438' },
          { name: 'Quality', value: random(1, 6, baseSeed + 702), color: '#F7630C' },
          { name: '5S', value: random(1, 5, baseSeed + 703), color: '#FFB900' },
          { name: 'Process', value: random(1, 4, baseSeed + 704), color: '#0078D4' },
        ],
        'Plant B': [
          { name: 'Safety', value: random(2, 8, baseSeed + 711), color: '#D13438' },
          { name: 'Quality', value: random(1, 6, baseSeed + 712), color: '#F7630C' },
          { name: '5S', value: random(1, 5, baseSeed + 713), color: '#FFB900' },
          { name: 'Process', value: random(1, 4, baseSeed + 714), color: '#0078D4' },
        ],
        'Plant C': [
          { name: 'Safety', value: random(2, 8, baseSeed + 721), color: '#D13438' },
          { name: 'Quality', value: random(1, 6, baseSeed + 722), color: '#F7630C' },
          { name: '5S', value: random(1, 5, baseSeed + 723), color: '#FFB900' },
          { name: 'Process', value: random(1, 4, baseSeed + 724), color: '#0078D4' },
        ],
        'Plant D': [
          { name: 'Safety', value: random(2, 8, baseSeed + 731), color: '#D13438' },
          { name: 'Quality', value: random(1, 6, baseSeed + 732), color: '#F7630C' },
          { name: '5S', value: random(1, 5, baseSeed + 733), color: '#FFB900' },
          { name: 'Process', value: random(1, 4, baseSeed + 734), color: '#0078D4' },
        ],
      };
      
      return { complianceByPlant, actionClosureData, kpis, heatmapData, comparisonTableData, departmentNcData, ncByPlantCategory };
    }
  };

  // Get all dynamic data
  const dynamicData = generateDynamicData();
  const complianceByPlant = dynamicData.complianceByPlant;
  const actionClosureData = dynamicData.actionClosureData;
  const kpis = dynamicData.kpis;
  const heatmapData = dynamicData.heatmapData;
  const comparisonTableData = dynamicData.comparisonTableData;
  const departmentNcData = dynamicData.departmentNcData;
  const ncByPlantCategory = dynamicData.ncByPlantCategory;

  // Get selected plant objects for filtering
  const selectedPlantObjects = plants.filter(p => selectedPlants.includes(p.id));
  const selectedPlantNames = selectedPlantObjects.map(p => p.name);

  // Filter compliance trend data to only include selected plants
  const filteredComplianceByPlant = complianceByPlant.map(monthData => {
    const filtered: any = { month: monthData.month };
    selectedPlantNames.forEach(plantName => {
      if (monthData[plantName as keyof typeof monthData] !== undefined) {
        filtered[plantName] = monthData[plantName as keyof typeof monthData];
      }
    });
    return filtered;
  });

  // Filter NC category data to only include selected plants
  const filteredNcByPlantCategory = Object.fromEntries(
    Object.entries(ncByPlantCategory).filter(([plantName]) => selectedPlantNames.includes(plantName))
  );

  // Calculate filtered KPIs based on selected plants
  const calculateFilteredKPIs = () => {
    if (selectedPlants.length === 0) {
      return [
        { label: 'Total Audits', value: '0', lastWeek: 0, thisWeek: 0 },
        { label: 'Completed Audits', value: '0', lastWeek: 0, thisWeek: 0 },
        { label: 'NC Count', value: '0', lastWeek: 0, thisWeek: 0 },
        { label: 'Pending Actions', value: '0', lastWeek: 0, thisWeek: 0 },
        { label: 'Completed Actions', value: '0', lastWeek: 0, thisWeek: 0 },
        { label: 'Overdue Actions', value: '0', lastWeek: 0, thisWeek: 0 },
      ];
    }

    // Calculate proportionally based on number of plants selected
    const ratio = selectedPlants.length / plants.length;
    
    return kpis.map(kpi => {
      const numValue = parseInt(kpi.value);
      const scaledValue = Math.round(numValue * ratio);
      const scaledLastWeek = Math.round(kpi.lastWeek * ratio);
      const scaledThisWeek = Math.round(kpi.thisWeek * ratio);
      
      return { 
        ...kpi, 
        value: scaledValue.toString(),
        lastWeek: scaledLastWeek,
        thisWeek: scaledThisWeek
      };
    });
  };

  const filteredKpis = calculateFilteredKPIs();

  // Unfiltered KPIs - always shows base data regardless of any filters
  const unfilteredKpis = [
    { label: 'Total Audits', value: '312', lastWeek: 6, thisWeek: 7 },
    { label: 'Completed Audits', value: '278', lastWeek: 5, thisWeek: 6 },
    { label: 'NC Count', value: '68', lastWeek: 2, thisWeek: 3 },
    { label: 'Pending Actions', value: '24', lastWeek: 5, thisWeek: 6 },
    { label: 'Completed Actions', value: '98', lastWeek: 8, thisWeek: 10 },
    { label: 'Overdue Actions', value: '18', lastWeek: 4, thisWeek: 5 },
  ];

  // Filter heatmap data to only show selected plants
  const filteredHeatmapData = heatmapData.filter(row => 
    selectedPlantNames.includes(row.plant)
  );

  // Filter multi-plant comparison table
  const filteredComparisonTableData = comparisonTableData.filter(row =>
    selectedPlantNames.includes(row.plant)
  );

  // Audits by Plant
  const auditsByPlant = {
    'Plant A': [
      { id: 'AUD-2025-056', department: 'Production Line 1', date: '2025-12-04', auditor: 'John Smith', ncCount: 2, compliantCount: 10, naCount: 1, status: 'Submitted' },
      { id: 'AUD-2025-054', department: 'Warehouse', date: '2025-12-02', auditor: 'Mike Davis', ncCount: 1, compliantCount: 12, naCount: 2, status: 'In Progress' },
      { id: 'AUD-2025-052', department: 'Maintenance', date: '2025-11-30', auditor: 'John Smith', ncCount: 0, compliantCount: 15, naCount: 0, status: 'Completed' },
      { id: 'AUD-2025-050', department: 'Safety', date: '2025-12-10', auditor: 'John Smith', ncCount: 0, compliantCount: 0, naCount: 0, status: 'Not Started' },
    ],
    'Plant B': [
      { id: 'AUD-2025-055', department: 'Quality Control', date: '2025-12-03', auditor: 'Sarah Johnson', ncCount: 0, compliantCount: 14, naCount: 3, status: 'Submitted' },
      { id: 'AUD-2025-051', department: 'Production Line 1', date: '2025-11-29', auditor: 'Sarah Johnson', ncCount: 1, compliantCount: 11, naCount: 2, status: 'Completed' },
      { id: 'AUD-2025-048', department: 'Warehouse', date: '2025-12-09', auditor: 'Sarah Johnson', ncCount: 0, compliantCount: 0, naCount: 0, status: 'Denied' },
    ],
    'Plant C': [
      { id: 'AUD-2025-053', department: 'Production Line 2', date: '2025-12-01', auditor: 'Emily Chen', ncCount: 3, compliantCount: 8, naCount: 2, status: 'Submitted' },
      { id: 'AUD-2025-049', department: 'Warehouse', date: '2025-11-27', auditor: 'Emily Chen', ncCount: 2, compliantCount: 9, naCount: 1, status: 'In Progress' },
      { id: 'AUD-2025-047', department: 'Quality Control', date: '2025-12-11', auditor: 'Emily Chen', ncCount: 0, compliantCount: 0, naCount: 0, status: 'Denied' },
    ],
    'Plant D': [
      { id: 'AUD-2025-057', department: 'Production Line 1', date: '2025-12-05', auditor: 'David Park', ncCount: 1, compliantCount: 13, naCount: 1, status: 'Submitted' },
      { id: 'AUD-2025-058', department: 'Quality Control', date: '2025-12-06', auditor: 'David Park', ncCount: 2, compliantCount: 11, naCount: 2, status: 'In Progress' },
      { id: 'AUD-2025-059', department: 'Safety', date: '2025-11-28', auditor: 'Lisa Wang', ncCount: 1, compliantCount: 14, naCount: 0, status: 'Completed' },
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
    'Plant D': [
      { id: 'ACT-2025-090', department: 'Production Line 1', assignee: 'David Park', dueDate: '2025-12-07', status: 'Overdue', priority: 'High', description: 'Replace faulty sensor on line 3' },
      { id: 'ACT-2025-091', department: 'Quality Control', assignee: 'Lisa Wang', dueDate: '2025-12-14', status: 'Open', priority: 'Medium', description: 'Review and update quality metrics' },
      { id: 'ACT-2025-092', department: 'Safety', assignee: 'Tom Chen', dueDate: '2025-12-18', status: 'Open', priority: 'Low', description: 'Update emergency exit signage' },
    ],
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'not started': return 'secondary';
      case 'accepted': return 'accepted';
      case 'denied': return 'denied';
      case 'in progress': return 'in-progress';
      case 'submitted': return 'submitted';
      case 'completed': return 'completed';
      case 'open': return 'open';
      case 'overdue': return 'overdue';
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

  const renderAuditCard = (audit: any, plantName: string) => {
    const showCounts = ['In Progress', 'Submitted', 'Completed'].includes(audit.status);
    return (
      <Card key={audit.id} className="mb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="mb-1">{audit.id}</h3>
            <Badge variant={getStatusBadgeVariant(audit.status)}>{audit.status}</Badge>
          </div>
          {showCounts && audit.ncCount > 0 && (
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
            <Calendar size={14} className="text-[#605E5C]" />
            <span className="text-[#605E5C]">Date:</span>
            <span className="text-[#1B1B1B]">{new Date(audit.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#605E5C]">Auditor:</span>
            <span className="text-[#1B1B1B]">{audit.auditor}</span>
          </div>
          {showCounts && (
            <div className="flex gap-4 text-sm pt-2 border-t border-[rgba(0,0,0,0.08)]">
              <div>
                <span className="text-[#605E5C]">Compliant: </span>
                <span className="text-[#4CAC48] font-medium">{audit.compliantCount}</span>
              </div>
              <div>
                <span className="text-[#605E5C]">NC: </span>
                <span className="text-[#D13438] font-medium">{audit.ncCount}</span>
              </div>
              <div>
                <span className="text-[#605E5C]">N/A: </span>
                <span className="text-[#605E5C] font-medium">{audit.naCount}</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  };

  const renderActionCard = (action: any, plantName: string) => (
    <Card 
      key={action.id} 
      className="mb-3 cursor-pointer"
      onClick={() => onNavigate?.('super-user-action-details', { actionId: action.id, returnTo: 'super-user', returnTab: 'actions' })}
    >
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

  const carouselPlants = Object.keys(filteredNcByPlantCategory);

  return (
    <div className="min-h-screen bg-[#F5F8F5] pb-20 md:pb-0">
      <AppHeader 
        title="Super User"
        onExit={onExit}
      />

      <div className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Desktop: Tabs on left, Plant Selector on right */}
        <div className="hidden md:flex md:items-center md:justify-between md:gap-4 sticky top-[120px] z-30 bg-white py-4 -mt-4 -mx-6 px-6 shadow-sm">
          <Tabs
            tabs={[
              { id: 'overview', label: 'Overview' },
              { id: 'audits', label: 'Audits' },
              { id: 'actions', label: 'Actions' },
            ]}
            activeTab={activeView}
            onTabChange={setActiveView}
          />
          
          <div className="flex items-center gap-3">
            {/* Year Filter - Only visible on Overview tab */}
            {activeView === 'overview' && (
              <>
                <div className="relative">
                  <button
                    onClick={() => setShowYearDropdown(!showYearDropdown)}
                    className="min-w-32 flex items-center justify-between gap-2 px-4 py-2.5 bg-white border-2 border-[#4CAC48] rounded-full text-sm"
                  >
                    <span className="text-[#1B1B1B]">Year: {selectedYear}</span>
                    <ChevronDown size={16} className="text-[#605E5C]" />
                  </button>

                  {showYearDropdown && (
                    <div className="absolute top-full right-0 w-32 mt-2 bg-white rounded-lg border border-[rgba(0,0,0,0.12)] shadow-lg z-20">
                      {availableYears.map(year => (
                        <button
                          key={year}
                          onClick={() => {
                            setSelectedYear(year);
                            setShowYearDropdown(false);
                          }}
                          className={`w-full px-4 py-3 text-sm text-left hover:bg-[#F5F8F5] transition-colors border-b border-[rgba(0,0,0,0.06)] last:border-b-0 ${
                            selectedYear === year ? 'bg-[#E8F5E9] text-[#1B5E20] font-medium' : 'text-[#1B1B1B]'
                          }`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Month Filter */}
                <div className="relative">
                  <button
                    onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                    className="min-w-40 flex items-center justify-between gap-2 px-4 py-2.5 bg-white border-2 border-[#4CAC48] rounded-full text-sm"
                  >
                    <span className="text-[#1B1B1B]">
                      {selectedMonth ? availableMonths.find(m => m.value === selectedMonth)?.label : 'All Months'}
                    </span>
                    <ChevronDown size={16} className="text-[#605E5C]" />
                  </button>

                  {showMonthDropdown && (
                    <div className="absolute top-full right-0 w-40 mt-2 bg-white rounded-lg border border-[rgba(0,0,0,0.12)] shadow-lg z-20 max-h-64 overflow-y-auto">
                      <button
                        onClick={() => {
                          setSelectedMonth(null);
                          setShowMonthDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-sm text-left hover:bg-[#F5F8F5] transition-colors border-b border-[rgba(0,0,0,0.06)] ${
                          selectedMonth === null ? 'bg-[#E8F5E9] text-[#1B5E20] font-medium' : 'text-[#1B1B1B]'
                        }`}
                      >
                        All Months
                      </button>
                      {availableMonths.map(month => (
                        <button
                          key={month.value}
                          onClick={() => {
                            setSelectedMonth(month.value);
                            setShowMonthDropdown(false);
                          }}
                          className={`w-full px-4 py-3 text-sm text-left hover:bg-[#F5F8F5] transition-colors border-b border-[rgba(0,0,0,0.06)] last:border-b-0 ${
                            selectedMonth === month.value ? 'bg-[#E8F5E9] text-[#1B5E20] font-medium' : 'text-[#1B1B1B]'
                          }`}
                        >
                          {month.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Plant Filter */}
            <div className="relative">
              <button
                onClick={() => setShowPlantDropdown(!showPlantDropdown)}
                className="min-w-64 flex items-center justify-between gap-2 px-4 py-2.5 bg-white border-2 border-[#4CAC48] rounded-full text-sm"
              >
                <span className="text-[#1B1B1B]">
                  {selectedPlants.length === 0 ? 'Select plants...' : getSelectedPlantNames()}
                </span>
                <ChevronDown size={16} className="text-[#605E5C]" />
              </button>

              {showPlantDropdown && (
                <div className="absolute top-full right-0 w-64 mt-2 bg-white rounded-lg border border-[rgba(0,0,0,0.12)] shadow-lg z-20">
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
          </div>
        </div>

        {/* Mobile: Filters */}
        <div className="md:hidden sticky top-0 z-10 bg-[#F5F8F5] pb-2 -mt-4 pt-4 space-y-2">
          {/* Year and Month Filters - Only visible on Overview tab */}
          {activeView === 'overview' && (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <button
                  onClick={() => setShowYearDropdown(!showYearDropdown)}
                  className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-white border-2 border-[#4CAC48] rounded-full text-sm"
                >
                  <span className="text-[#1B1B1B]">Year: {selectedYear}</span>
                  <ChevronDown size={16} className="text-[#605E5C]" />
                </button>

                {showYearDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border border-[rgba(0,0,0,0.12)] shadow-lg z-20">
                    {availableYears.map(year => (
                      <button
                        key={year}
                        onClick={() => {
                          setSelectedYear(year);
                          setShowYearDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-sm text-left hover:bg-[#F5F8F5] transition-colors border-b border-[rgba(0,0,0,0.06)] last:border-b-0 ${
                          selectedYear === year ? 'bg-[#E8F5E9] text-[#1B5E20] font-medium' : 'text-[#1B1B1B]'
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative flex-1">
                <button
                  onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                  className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-white border-2 border-[#4CAC48] rounded-full text-sm"
                >
                  <span className="text-[#1B1B1B]">
                    {selectedMonth ? availableMonths.find(m => m.value === selectedMonth)?.label.slice(0, 3) : 'All'}
                  </span>
                  <ChevronDown size={16} className="text-[#605E5C]" />
                </button>

                {showMonthDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border border-[rgba(0,0,0,0.12)] shadow-lg z-20 max-h-64 overflow-y-auto">
                    <button
                      onClick={() => {
                        setSelectedMonth(null);
                        setShowMonthDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-sm text-left hover:bg-[#F5F8F5] transition-colors border-b border-[rgba(0,0,0,0.06)] ${
                        selectedMonth === null ? 'bg-[#E8F5E9] text-[#1B5E20] font-medium' : 'text-[#1B1B1B]'
                      }`}
                    >
                      All Months
                    </button>
                    {availableMonths.map(month => (
                      <button
                        key={month.value}
                        onClick={() => {
                          setSelectedMonth(month.value);
                          setShowMonthDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-sm text-left hover:bg-[#F5F8F5] transition-colors border-b border-[rgba(0,0,0,0.06)] last:border-b-0 ${
                          selectedMonth === month.value ? 'bg-[#E8F5E9] text-[#1B5E20] font-medium' : 'text-[#1B1B1B]'
                        }`}
                      >
                        {month.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Plant Selector */}
          <div className="relative">
            <button
              onClick={() => setShowPlantDropdown(!showPlantDropdown)}
              className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-white border-2 border-[#4CAC48] rounded-full text-sm"
            >
              <span className="text-[#1B1B1B]">
                {selectedPlants.length === 0 ? 'Select plants...' : getSelectedPlantNames()}
              </span>
              <ChevronDown size={16} className="text-[#605E5C]" />
            </button>

            {showPlantDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border border-[rgba(0,0,0,0.12)] shadow-lg z-20">
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
        </div>

        {/* Overview View */}
        {activeView === 'overview' && (
          <>
            {/* Enhanced KPI Cards with Trend Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {unfilteredKpis.map((kpi, index) => {
                return (
                  <Card key={index} className="p-4 hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-white to-[#F5F8F5]">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-xs font-semibold text-[rgb(0,0,0)] uppercase tracking-wide font-bold font-normal">{kpi.label}</p>
                    </div>
                    <p className="text-3xl font-semibold text-[#1B1B1B] mb-3">{kpi.value}</p>
                    
                    {/* Weekly breakdown */}
                    <div className="border-t border-[#E1DFDD] space-y-2 pt-[6px] pr-[0px] pb-[0px] pl-[0px]">
                      <div className="flex items-center justify-between px-[8px] py-[0px]">
                        <span className="text-xs text-[#605E5C]">Last Week</span>
                        <span className="text-sm font-medium text-[#1B1B1B]">{kpi.lastWeek}</span>
                      </div>
                      <div className="flex items-center justify-between bg-[#E8F5E9] px-2 py-1.5 rounded">
                        <span className="text-xs text-[#1B5E20] font-medium">This Week</span>
                        <span className="text-sm font-semibold text-[#1B5E20]">{kpi.thisWeek}</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Multi-Plant Compliance Trend */}
            <Card className="p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-[#1B1B1B]">Multi-Plant Non-Compliance Trend</h3>
                  <div className="relative">
                    <button 
                      className="text-[#605E5C] hover:text-[#1B1B1B]"
                      onMouseEnter={() => setActiveTooltip('compliance-trend')}
                      onMouseLeave={() => setActiveTooltip(null)}
                    >
                      <Info size={16} />
                    </button>
                    {activeTooltip === 'compliance-trend' && (
                      <div className="absolute left-0 top-8 z-50 w-72 p-3 bg-white text-[#1B1B1B] text-xs rounded-lg shadow-xl border border-[#E1DFDD]">
                        <p className="font-medium mb-1">Compliance Trend Analysis</p>
                        <p className="text-[#605E5C]">Tracks compliance percentage {selectedMonth ? 'by week' : 'by month'} for each selected plant. Higher percentages indicate better compliance with audit standards.</p>
                        <div className="absolute -top-1 left-3 w-2 h-2 bg-white border-l border-t border-[#E1DFDD] transform rotate-45"></div>
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-xs text-[#605E5C]">
                  {selectedMonth ? `${availableMonths.find(m => m.value === selectedMonth)?.label} ${selectedYear} (Weekly)` : `${selectedYear} (Monthly)`}
                </span>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={filteredComplianceByPlant}
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E1DFDD" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#605E5C"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#605E5C" 
                      domain={[0, 100]}
                      tick={{ fontSize: 12 }}
                      label={{ value: 'Compliance %', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#605E5C' } }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid rgba(0,0,0,0.12)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value) => [`${value}%`, '']}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '16px' }}
                      iconType="circle"
                    />
                    {selectedPlantObjects.map((plant) => (
                      <Line 
                        key={plant.name}
                        type="monotone" 
                        dataKey={plant.name} 
                        stroke={plant.color} 
                        strokeWidth={3}
                        dot={{ fill: plant.color, r: 5, strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 7 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* NC Heatmap & Multi-Plant Performance Comparison - Side by Side on Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* NC Heatmap Component */}
              <Card className="p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#1B1B1B]">NC Heatmap (Plant × Department)</h3>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[#605E5C]">Low</span>
                    <div className="flex gap-1">
                      {['#E8F5E9', '#C8E6C9', '#81C784', '#43A047', '#2E7D32', '#1B5E20'].map((color, idx) => (
                        <div key={idx} className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                    <span className="text-[#605E5C]">High</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="text-left text-xs font-medium text-[#605E5C] p-2 border-b border-[rgba(0,0,0,0.06)]"></th>
                        <th className="text-center text-xs font-medium text-[#605E5C] p-2 border-b border-[rgba(0,0,0,0.06)]">Prod L1</th>
                        <th className="text-center text-xs font-medium text-[#605E5C] p-2 border-b border-[rgba(0,0,0,0.06)]">Prod L2</th>
                        <th className="text-center text-xs font-medium text-[#605E5C] p-2 border-b border-[rgba(0,0,0,0.06)]">QC</th>
                        <th className="text-center text-xs font-medium text-[#605E5C] p-2 border-b border-[rgba(0,0,0,0.06)]">Warehouse</th>
                        <th className="text-center text-xs font-medium text-[#605E5C] p-2 border-b border-[rgba(0,0,0,0.06)]">Safety</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHeatmapData.map((row, rowIdx) => {
                        const plant = plants.find(p => p.name === row.plant);
                        const plantColor = plant?.color || '#4CAC48';
                        return (
                          <tr key={rowIdx}>
                            <td className="text-left text-sm font-medium text-[#1B1B1B] p-2 border-b border-[rgba(0,0,0,0.06)]">
                              <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: plantColor }} />
                                {row.plant}
                              </div>
                            </td>
                            {row.values.map((val, colIdx) => {
                              const intensity = Math.min(Math.floor((val / 20) * 5), 5);
                              const colors = ['#E8F5E9', '#C8E6C9', '#81C784', '#43A047', '#2E7D32', '#1B5E20'];
                              return (
                                <td 
                                  key={colIdx} 
                                  className="text-center p-2 border-b border-[rgba(0,0,0,0.06)] cursor-pointer hover:opacity-80 transition-opacity"
                                  style={{ backgroundColor: colors[intensity] }}
                                >
                                  <span className={`text-sm font-medium ${intensity > 3 ? 'text-white' : 'text-[#1B1B1B]'}`}>
                                    {val}
                                  </span>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="absolute bottom-4 left-5 text-xs text-[#605E5C]">
                  <span className="font-medium">
                    {selectedMonth ? availableMonths.find(m => m.value === selectedMonth)?.label : 'All Months'} {selectedYear}
                  </span>
                </div>
              </Card>

              {/* Multi-Plant Performance Comparison */}
              <Card className="p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#1B1B1B]">Multi-Plant Performance Comparison</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-[#E1DFDD]">
                        <th className="text-left py-3 px-3 text-xs font-semibold text-[#605E5C] uppercase tracking-wide">Plant</th>
                        <th className="text-center py-3 px-3 text-xs font-semibold text-[#605E5C] uppercase tracking-wide cursor-pointer hover:text-[#1B1B1B]">
                          NC Rate ↕
                        </th>
                        <th className="text-center py-3 px-3 text-xs font-semibold text-[#605E5C] uppercase tracking-wide cursor-pointer hover:text-[#1B1B1B]">
                          Compliance % ↕
                        </th>
                        <th className="text-center py-3 px-3 text-xs font-semibold text-[#605E5C] uppercase tracking-wide cursor-pointer hover:text-[#1B1B1B]">
                          Total Audits ↕
                        </th>
                        <th className="text-center py-3 px-3 text-xs font-semibold text-[#605E5C] uppercase tracking-wide cursor-pointer hover:text-[#1B1B1B]">
                          Overdue Actions ↕
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredComparisonTableData.map((row, idx) => (
                        <tr key={idx} className="border-b border-[rgba(0,0,0,0.06)] hover:bg-[#F5F8F5] transition-colors">
                          <td className="py-4 px-3">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: row.color }} />
                              <span className="text-sm font-medium text-[#1B1B1B]">{row.plant}</span>
                            </div>
                          </td>
                          <td className="py-4 px-3 text-center">
                            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium ${
                              row.ncRate < 4 
                                ? 'bg-[#E8F5E9] text-[#1B5E20]' 
                                : row.ncRate < 5 
                                ? 'bg-[#FFF3E0] text-[#E65100]'
                                : 'bg-[#FFEBEE] text-[#C62828]'
                            }`}>
                              {row.ncRate}%
                            </span>
                          </td>
                          <td className="py-4 px-3 text-center">
                            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium ${
                              row.compliance >= 92 
                                ? 'bg-[#E8F5E9] text-[#1B5E20]' 
                                : row.compliance >= 88 
                                ? 'bg-[#FFF3E0] text-[#E65100]'
                                : 'bg-[#FFEBEE] text-[#C62828]'
                            }`}>
                              {row.compliance}%
                            </span>
                          </td>
                          <td className="py-4 px-3 text-center">
                            <span className="text-sm font-medium text-[#1B1B1B]">{row.audits}</span>
                          </td>
                          <td className="py-4 px-3 text-center">
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                              row.overdue === 0 
                                ? 'bg-[#E8F5E9] text-[#1B5E20]' 
                                : row.overdue < 5 
                                ? 'bg-[#FFF3E0] text-[#E65100]'
                                : 'bg-[#FFEBEE] text-[#C62828]'
                            }`}>
                              {row.overdue}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* NC Category Distribution - Mobile: Carousel, Desktop: Grid */}
            
            {/* Mobile Carousel View */}
            <Card className="p-5 md:hidden shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#1B1B1B]">NC by Category</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCarouselIndex(Math.max(0, carouselIndex - 1))}
                    disabled={carouselIndex === 0}
                    className="p-1.5 rounded-lg hover:bg-[#F5F8F5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={18} className="text-[#605E5C]" />
                  </button>
                  <span className="text-xs font-medium text-[#605E5C] min-w-[40px] text-center">
                    {carouselIndex + 1} / {carouselPlants.length}
                  </span>
                  <button
                    onClick={() => setCarouselIndex(Math.min(carouselPlants.length - 1, carouselIndex + 1))}
                    disabled={carouselIndex === carouselPlants.length - 1}
                    className="p-1.5 rounded-lg hover:bg-[#F5F8F5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={18} className="text-[#605E5C]" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: plants.find(p => p.name === carouselPlants[carouselIndex])?.color }}
                />
                <p className="text-sm font-medium text-[#1B1B1B]">{carouselPlants[carouselIndex]}</p>
              </div>
              <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={filteredNcByPlantCategory[carouselPlants[carouselIndex] as keyof typeof filteredNcByPlantCategory]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                      labelLine={false}
                    >
                      {filteredNcByPlantCategory[carouselPlants[carouselIndex] as keyof typeof filteredNcByPlantCategory].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid rgba(0,0,0,0.12)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center label */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#1B1B1B]">
                      {filteredNcByPlantCategory[carouselPlants[carouselIndex] as keyof typeof filteredNcByPlantCategory].reduce((sum, item) => sum + item.value, 0)}
                    </p>
                    <p className="text-xs text-[#605E5C]">Total NCs</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Desktop Grid View */}
            <div className="hidden md:block">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#1B1B1B]">Plant-Wise NC Breakdown by Category</h3>
                <span className="text-xs text-[#605E5C]">Donut Charts</span>
              </div>
              <div className="relative">
                {/* Left Chevron */}
                {carouselPlants.length > 3 && desktopCarouselPage > 0 && (
                  <button
                    onClick={() => setDesktopCarouselPage(desktopCarouselPage - 1)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow border border-[#E0E0E0]"
                  >
                    <ChevronLeft className="w-5 h-5 text-[#1B1B1B]" />
                  </button>
                )}
                
                {/* Grid */}
                <div className={`grid gap-4 ${carouselPlants.length === 1 ? 'grid-cols-1' : carouselPlants.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                  {(carouselPlants.length <= 3 
                    ? carouselPlants 
                    : carouselPlants.slice(desktopCarouselPage * 3, desktopCarouselPage * 3 + 3)
                  ).map((plantName) => {
                    const plantColor = plants.find(p => p.name === plantName)?.color || '#4CAC48';
                    const totalNCs = filteredNcByPlantCategory[plantName as keyof typeof filteredNcByPlantCategory].reduce((sum, item) => sum + item.value, 0);
                    return (
                      <Card key={plantName} className="p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: plantColor }}
                            />
                            <h4 className="font-medium text-[#1B1B1B]">{plantName}</h4>
                          </div>
                          <span className="text-xs font-medium text-[#605E5C] bg-[#F5F5F5] px-2 py-1 rounded">
                            {totalNCs} NCs
                          </span>
                        </div>
                        <div className="h-56 relative">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={filteredNcByPlantCategory[plantName as keyof typeof filteredNcByPlantCategory]}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={3}
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}`}
                                labelLine={{ stroke: '#8A8A8A', strokeWidth: 1 }}
                              >
                                {filteredNcByPlantCategory[plantName as keyof typeof filteredNcByPlantCategory].map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'white', 
                                  border: '1px solid rgba(0,0,0,0.12)',
                                  borderRadius: '8px',
                                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                          {/* Center label */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                              <p className="text-xl font-bold text-[#1B1B1B]">{totalNCs}</p>
                              <p className="text-xs text-[#605E5C]">Total</p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                {/* Right Chevron */}
                {carouselPlants.length > 3 && (desktopCarouselPage + 1) * 3 < carouselPlants.length && (
                  <button
                    onClick={() => setDesktopCarouselPage(desktopCarouselPage + 1)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow border border-[#E0E0E0]"
                  >
                    <ChevronRight className="w-5 h-5 text-[#1B1B1B]" />
                  </button>
                )}
              </div>
            </div>

            {/* Department NC Frequency - Horizontal Bar Chart */}
            <Card className="p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-[#1B1B1B]">Action Completion by Departments</h3>
                  <div className="relative">
                    <button 
                      className="text-[#605E5C] hover:text-[#1B1B1B]"
                      onMouseEnter={() => setActiveTooltip('nc-department')}
                      onMouseLeave={() => setActiveTooltip(null)}
                    >
                      <Info size={16} />
                    </button>
                    {activeTooltip === 'nc-department' && (
                      <div className="absolute left-0 top-8 z-50 w-72 p-3 bg-white text-[#1B1B1B] text-xs rounded-lg shadow-xl border border-[#E1DFDD]">
                        <p className="font-medium mb-1">NC Count by Department</p>
                        <p className="text-[#605E5C]">Visualizes the total count of Non-Compliances across departments to identify areas requiring attention and targeted improvements.</p>
                        <div className="absolute -top-1 left-3 w-2 h-2 bg-white border-l border-t border-[#E1DFDD] transform rotate-45"></div>
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-xs text-[#605E5C]">Horizontal Bar Chart</span>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={departmentNcData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E1DFDD" horizontal={true} vertical={false} />
                    <XAxis 
                      type="number" 
                      stroke="#605E5C"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      dataKey="department" 
                      type="category" 
                      stroke="#605E5C" 
                      width={150}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid rgba(0,0,0,0.12)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value) => [`${value} NCs`, 'Count']}
                      cursor={{ fill: 'rgba(76, 172, 72, 0.1)' }}
                    />
                    <Bar dataKey="count" radius={[0, 8, 8, 0]} maxBarSize={40}>
                      {departmentNcData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Action Closure Performance Trend */}
            <Card className="p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-[#1B1B1B]">Action Closure Performance</h3>
                  <div className="relative">
                    <button 
                      className="text-[#605E5C] hover:text-[#1B1B1B]"
                      onMouseEnter={() => setActiveTooltip('action-closure')}
                      onMouseLeave={() => setActiveTooltip(null)}
                    >
                      <Info size={16} />
                    </button>
                    {activeTooltip === 'action-closure' && (
                      <div className="absolute left-0 top-8 z-50 w-72 p-3 bg-white text-[#1B1B1B] text-xs rounded-lg shadow-xl border border-[#E1DFDD]">
                        <p className="font-medium mb-1">Action Closure Performance</p>
                        <p className="text-[#605E5C]">Tracks total and closed corrective actions {selectedMonth ? 'by week' : 'by month'} to measure closure effectiveness and efficiency.</p>
                        <div className="absolute -top-1 left-3 w-2 h-2 bg-white border-l border-t border-[#E1DFDD] transform rotate-45"></div>
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-xs text-[#605E5C]">
                  {selectedMonth ? `${availableMonths.find(m => m.value === selectedMonth)?.label} ${selectedYear} (Weekly)` : `${selectedYear} (Monthly)`}
                </span>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={actionClosureData}
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E1DFDD" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#605E5C"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#605E5C"
                      tick={{ fontSize: 12 }}
                      label={{ value: 'Actions Count', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#605E5C' } }}
                    />
                    <Tooltip 
                      content={({ active, payload, label }: any) => {
                        if (active && payload && payload.length) {
                          return (
                            <div style={{
                              backgroundColor: 'white',
                              border: '1px solid rgba(0,0,0,0.12)',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                              padding: '12px'
                            }}>
                              <p style={{ color: '#1B1B1B', fontWeight: 600, marginBottom: '8px', marginTop: 0 }}>
                                {label}
                              </p>
                              {payload.map((entry: any, index: number) => (
                                <p key={index} style={{ 
                                  color: entry.dataKey === 'totalActions' ? '#0078D4' : '#4CAC48', 
                                  fontWeight: 600,
                                  margin: '4px 0'
                                }}>
                                  {entry.dataKey === 'totalActions' ? 'Total' : 'Closed'}: {entry.value}
                                </p>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '16px' }}
                      iconType="circle"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="totalActions" 
                      stroke="#0078D4" 
                      strokeWidth={3}
                      dot={{ fill: '#0078D4', r: 5, strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 7 }}
                      name="Total Actions"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="closedActions" 
                      stroke="#4CAC48" 
                      strokeWidth={3}
                      dot={{ fill: '#4CAC48', r: 5, strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 7 }}
                      name="Closed Actions"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 bg-[#E8F5E9] rounded-lg">
                <p className="text-sm text-[#1B5E20]">
                  <span className="font-medium">89.7%</span> average closure rate this period
                </p>
              </div>
            </Card>

            {/* Nested Tabs for Audits and Actions */}
            <div className="mt-6">
              <Tabs
                tabs={[
                  { id: 'audits', label: 'Audits' },
                  { id: 'actions', label: 'Actions' },
                ]}
                activeTab={overviewNestedTab}
                onTabChange={setOverviewNestedTab}
              />

              {/* Audits Tab Content */}
              {overviewNestedTab === 'audits' && (
                <div>
                  {/* Mobile: Card View */}
                  <div className="md:hidden">
                    {selectedPlantObjects.map(plant => (
                      <div key={plant.id} className="mt-[16px] mr-[0px] mb-[0px] ml-[0px]">
                        {auditsByPlant[plant.name as keyof typeof auditsByPlant]?.map(audit => 
                          renderAuditCard(audit, plant.name)
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Desktop: Single Unified Table View */}
                  <div className="hidden md:block md:bg-white md:rounded-lg md:p-4 md:border md:border-[rgba(0,0,0,0.12)] mt-[16px] mr-[0px] mb-[0px] ml-[0px]">
                    <div className="flex items-center justify-between mb-4">
                      <h3>Denied Audits</h3>
                      <span className="text-sm text-[#605E5C]">
                        {selectedPlantObjects.reduce((total, plant) => 
                          total + (auditsByPlant[plant.name as keyof typeof auditsByPlant]?.filter(audit => audit.status === 'Submitted').length || 0), 0
                        )} denied audits
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[rgba(0,0,0,0.12)]">
                            <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Audit ID</th>
                            <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Plant</th>
                            <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Date</th>
                            <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Assigned Auditor</th>
                            <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Comments</th>
                            <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Reminder</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedPlantObjects.flatMap(plant => 
                            auditsByPlant[plant.name as keyof typeof auditsByPlant]
                              ?.filter(audit => audit.status === 'Submitted')
                              .map(audit => {
                                return (
                                  <tr 
                                    key={`${plant.id}-${audit.id}`}
                                    className="border-b border-[rgba(0,0,0,0.12)]"
                                  >
                                    <td className="py-3 px-2 text-sm font-medium">{audit.id}</td>
                                    <td className="py-3 px-2 text-sm">
                                      <div className="flex items-center gap-2">
                                        <div 
                                          className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                                          style={{ backgroundColor: plant.color }}
                                        />
                                        <span>{plant.name}</span>
                                      </div>
                                    </td>
                                    <td className="py-3 px-2 text-sm text-[#605E5C]">
                                      {new Date(audit.date).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 px-2 text-sm text-[#605E5C]">{audit.auditor}</td>
                                    <td className="py-3 px-2 text-sm text-[#605E5C] max-w-xs">
                                      <div className="truncate" title={audit.denialReason || 'Not available at this time due to scheduling conflicts'}>
                                        {audit.denialReason || 'Not available at this time due to scheduling conflicts'}
                                      </div>
                                    </td>
                                    <td className="py-3 px-2">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Handle reminder action
                                        }}
                                        className="p-1.5 rounded hover:bg-[#F5F8F5] transition-colors"
                                        title="Send Reminder"
                                      >
                                        <AlertCircle size={18} className="text-[#605E5C]" />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              }) || []
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions Tab Content */}
              {overviewNestedTab === 'actions' && (
                <div>
                  {/* Mobile: Card View */}
                  <div className="md:hidden">
                    {selectedPlantObjects.map(plant => (
                      <div key={plant.id} className="mb-[24px] mt-[16px] mr-[0px] ml-[0px]">
                        {actionsByPlant[plant.name as keyof typeof actionsByPlant]?.map(action => 
                          renderActionCard(action, plant.name)
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Desktop: Table View */}
                  <div className="hidden md:block md:bg-white md:rounded-lg md:p-4 md:border md:border-[rgba(0,0,0,0.12)] mt-[16px] mr-[0px] mb-[0px] ml-[0px]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Overdue Actions</h3>
                      <span className="text-sm text-[#605E5C]">
                        {selectedPlantObjects.reduce((total, plant) => 
                          total + (actionsByPlant[plant.name as keyof typeof actionsByPlant]?.filter(action => action.status === 'Overdue').length || 0), 0
                        )} overdue actions
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[rgba(0,0,0,0.12)]">
                            <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Action ID</th>
                            <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Plant</th>
                            <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Description</th>
                            <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Department</th>
                            <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Assignee</th>
                            <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Due Date</th>
                            <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Days Overdue</th>
                            <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Status</th>
                            <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Priority</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedPlantObjects.flatMap(plant => 
                            actionsByPlant[plant.name as keyof typeof actionsByPlant]
                              ?.filter(action => action.status === 'Overdue')
                              .map(action => {
                                const daysOverdue = Math.floor((new Date().getTime() - new Date(action.dueDate).getTime()) / (1000 * 60 * 60 * 24));
                                return (
                              <tr 
                                key={`${plant.id}-${action.id}`}
                                className="border-b border-[rgba(0,0,0,0.12)] hover:bg-gray-50 cursor-pointer"
                                onClick={() => onNavigate?.('super-user-action-details', { actionId: action.id, returnTo: 'super-user', returnTab: 'actions' })}
                              >
                                <td className="py-3 px-2 text-sm font-medium">{action.id}</td>
                                <td className="py-3 px-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <div 
                                      className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                                      style={{ backgroundColor: plant.color }}
                                    />
                                    <span>{plant.name}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-2 text-sm">{action.description}</td>
                                <td className="py-3 px-2 text-sm text-[#605E5C]">{action.department}</td>
                                <td className="py-3 px-2 text-sm text-[#605E5C]">{action.assignee}</td>
                                <td className="py-3 px-2 text-sm text-[#605E5C]">
                                  {new Date(action.dueDate).toLocaleDateString()}
                                </td>
                                <td className="py-3 px-2 text-sm font-medium text-red-600">
                                  {daysOverdue} {daysOverdue === 1 ? 'day' : 'days'}
                                </td>
                                <td className="py-3 px-2">
                                  <Badge variant={getStatusBadgeVariant(action.status)}>{action.status}</Badge>
                                </td>
                                <td className="py-3 px-2">
                                  <Badge variant={getPriorityBadgeVariant(action.priority)}>{action.priority}</Badge>
                                </td>
                              </tr>
                                );
                              }) || []
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Audits View */}
        {activeView === 'audits' && (
          <div>
            {/* Mobile: Search and Filter Bar */}
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
                {(auditFilters.status || auditFilters.auditor || auditFilters.dateFrom || auditFilters.dateTo) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
                )}
              </button>
            </div>

            {/* Mobile: Card View */}
            <div className="md:hidden">
              {selectedPlantObjects.map(plant => (
                <div key={plant.id}>
                  {auditsByPlant[plant.name as keyof typeof auditsByPlant]?.map(audit => 
                    renderAuditCard(audit, plant.name)
                  )}
                </div>
              ))}
            </div>

            {/* Desktop: Search and Filters - Outside Container */}
            <div className="hidden md:flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex gap-2 w-full md:flex-1">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#605E5C]" />
                  <Input 
                    placeholder="Search audits..." 
                    className="pl-10 w-full" 
                    value={auditSearchQuery}
                    onChange={(e) => setAuditSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Select 
                  className="w-32"
                  value={auditFilters.status}
                  onChange={(e) => setAuditFilters({...auditFilters, status: e.target.value})}
                >
                  <option value="">All Status</option>
                  <option value="Not Started">Not Started</option>
                  <option value="Denied">Denied</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Completed">Completed</option>
                </Select>
                <Select 
                  className="w-36"
                  value={auditFilters.auditor}
                  onChange={(e) => setAuditFilters({...auditFilters, auditor: e.target.value})}
                >
                  <option value="">All Auditors</option>
                  <option value="John Smith">John Smith</option>
                  <option value="Sarah Johnson">Sarah Johnson</option>
                  <option value="Mike Davis">Mike Davis</option>
                </Select>
                {(auditSearchQuery || auditFilters.status || auditFilters.auditor) && (
                  <Button 
                    variant="ghost"
                    onClick={() => {
                      setAuditSearchQuery('');
                      setAuditFilters({ department: '', layer: '', status: '', auditor: '', dateFrom: '', dateTo: '' });
                    }}
                  >
                    <X size={16} className="mr-2"/> Clear All
                  </Button>
                )}
                <Button variant="secondary">
                  <Download size={16} className="mr-2"/> Export
                </Button>
              </div>
            </div>

            {/* Desktop: Single Unified Table View */}
            <div className="hidden md:block md:bg-white md:rounded-lg md:p-4 md:border md:border-[rgba(0,0,0,0.12)]">
              <div className="flex items-center justify-between mb-4">
                <h3>All Audits</h3>
                <span className="text-sm text-[#605E5C]">
                  {selectedPlantObjects.reduce((total, plant) => {
                    const filteredAudits = auditsByPlant[plant.name as keyof typeof auditsByPlant]?.filter(audit => {
                      const matchesSearch = !auditSearchQuery || 
                        audit.id.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
                        audit.department.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
                        audit.auditor.toLowerCase().includes(auditSearchQuery.toLowerCase());
                      const matchesStatus = !auditFilters.status || audit.status === auditFilters.status;
                      const matchesAuditor = !auditFilters.auditor || audit.auditor === auditFilters.auditor;
                      return matchesSearch && matchesStatus && matchesAuditor;
                    }) || [];
                    return total + filteredAudits.length;
                  }, 0)} audits
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[rgba(0,0,0,0.12)]">
                      <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Audit ID</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Plant</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Date</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Auditor</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Status</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Compliant</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">NC Count</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">N/A Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPlantObjects.flatMap(plant => 
                      auditsByPlant[plant.name as keyof typeof auditsByPlant]
                        ?.filter(audit => {
                          const matchesSearch = !auditSearchQuery || 
                            audit.id.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
                            audit.department.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
                            audit.auditor.toLowerCase().includes(auditSearchQuery.toLowerCase());
                          const matchesStatus = !auditFilters.status || audit.status === auditFilters.status;
                          const matchesAuditor = !auditFilters.auditor || audit.auditor === auditFilters.auditor;
                          return matchesSearch && matchesStatus && matchesAuditor;
                        })
                        .map(audit => {
                          const showCounts = ['In Progress', 'Submitted', 'Completed'].includes(audit.status);
                          return (
                            <tr 
                              key={`${plant.id}-${audit.id}`}
                              onClick={() => onNavigate?.('super-user-audit-detail', { auditId: audit.id, returnTo: 'super-user', returnTab: 'audits' })}
                              className="border-b border-[rgba(0,0,0,0.12)] hover:bg-gray-50 cursor-pointer"
                            >
                              <td className="py-3 px-2 text-sm font-medium">{audit.id}</td>
                              <td className="py-3 px-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                                    style={{ backgroundColor: plant.color }}
                                  />
                                  <span>{plant.name}</span>
                                </div>
                              </td>
                              <td className="py-3 px-2 text-sm text-[#605E5C]">
                                {new Date(audit.date).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-2 text-sm text-[#605E5C]">{audit.auditor}</td>
                              <td className="py-3 px-2 text-sm">
                                <Badge variant={getStatusBadgeVariant(audit.status)}>{audit.status}</Badge>
                              </td>
                              <td className="py-3 px-2 text-sm text-[#4CAC48]">{showCounts ? audit.compliantCount : '-'}</td>
                              <td className="py-3 px-2 text-sm text-[#D13438]">{showCounts ? audit.ncCount : '-'}</td>
                              <td className="py-3 px-2 text-sm text-[#605E5C]">{showCounts ? audit.naCount : '-'}</td>
                            </tr>
                          );
                        }) || []
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Actions View */}
        {activeView === 'actions' && (
          <div>
            {/* Mobile: Search and Filter Bar */}
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
                onClick={() => setIsActionFilterDialogOpen(true)}
                className="relative flex items-center justify-center w-11 h-11 bg-white border border-[rgba(0,0,0,0.12)] rounded text-[#605E5C] hover:bg-gray-50 flex-shrink-0"
              >
                <Filter size={20} />
                {(actionFilters.status || actionFilters.priority || actionFilters.assignee || actionFilters.dateFrom || actionFilters.dateTo) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
                )}
              </button>
            </div>

            {/* Mobile: Card View */}
            <div className="md:hidden">
              {selectedPlantObjects.map(plant => (
                <div key={plant.id} className="mb-6">
                  {actionsByPlant[plant.name as keyof typeof actionsByPlant]?.map(action => 
                    renderActionCard(action, plant.name)
                  )}
                </div>
              ))}
            </div>

            {/* Desktop: Search and Filters - Outside Container */}
            <div className="hidden md:flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex gap-2 w-full md:flex-1">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#605E5C]" />
                  <Input 
                    placeholder="Search actions..." 
                    className="pl-10 w-full" 
                    value={actionSearchQuery}
                    onChange={(e) => setActionSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Select 
                  className="w-32"
                  value={actionFilters.status}
                  onChange={(e) => setActionFilters({...actionFilters, status: e.target.value})}
                >
                  <option value="">All Status</option>
                  <option value="Open">Open</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Closed">Closed</option>
                </Select>
                <Select 
                  className="w-32"
                  value={actionFilters.priority}
                  onChange={(e) => setActionFilters({...actionFilters, priority: e.target.value})}
                >
                  <option value="">All Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </Select>
                {(actionSearchQuery || actionFilters.status || actionFilters.priority) && (
                  <Button 
                    variant="ghost"
                    onClick={() => {
                      setActionSearchQuery('');
                      setActionFilters({ department: '', status: '', priority: '', assignee: '', dateFrom: '', dateTo: '' });
                    }}
                  >
                    <X size={16} className="mr-2"/> Clear All
                  </Button>
                )}
                <Button variant="secondary">
                  <Download size={16} className="mr-2"/> Export
                </Button>
              </div>
            </div>

            {/* Desktop: Table View */}
            <div className="hidden md:block md:bg-white md:rounded-lg md:p-4 md:border md:border-[rgba(0,0,0,0.12)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">All Actions</h3>
                <span className="text-sm text-[#605E5C]">
                  {selectedPlantObjects.reduce((total, plant) => {
                    const filteredActions = actionsByPlant[plant.name as keyof typeof actionsByPlant]?.filter(action => {
                      const matchesSearch = !actionSearchQuery || 
                        action.id.toLowerCase().includes(actionSearchQuery.toLowerCase()) ||
                        action.description.toLowerCase().includes(actionSearchQuery.toLowerCase()) ||
                        action.department.toLowerCase().includes(actionSearchQuery.toLowerCase()) ||
                        action.assignee.toLowerCase().includes(actionSearchQuery.toLowerCase());
                      const matchesStatus = !actionFilters.status || action.status === actionFilters.status;
                      const matchesPriority = !actionFilters.priority || action.priority === actionFilters.priority;
                      return matchesSearch && matchesStatus && matchesPriority;
                    }) || [];
                    return total + filteredActions.length;
                  }, 0)} actions
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[rgba(0,0,0,0.12)]">
                      <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Action ID</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Plant</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Department</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Assignee</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Due Date</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Status</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-[#605E5C]">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPlantObjects.flatMap(plant => 
                      actionsByPlant[plant.name as keyof typeof actionsByPlant]
                        ?.filter(action => {
                          const matchesSearch = !actionSearchQuery || 
                            action.id.toLowerCase().includes(actionSearchQuery.toLowerCase()) ||
                            action.description.toLowerCase().includes(actionSearchQuery.toLowerCase()) ||
                            action.department.toLowerCase().includes(actionSearchQuery.toLowerCase()) ||
                            action.assignee.toLowerCase().includes(actionSearchQuery.toLowerCase());
                          const matchesStatus = !actionFilters.status || action.status === actionFilters.status;
                          const matchesPriority = !actionFilters.priority || action.priority === actionFilters.priority;
                          return matchesSearch && matchesStatus && matchesPriority;
                        })
                        .map(action => (
                        <tr 
                          key={`${plant.id}-${action.id}`}
                          className="border-b border-[rgba(0,0,0,0.12)] hover:bg-gray-50 cursor-pointer"
                          onClick={() => onNavigate?.('super-user-action-details', { actionId: action.id, returnTo: 'super-user', returnTab: 'actions' })}
                        >
                          <td className="py-3 px-2 text-sm font-medium">{action.id}</td>
                          <td className="py-3 px-2 text-sm">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                                style={{ backgroundColor: plant.color }}
                              />
                              <span>{plant.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-sm text-[#605E5C]">{action.department}</td>
                          <td className="py-3 px-2 text-sm text-[#605E5C]">{action.assignee}</td>
                          <td className="py-3 px-2 text-sm text-[#605E5C]">
                            {new Date(action.dueDate).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-2">
                            <Badge variant={getStatusBadgeVariant(action.status)}>{action.status}</Badge>
                          </td>
                          <td className="py-3 px-2">
                            <Badge variant={getPriorityBadgeVariant(action.priority)}>{action.priority}</Badge>
                          </td>
                        </tr>
                      )) || []
                    )}
                  </tbody>
                </table>
              </div>
            </div>
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

      {/* Audit Filter Dialog */}
      <Dialog open={isAuditFilterDialogOpen} onOpenChange={setIsAuditFilterDialogOpen}>
        <DialogContent className="max-w-md sm:max-w-md fixed bottom-0 top-auto translate-y-0 data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom rounded-t-2xl rounded-b-none max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Filter Audits</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1B1B1B]">Status</label>
              <select
                value={auditFilters.status}
                onChange={(e) => setAuditFilters({ ...auditFilters, status: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[rgba(0,0,0,0.12)] rounded text-sm text-[#1B1B1B] focus:outline-none focus:ring-2 focus:ring-[#4CAC48]"
              >
                <option value="">All Statuses</option>
                <option value="Not Started">Not Started</option>
                <option value="Denied">Denied</option>
                <option value="In Progress">In Progress</option>
                <option value="Submitted">Submitted</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Auditor Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1B1B1B]">Auditor</label>
              <select
                value={auditFilters.auditor}
                onChange={(e) => setAuditFilters({ ...auditFilters, auditor: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[rgba(0,0,0,0.12)] rounded text-sm text-[#1B1B1B] focus:outline-none focus:ring-2 focus:ring-[#4CAC48]"
              >
                <option value="">All Auditors</option>
                <option value="John Smith">John Smith</option>
                <option value="Sarah Johnson">Sarah Johnson</option>
                <option value="Mike Davis">Mike Davis</option>
                <option value="Emily Chen">Emily Chen</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1B1B1B]">From Date</label>
                <Input
                  type="date"
                  value={auditFilters.dateFrom}
                  onChange={(e) => setAuditFilters({ ...auditFilters, dateFrom: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1B1B1B]">To Date</label>
                <Input
                  type="date"
                  value={auditFilters.dateTo}
                  onChange={(e) => setAuditFilters({ ...auditFilters, dateTo: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setAuditFilters({
                  department: '',
                  layer: '',
                  status: '',
                  auditor: '',
                  dateFrom: '',
                  dateTo: '',
                });
              }}
            >
              Clear All
            </Button>
            <Button
              onClick={() => setIsAuditFilterDialogOpen(false)}
            >
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Filter Dialog */}
      <Dialog open={isActionFilterDialogOpen} onOpenChange={setIsActionFilterDialogOpen}>
        <DialogContent className="max-w-md sm:max-w-md fixed bottom-0 top-auto translate-y-0 data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom rounded-t-2xl rounded-b-none max-h-[85vh] overflow-y-auto">
          <DialogHeader className="mt-[0px] mr-[0px] mb-[-20px] ml-[0px]">
            <DialogTitle>Filter Actions</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1B1B1B]">Status</label>
              <select
                value={actionFilters.status}
                onChange={(e) => setActionFilters({ ...actionFilters, status: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[rgba(0,0,0,0.12)] rounded text-sm text-[#1B1B1B] focus:outline-none focus:ring-2 focus:ring-[#4CAC48]"
              >
                <option value="">All Statuses</option>
                <option value="Submitted">Submitted</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1B1B1B]">Priority</label>
              <select
                value={actionFilters.priority}
                onChange={(e) => setActionFilters({ ...actionFilters, priority: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[rgba(0,0,0,0.12)] rounded text-sm text-[#1B1B1B] focus:outline-none focus:ring-2 focus:ring-[#4CAC48]"
              >
                <option value="">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Assignee Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1B1B1B]">Assignee</label>
              <select
                value={actionFilters.assignee}
                onChange={(e) => setActionFilters({ ...actionFilters, assignee: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[rgba(0,0,0,0.12)] rounded text-sm text-[#1B1B1B] focus:outline-none focus:ring-2 focus:ring-[#4CAC48]"
              >
                <option value="">All Assignees</option>
                <option value="John Smith">John Smith</option>
                <option value="Sarah Johnson">Sarah Johnson</option>
                <option value="Mike Davis">Mike Davis</option>
                <option value="Emily Chen">Emily Chen</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1B1B1B]">From Date</label>
                <Input
                  type="date"
                  value={actionFilters.dateFrom}
                  onChange={(e) => setActionFilters({ ...actionFilters, dateFrom: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1B1B1B]">To Date</label>
                <Input
                  type="date"
                  value={actionFilters.dateTo}
                  onChange={(e) => setActionFilters({ ...actionFilters, dateTo: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setActionFilters({
                  department: '',
                  status: '',
                  priority: '',
                  assignee: '',
                  dateFrom: '',
                  dateTo: '',
                });
              }}
            >
              Clear All
            </Button>
            <Button
              onClick={() => setIsActionFilterDialogOpen(false)}
            >
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}