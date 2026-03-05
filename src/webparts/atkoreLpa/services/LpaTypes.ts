export type AppRole =
  | 'auditor'
  | 'department-owner'
  | 'plant-manager'
  | 'super-user';

export interface IUserRoleMappingItem {
  Id: number;
  Role: string;
  AuditorType?: string;
  DepartmentAssignmentMode?: string;
  IsActive?: boolean;
  Plant?: {
    Id: number;
    Title: string;
  };
  PrimaryDepartment?: {
    Id: number;
    Title: string;
  };
  Title?: {
    EMail?: string;
    Title?: string;
  };
  User?: {
    EMail?: string;
    Title?: string;
  };
}

export interface IAuditInstanceItem {
  Id: number;
  Title: string;
  Status?: string;
  DueDate?: string;
  PlantName?: string;
  DepartmentName?: string;
  AssignedAuditorEmail?: string;
  Raw?: Record<string, unknown>;
}

export interface IAuditQuestionItem {
  Id: number;
  Title: string;
  Category?: string;
  DepartmentName?: string;
  QuestionText?: string;
  Instructions?: string;
  IsEvidenceRequired?: boolean;
  MaxPhotos?: number;
  Sequence?: number;
  Raw?: Record<string, unknown>;
}

export interface IAuditResponseUpsert {
  AuditInstanceId: number;
  AuditQuestionInstanceId: number;
  ResponseValue: 'compliant' | 'non-compliant' | 'na';
  Notes?: string;
  EvidenceUrls?: string;
}

export interface IActionItem {
  Id: number;
  Title: string;
  Status?: string;
  DueDate?: string;
  Priority?: string;
  AuditReference?: string;
  DepartmentName?: string;
  AssignedToEmail?: string;
  Description?: string;
  Raw?: Record<string, unknown>;
}

export interface ILpaKpis {
  totalAudits: number;
  openActions: number;
  overdueActions: number;
  completedAudits: number;
}
