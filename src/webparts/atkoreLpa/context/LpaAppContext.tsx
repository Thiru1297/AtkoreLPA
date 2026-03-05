import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { LpaSharePointService } from '../services/LpaSharePointService';
import { AppRole, IUserRoleMappingItem } from '../services/LpaTypes';

interface ILpaAppContextValue {
  context: WebPartContext;
  userDisplayName: string;
  service: LpaSharePointService;
  role?: AppRole;
  roleMapping?: IUserRoleMappingItem;
  setRole: (role?: AppRole) => void;
}

const LpaAppContext: React.Context<ILpaAppContextValue | undefined> = React.createContext<ILpaAppContextValue | undefined>(undefined);

interface ILpaAppProviderProps {
  context: WebPartContext;
  userDisplayName: string;
  roleMapping?: IUserRoleMappingItem;
  children: React.ReactNode;
}

const roleMap: Record<string, AppRole> = {
  Auditor: 'auditor',
  auditor: 'auditor',
  DepartmentOwner: 'department-owner',
  departmentowner: 'department-owner',
  PlantManager: 'plant-manager',
  PlantManage: 'plant-manager',
  plantmanager: 'plant-manager',
  plantmanage: 'plant-manager',
  SuperUser: 'super-user',
  superuser: 'super-user'
};

const resolveAppRole = (roleValue: string | undefined): AppRole | undefined => {
  const normalized: string = String(roleValue || '').trim().toLowerCase().replace(/[\s_-]+/g, '');
  const normalizedRoleMap: Record<string, AppRole> = {
    auditor: 'auditor',
    departmentowner: 'department-owner',
    plantmanager: 'plant-manager',
    plantmanage: 'plant-manager',
    superuser: 'super-user'
  };

  return normalizedRoleMap[normalized] || roleMap[roleValue || ''];
};

export const LpaAppProvider: React.FC<ILpaAppProviderProps> = (props: ILpaAppProviderProps) => {
  const service: LpaSharePointService = React.useMemo(() => new LpaSharePointService(props.context), [props.context]);
  const defaultRole: AppRole | undefined = resolveAppRole(props.roleMapping?.Role);
  const [role, setRole] = React.useState<AppRole | undefined>(defaultRole);

  React.useEffect(() => {
    setRole(defaultRole);
  }, [defaultRole]);

  const value: ILpaAppContextValue = {
    context: props.context,
    userDisplayName: props.userDisplayName,
    service,
    role,
    roleMapping: props.roleMapping,
    setRole
  };

  return <LpaAppContext.Provider value={value}>{props.children}</LpaAppContext.Provider>;
};

export const useLpaAppContext = (): ILpaAppContextValue => {
  const value: ILpaAppContextValue | undefined = React.useContext(LpaAppContext);
  if (!value) {
    throw new Error('useLpaAppContext must be used inside LpaAppProvider');
  }
  return value;
};
