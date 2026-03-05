import { useState, useEffect } from 'react';
import { RoleSelection } from './components/pages/RoleSelection';
import { RoleLoadingScreen } from './components/pages/RoleLoadingScreen';
import { DesignSystem } from './components/pages/DesignSystem';
import { AuditorHome } from './components/pages/AuditorHome';
import { AuditDetails } from './components/pages/AuditDetails';
import { Questionnaire } from './components/pages/Questionnaire';
import { AuditReview } from './components/pages/AuditReview';
import { AuditSummary } from './components/pages/AuditSummary';
import { DepartmentOwnerDashboard } from './components/pages/DepartmentOwnerDashboard';
import { ActionDetails } from './components/pages/ActionDetails';
import { PlantManagerDashboard } from './components/pages/PlantManagerDashboard';
import { PlantManagerActionDetails } from './components/pages/PlantManagerActionDetails';
import { SuperUserAdmin } from './components/pages/SuperUserAdmin';
import { SuperUserActionDetails } from './components/pages/SuperUserActionDetails';
import { SuperUserAuditSummary } from './components/pages/SuperUserAuditSummary';
import { SuperUserAuditDetail } from './components/pages/SuperUserAuditDetail';
import { MultiPlantComparison } from './components/pages/MultiPlantComparison';
import { AuditDetailPage } from './components/pages/AuditDetailPage';
import { SharePointHeader } from './components/SharePointHeader';

type PageType = 
  | 'role-selection'
  | 'role-loading'
  | 'design-system'
  | 'auditor-home'
  | 'audit-details'
  | 'questionnaire'
  | 'review'
  | 'audit-summary'
  | 'department-dashboard'
  | 'my-actions'
  | 'action-details'
  | 'plant-dashboard'
  | 'plant-manager-action-details'
  | 'audit-detail'
  | 'super-admin'
  | 'super-user'
  | 'super-user-action-details'
  | 'super-user-audit-summary'
  | 'super-user-audit-detail'
  | 'multi-plant-comparison';

interface NavigationState {
  page: PageType;
  auditId?: string;
  actionId?: string;
  selectedRole?: string;
  returnTo?: string;
  returnTab?: string;
  activeTab?: string;
}

export default function App() {
  const [navState, setNavState] = useState<NavigationState>({ page: 'role-selection' });
  const [history, setHistory] = useState<NavigationState[]>([]);

  const navigate = (page: PageType, params?: any) => {
    setHistory([...history, navState]);
    
    // Handle different parameter types
    const id = typeof params === 'string' ? params : params?.auditId || params?.actionId;
    
    setNavState({
      page,
      auditId: (page === 'audit-details' || page === 'questionnaire' || page === 'review' || page === 'audit-summary' || page === 'audit-detail' || page === 'super-user-audit-summary' || page === 'super-user-audit-detail') ? id : undefined,
      actionId: page === 'action-details' || page === 'plant-manager-action-details' || page === 'super-user-action-details' ? id : undefined,
      selectedRole: navState.selectedRole,
      returnTo: params?.returnTo,
      returnTab: params?.returnTab,
      activeTab: params?.activeTab,
    });
  };

  const goBack = () => {
    if (history.length > 0) {
      const previous = history[history.length - 1];
      setNavState(previous);
      setHistory(history.slice(0, -1));
    }
  };

  const exitToRoleSelection = () => {
    setNavState({ page: 'role-selection' });
    setHistory([]);
  };

  const handleRoleSelection = (role: string) => {
    // Show loading screen first
    setNavState({ page: 'role-loading', selectedRole: role });
    
    // Simulate data loading (1.5-2 seconds)
    setTimeout(() => {
      switch (role) {
        case 'auditor':
          navigate('auditor-home');
          break;
        case 'department-owner':
          navigate('department-dashboard');
          break;
        case 'plant-manager':
          navigate('plant-dashboard');
          break;
        case 'super-user':
          navigate('super-admin');
          break;
        case 'design-system':
          navigate('design-system');
          break;
      }
    }, 1800); // 1.8 seconds - feels fast but not rushed
  };

  const renderPage = () => {
    switch (navState.page) {
      case 'role-selection':
        return <RoleSelection onSelectRole={handleRoleSelection} />;
      
      case 'role-loading':
        return <RoleLoadingScreen role={navState.selectedRole || 'auditor'} />;
      
      case 'design-system':
        return <DesignSystem onExit={exitToRoleSelection} />;
      
      case 'auditor-home':
        return <AuditorHome onNavigate={navigate} onExit={exitToRoleSelection} />;
      
      case 'audit-details':
        return (
          <AuditDetails 
            auditId={navState.auditId || 'AUD-2025-001'} 
            onNavigate={navigate}
            onBack={goBack}
            onExit={exitToRoleSelection}
          />
        );
      
      case 'questionnaire':
        return (
          <Questionnaire 
            auditId={navState.auditId || 'AUD-2025-001'} 
            onNavigate={navigate}
            onBack={goBack}
            onExit={exitToRoleSelection}
          />
        );
      
      case 'review':
        return (
          <AuditReview 
            auditId={navState.auditId || 'AUD-2025-001'} 
            onNavigate={navigate}
            onBack={goBack}
            onExit={exitToRoleSelection}
          />
        );
      
      case 'audit-summary':
        return (
          <AuditSummary 
            auditId={navState.auditId || 'AUD-2025-001'} 
            onNavigate={navigate}
            onBack={goBack}
            onExit={exitToRoleSelection}
          />
        );
      
      case 'department-dashboard':
        return <DepartmentOwnerDashboard onNavigate={navigate} onExit={exitToRoleSelection} />;
      
      case 'my-actions':
        return <DepartmentOwnerDashboard onNavigate={navigate} onExit={exitToRoleSelection} />;
      
      case 'action-details':
        return (
          <ActionDetails 
            actionId={navState.actionId || 'ACT-2025-045'} 
            onNavigate={navigate}
            onBack={goBack}
            onExit={exitToRoleSelection}
          />
        );
      
      case 'plant-dashboard':
        return <PlantManagerDashboard onNavigate={navigate} onExit={exitToRoleSelection} />;
      
      case 'plant-manager-action-details':
        return (
          <PlantManagerActionDetails 
            actionId={navState.actionId || 'ACT-2025-045'} 
            onNavigate={navigate}
            onBack={goBack}
            onExit={exitToRoleSelection}
          />
        );
      
      case 'audit-detail':
        return (
          <AuditDetailPage 
            auditId={navState.auditId || 'AUD-2025-001'} 
            onBack={goBack}
            onExit={exitToRoleSelection}
            onNavigateToAction={(actionId) => navigate('plant-manager-action-details', { actionId })}
          />
        );
      
      case 'super-admin':
        return <SuperUserAdmin onExit={exitToRoleSelection} onNavigate={navigate} />;
      
      case 'super-user':
        return <SuperUserAdmin onExit={exitToRoleSelection} onNavigate={navigate} activeTab={navState.activeTab} />;
      
      case 'super-user-action-details':
        return (
          <SuperUserActionDetails 
            actionId={navState.actionId || 'ACT-2025-045'} 
            onNavigate={navigate}
            onBack={goBack}
            onExit={exitToRoleSelection}
          />
        );
      
      case 'super-user-audit-summary':
        return (
          <SuperUserAuditSummary 
            auditId={navState.auditId || 'AUD-2025-056'}
            returnTo={navState.returnTo}
            returnTab={navState.returnTab}
            onNavigate={navigate}
            onExit={exitToRoleSelection}
          />
        );
      
      case 'super-user-audit-detail':
        return (
          <SuperUserAuditDetail 
            auditId={navState.auditId || 'AUD-2025-056'}
            returnTo={navState.returnTo}
            returnTab={navState.returnTab}
            onBack={() => navigate('super-user', { activeTab: navState.returnTab || 'audits' })}
            onNavigateToAction={(actionId) => navigate('super-user-action-details', { actionId, returnTo: 'super-user-audit-detail', returnTab: navState.returnTab })}
            onExit={exitToRoleSelection}
          />
        );
      
      case 'multi-plant-comparison':
        return <MultiPlantComparison onExit={exitToRoleSelection} />;
      
      default:
        return <RoleSelection onSelectRole={handleRoleSelection} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F8]">
      <SharePointHeader />
      <div className="md:pt-[48px]">
        {renderPage()}
      </div>
    </div>
  );
}