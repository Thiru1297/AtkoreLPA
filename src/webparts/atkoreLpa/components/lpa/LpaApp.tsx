// @ts-nocheck
import { useEffect, useState } from 'react';
import { AppRole } from '../../services/LpaTypes';
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
import { CustomFooter } from './components/CustomFooter';
import { Modal } from './components/Modal';
import { Button } from './components/Button';
import { useLpaAppContext } from '../../context/LpaAppContext';

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

interface ILpaAppProps {
  initialRole?: AppRole;
  userDisplayName: string;
}

export default function LpaApp(props: ILpaAppProps) {
  const { role, setRole } = useLpaAppContext();
  const [navState, setNavState] = useState<NavigationState>({ page: 'role-selection' });
  const [history, setHistory] = useState<NavigationState[]>([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);

  const getHomePageForRole = (selectedRole: AppRole): PageType => {
    switch (selectedRole) {
      case 'auditor':
        return 'auditor-home';
      case 'department-owner':
        return 'department-dashboard';
      case 'plant-manager':
        return 'plant-dashboard';
      case 'super-user':
        return 'super-admin';
      default:
        return 'role-selection';
    }
  };

  const roleAccess: Record<AppRole, PageType[]> = {
    'auditor': ['auditor-home', 'audit-details', 'questionnaire', 'review', 'audit-summary', 'role-selection', 'role-loading', 'design-system'],
    'department-owner': ['department-dashboard', 'my-actions', 'action-details', 'role-selection', 'role-loading', 'design-system'],
    'plant-manager': ['plant-dashboard', 'audit-detail', 'plant-manager-action-details', 'multi-plant-comparison', 'role-selection', 'role-loading', 'design-system'],
    'super-user': ['super-admin', 'super-user', 'super-user-action-details', 'super-user-audit-summary', 'super-user-audit-detail', 'multi-plant-comparison', 'role-selection', 'role-loading', 'design-system']
  };

  const canNavigateTo = (page: PageType): boolean => {
    if (!role) {
      return true;
    }
    const allowed: PageType[] = roleAccess[role] || [];
    return allowed.includes(page);
  };

  const navigate = (page: PageType, params?: any) => {
    if (!canNavigateTo(page)) {
      return;
    }
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
    setRole(undefined);
    setNavState({ page: 'role-selection' });
    setHistory([]);
  };

  const navigateToRoleHome = () => {
    const activeRole = (role || navState.selectedRole) as AppRole | undefined;
    if (!activeRole) {
      setNavState({ page: 'role-selection' });
      setHistory([]);
      return;
    }

    const homePage = getHomePageForRole(activeRole);
    setNavState({ page: homePage, selectedRole: activeRole });
    setHistory([]);
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleNavigateHomeFromLogout = () => {
    setIsLogoutModalOpen(false);
    navigateToRoleHome();
  };

  const handleCloseTabFromLogout = () => {
    setIsLogoutModalOpen(false);
    window.open('', '_self');
    window.close();
  };

  const handleRoleSelection = (role: string) => {
    setRole(role as AppRole);
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

  useEffect(() => {
    if (!props.initialRole || navState.page !== 'role-selection') {
      return;
    }
    setRole(props.initialRole);
    const homePage: PageType = getHomePageForRole(props.initialRole);
    setNavState({ page: homePage, selectedRole: props.initialRole });
    setHistory([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.initialRole]);

  useEffect(() => {
    if (!role || navState.page === 'role-selection' || navState.page === 'role-loading') {
      return;
    }

    if (!canNavigateTo(navState.page)) {
      setNavState({ page: 'role-selection' });
      setHistory([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, navState.page]);

  const renderPage = () => {
    switch (navState.page) {
      case 'role-selection':
        return <RoleSelection onSelectRole={handleRoleSelection} />;

      case 'role-loading':
        return <RoleLoadingScreen role={navState.selectedRole || 'auditor'} />;

      case 'design-system':
        return <DesignSystem onExit={handleLogoutClick} />;

      case 'auditor-home':
        return <AuditorHome onNavigate={navigate} onExit={handleLogoutClick} />;

      case 'audit-details':
        return (
          <AuditDetails
            auditId={navState.auditId || 'AUD-2025-001'}
            onNavigate={navigate}
            onBack={goBack}
            onExit={handleLogoutClick}
          />
        );

      case 'questionnaire':
        return (
          <Questionnaire
            auditId={navState.auditId || 'AUD-2025-001'}
            onNavigate={navigate}
            onBack={goBack}
            onExit={handleLogoutClick}
          />
        );

      case 'review':
        return (
          <AuditReview
            auditId={navState.auditId || 'AUD-2025-001'}
            onNavigate={navigate}
            onBack={goBack}
            onExit={handleLogoutClick}
          />
        );

      case 'audit-summary':
        return (
          <AuditSummary
            auditId={navState.auditId || 'AUD-2025-001'}
            onNavigate={navigate}
            onBack={goBack}
            onExit={handleLogoutClick}
          />
        );

      case 'department-dashboard':
        return <DepartmentOwnerDashboard onNavigate={navigate} onExit={handleLogoutClick} />;

      case 'my-actions':
        return <DepartmentOwnerDashboard onNavigate={navigate} onExit={handleLogoutClick} />;

      case 'action-details':
        return (
          <ActionDetails
            actionId={navState.actionId || 'ACT-2025-045'}
            onNavigate={navigate}
            onBack={goBack}
            onExit={handleLogoutClick}
          />
        );

      case 'plant-dashboard':
        return <PlantManagerDashboard onNavigate={navigate} onExit={handleLogoutClick} />;

      case 'plant-manager-action-details':
        return (
          <PlantManagerActionDetails
            actionId={navState.actionId || 'ACT-2025-045'}
            onNavigate={navigate}
            onBack={goBack}
            onExit={handleLogoutClick}
          />
        );

      case 'audit-detail':
        return (
          <AuditDetailPage
            auditId={navState.auditId || 'AUD-2025-001'}
            onBack={goBack}
            onExit={handleLogoutClick}
            onNavigateToAction={(actionId) => navigate('plant-manager-action-details', { actionId })}
          />
        );

      case 'super-admin':
        return <SuperUserAdmin onExit={handleLogoutClick} onNavigate={navigate} />;

      case 'super-user':
        return <SuperUserAdmin onExit={handleLogoutClick} onNavigate={navigate} activeTab={navState.activeTab} />;

      case 'super-user-action-details':
        return (
          <SuperUserActionDetails
            actionId={navState.actionId || 'ACT-2025-045'}
            onNavigate={navigate}
            onBack={goBack}
            onExit={handleLogoutClick}
          />
        );

      case 'super-user-audit-summary':
        return (
          <SuperUserAuditSummary
            auditId={navState.auditId || 'AUD-2025-056'}
            returnTo={navState.returnTo}
            returnTab={navState.returnTab}
            onNavigate={navigate}
            onExit={handleLogoutClick}
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
            onExit={handleLogoutClick}
          />
        );

      case 'multi-plant-comparison':
        return <MultiPlantComparison onExit={handleLogoutClick} />;

      default:
        return <RoleSelection onSelectRole={handleRoleSelection} />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#FAF9F8]">
      <SharePointHeader />
      <div className="flex-1 md:pt-[48px]">
        {renderPage()}
      </div>
      <CustomFooter />

      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Logout Options"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#1B1B1B]">
            Choose what you want to do next.
          </p>

          <div className="rounded-lg border border-[#D4EAD3] bg-[#EEF7EE] p-3">
            <p className="text-sm text-[#2D5A29]">
              You can either return to your role home page/dashboard or close the current tab.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <Button variant="primary" onClick={handleNavigateHomeFromLogout} className="w-full">
              Go to Home / Dashboard
            </Button>
            <Button variant="destructive" onClick={handleCloseTabFromLogout} className="w-full">
              Close Current Tab
            </Button>
            <Button variant="secondary" onClick={() => setIsLogoutModalOpen(false)} className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
