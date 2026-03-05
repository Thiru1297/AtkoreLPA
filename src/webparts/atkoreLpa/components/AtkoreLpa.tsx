import * as React from 'react';
import type { IAtkoreLpaProps } from './IAtkoreLpaProps';
import LpaApp from './lpa/LpaApp';
import { LpaSharePointService } from '../services/LpaSharePointService';
import { AppRole, IUserRoleMappingItem } from '../services/LpaTypes';
import { LpaAppProvider } from '../context/LpaAppContext';
import styles from './AtkoreLpa.module.scss';
import './lpa/lpa.css';

const roleMap: Record<string, AppRole> = {
  auditor: 'auditor',
  departmentowner: 'department-owner',
  plantmanager: 'plant-manager',
  superuser: 'super-user'
};

const resolveAppRole = (roleValue: string | undefined): AppRole | undefined => {
  const normalized: string = String(roleValue || '').trim().toLowerCase().replace(/[\s_-]+/g, '');
  if (!normalized) {
    return undefined;
  }

  const normalizedRoleMap: Record<string, AppRole> = {
    auditor: 'auditor',
    departmentowner: 'department-owner',
    plantmanager: 'plant-manager',

    superuser: 'super-user'
  };

  return normalizedRoleMap[normalized] || roleMap[roleValue || ''];
};

const AtkoreLpa: React.FC<IAtkoreLpaProps> = ({ context, userDisplayName }) => {
  const [roleMapping, setRoleMapping] = React.useState<IUserRoleMappingItem | undefined>(undefined);
  const [initialRole, setInitialRole] = React.useState<AppRole | undefined>(undefined);
  const [roleResolutionCompleted, setRoleResolutionCompleted] = React.useState<boolean>(false);

  React.useEffect(() => {
    let mounted = true;
    const service: LpaSharePointService = new LpaSharePointService(context);

    service
      .getCurrentUserRole()
      .then((mapping) => {
        setRoleMapping(mapping);
        if (!mounted || !mapping?.Role) {
          return;
        }

        const mappedRole: AppRole | undefined = resolveAppRole(mapping.Role);
        if (mappedRole) {
          setInitialRole(mappedRole);
        }
      })
      .catch(() => {
        // Fall back to role selection when mapping is unavailable.
      })
      .finally(() => {
        if (mounted) {
          setRoleResolutionCompleted(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, [context]);

  return (
    <div className={styles.atkoreLpaAppRoot}>
      <LpaAppProvider context={context} userDisplayName={userDisplayName} roleMapping={roleMapping}>
        {!roleResolutionCompleted ? (
          <div className="flex min-h-screen items-center justify-center bg-[#F2F4F4]">
            <div className="text-sm text-[#1F2937]">Loading role access...</div>
          </div>
        ) : !initialRole ? (
          <div className="flex min-h-screen items-center justify-center bg-[#F2F4F4] p-4">
            <div className="w-full max-w-md rounded-2xl border border-[#D1D5DB] bg-white p-6 text-center">
              <div className="text-xl font-semibold text-[#111827]">Role Access Required</div>
              <div className="mt-2 text-sm text-[#374151]">
                Your account is not mapped to an active role in UserRoleMapping.{roleMapping}
              </div>
            </div>
          </div>
        ) : (
          <LpaApp initialRole={initialRole} userDisplayName={userDisplayName} />
        )}
      </LpaAppProvider>
    </div>
  );
};

export default AtkoreLpa;
