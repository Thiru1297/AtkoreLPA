import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { AppRole, IAuditInstanceItem, IAuditQuestionItem, IAuditResponseUpsert, IActionItem, ILpaKpis, IUserRoleMappingItem } from './LpaTypes';
import { LPA_LIBRARIES, LPA_LISTS } from './LpaListNames';

interface ISharePointItemsResponse<T> {
  value: T[];
}

interface IResolvedCurrentUser {
  email: string;
  login: string;
  displayName: string;
  id: number;
}

export class LpaSharePointService {
  private readonly _context: WebPartContext;
  private readonly _webUrl: string;

  public constructor(context: WebPartContext) {
    this._context = context;
    this._webUrl = context.pageContext.web.absoluteUrl;
  }

  public async getCurrentUserRole(): Promise<IUserRoleMappingItem | undefined> {
    const aliases: string[] = Array.from(new Set([
      LPA_LISTS.UserRoleMapping,
      'UserRoleMapping',
      'User Role Mapping',
      'UserRoleMaping',
      'User Role Maping',
      'userRolemaping'
    ]));

    const currentUser: IResolvedCurrentUser = await this._resolveCurrentUser();
    const currentEmail: string = this._normalizeIdentity(currentUser.email);
    const currentLogin: string = this._normalizeIdentity(currentUser.login);
    const currentUserId: number = currentUser.id;
    const currentDisplayName: string = this._normalizeDisplayName(currentUser.displayName);

    for (const listName of aliases) {
      let items: Record<string, unknown>[] = [];
      try {
        items = await this._getUserRoleMappingItems(listName);
      } catch {
        continue;
      }

      const matching: Record<string, unknown> | undefined = items.find((item) => {
        const isActive: boolean = item.IsActive !== false && String(item.IsActive || '').toLowerCase() !== 'no';
        if (!isActive) {
          return false;
        }

        const emails: string[] = this._extractCandidateEmails(item).map((x) => this._normalizeIdentity(x)).filter(Boolean);
        const ids: number[] = this._extractCandidateUserIds(item);
        const names: string[] = this._extractCandidateDisplayNames(item).map((x) => this._normalizeDisplayName(x)).filter(Boolean);

        const matchedByEmail: boolean = !!currentEmail && emails.includes(currentEmail);
        const matchedByLogin: boolean = !!currentLogin && emails.includes(currentLogin);
        const matchedById: boolean = currentUserId > 0 && ids.includes(currentUserId);
        const matchedByName: boolean = !!currentDisplayName && names.includes(currentDisplayName);

        return matchedByEmail || matchedByLogin || matchedById || matchedByName;
      });

      if (matching) {
        const normalizedRole: string = this._normalizeRoleValue(this._extractRoleFromItem(matching));
        if (!normalizedRole) {
          return undefined;
        }
        return {
          ...(matching as unknown as IUserRoleMappingItem),
          Role: normalizedRole
        };
      }
    }

    return undefined;
  }

  public async getAuditsForRole(role: AppRole): Promise<IAuditInstanceItem[]> {
    const items: Record<string, unknown>[] = await this._getListItemsWithAliases(
      LPA_LISTS.AuditInstances,
      ['AuditInstances', 'Audit Instance', 'AuditInstance', 'AuditQAInstances', 'Audit QA Instances'],
      5000
    );
    const currentEmail: string = (this._context.pageContext.user.email || '').toLowerCase();

    const filtered: Record<string, unknown>[] = items.filter((item) => {
      const assignedTo: string = this._pickString(item, ['AssignedAuditorEmail', 'AssignedAuditor', 'AuditorEmail', 'Auditor']);
      if (role === 'auditor') {
        // If assignment is an email, match to current user.
        // If it is blank or non-email text (common legacy list shape), keep visible.
        if (!assignedTo) {
          return true;
        }
        const normalized: string = assignedTo.toLowerCase();
        const looksLikeEmail: boolean = normalized.includes('@');
        return looksLikeEmail ? normalized === currentEmail : true;
      }
      return true;
    });

    return filtered.map((item) => ({
      Id: this._pickNumber(item, ['Id']),
      Title: this._pickString(item, ['Title', 'AuditId', 'AuditNumber']),
      Status: this._pickString(item, ['Status']),
      DueDate: this._pickString(item, ['DueDate', 'PlannedDate', 'AuditDate']),
      PlantName: this._pickString(item, ['PlantName', 'Plant', 'Plant_x0020_Name']),
      DepartmentName: this._pickString(item, ['DepartmentName', 'Department', 'PlantDepartment']),
      AssignedAuditorEmail: assignedTo(item),
      Raw: item
    }));

    function assignedTo(item: Record<string, unknown>): string {
      return (
        String(item.AssignedAuditorEmail || item.AuditorEmail || item.AssignedAuditor || item.Auditor || '')
      );
    }
  }

  public async getActionsForRole(role: AppRole): Promise<IActionItem[]> {
    const items: Record<string, unknown>[] = await this._getListItemsWithAliases(
      LPA_LISTS.Actions,
      ['Action', 'Action Items'],
      5000
    );
    const currentEmail: string = (this._context.pageContext.user.email || '').toLowerCase();

    const filtered: Record<string, unknown>[] = items.filter((item) => {
      const owner: string = this._pickString(item, ['AssignedToEmail', 'AssignedTo', 'DepartmentOwnerEmail', 'DepartmentOwner']);
      if (role === 'department-owner') {
        return owner.toLowerCase() === currentEmail || !owner;
      }
      if (role === 'auditor') {
        const auditor: string = this._pickString(item, ['AuditorEmail', 'CreatedByEmail']);
        return auditor.toLowerCase() === currentEmail || !auditor;
      }
      return true;
    });

    return filtered.map((item) => ({
      Id: this._pickNumber(item, ['Id']),
      Title: this._pickString(item, ['Title', 'ActionId']),
      Status: this._pickString(item, ['Status']),
      DueDate: this._pickString(item, ['DueDate']),
      Priority: this._pickString(item, ['Priority']),
      AuditReference: this._pickString(item, ['AuditReference', 'AuditId', 'AuditInstance']),
      DepartmentName: this._pickString(item, ['DepartmentName', 'Department']),
      AssignedToEmail: this._pickString(item, ['AssignedToEmail', 'AssignedTo']),
      Description: this._pickString(item, ['Description', 'ActionDescription']),
      Raw: item
    }));
  }

  public async getActionById(actionId: string): Promise<IActionItem | undefined> {
    const numericId: number = Number(actionId);

    // Try direct numeric lookup first (fastest)
    if (!Number.isNaN(numericId) && numericId > 0) {
      try {
        const endpoint: string = `${this._webUrl}/_api/web/lists/getbytitle('${this._escapeListName(LPA_LISTS.Actions)}')/items(${numericId})`;
        const item: Record<string, unknown> = await this._get<Record<string, unknown>>(endpoint);
        if (item && item.Id) {
          return this._mapToActionItem(item);
        }
      } catch {
        // Fall through to title-based search
      }
    }

    // Search by Title across list name aliases
    const items: Record<string, unknown>[] = await this._getListItemsWithAliases(
      LPA_LISTS.Actions,
      ['Action', 'Action Items'],
      5000
    );

    const found: Record<string, unknown> | undefined = items.find((item) => {
      const title: string = this._pickString(item, ['Title', 'ActionId']);
      return title === actionId || String(item.Id) === actionId;
    });

    return found ? this._mapToActionItem(found) : undefined;
  }

  private _mapToActionItem(item: Record<string, unknown>): IActionItem {
    return {
      Id: this._pickNumber(item, ['Id']),
      Title: this._pickString(item, ['Title', 'ActionId']),
      Status: this._pickString(item, ['Status']),
      DueDate: this._pickString(item, ['DueDate']),
      Priority: this._pickString(item, ['Priority']),
      AuditReference: this._pickString(item, ['AuditReference', 'AuditId', 'AuditInstance']),
      DepartmentName: this._pickString(item, ['DepartmentName', 'Department']),
      AssignedToEmail: this._pickString(item, ['AssignedToEmail', 'AssignedTo']),
      Description: this._pickString(item, ['Description', 'ActionDescription']),
      Raw: item
    };
  }

  public async getActionsForDepartment(departmentName: string): Promise<IActionItem[]> {
    const items: Record<string, unknown>[] = await this._getListItemsWithAliases(
      LPA_LISTS.Actions,
      ['Action', 'Action Items'],
      5000
    );

    const normalizedDept: string = departmentName.trim().toLowerCase();

    const filtered: Record<string, unknown>[] = items.filter((item) => {
      const dept: string = this._pickString(item, ['DepartmentName', 'Department', 'PlantDepartment']);
      return dept.trim().toLowerCase() === normalizedDept;
    });

    return filtered.map((item) => ({
      Id: this._pickNumber(item, ['Id']),
      Title: this._pickString(item, ['Title', 'ActionId']),
      Status: this._pickString(item, ['Status']),
      DueDate: this._pickString(item, ['DueDate']),
      Priority: this._pickString(item, ['Priority']),
      AuditReference: this._pickString(item, ['AuditReference', 'AuditId', 'AuditInstance']),
      DepartmentName: this._pickString(item, ['DepartmentName', 'Department']),
      AssignedToEmail: this._pickString(item, ['AssignedToEmail', 'AssignedTo']),
      Description: this._pickString(item, ['Description', 'ActionDescription']),
      Raw: item
    }));
  }

  public async getAuditQuestionInstances(auditInstanceId: number): Promise<IAuditQuestionItem[]> {
    const items: Record<string, unknown>[] = await this.getListItems(LPA_LISTS.AuditQuestionsInstance, 5000);

    return items
      .filter((item) => {
        const parentId: number = this._pickNumber(item, ['AuditInstanceId', 'AuditInstanceLookupId', 'AuditInstance']);
        return parentId === auditInstanceId || parentId === 0;
      })
      .map((item) => ({
        Id: this._pickNumber(item, ['Id']),
        Title: this._pickString(item, ['Title', 'QuestionText']),
        Category: this._pickString(item, ['Category', 'QuestionCategory']),
        QuestionText: this._pickString(item, ['QuestionText', 'Title']),
        Instructions: this._pickString(item, ['Instructions']),
        IsEvidenceRequired: Boolean(item.IsEvidenceRequired || item.MandatoryEvidence),
        Sequence: this._pickNumber(item, ['Sequence', 'OrderNo', 'SortOrder']),
        Raw: item
      }))
      .sort((a, b) => (a.Sequence || 0) - (b.Sequence || 0));
  }

  public async getQuestionBankQuestions(): Promise<IAuditQuestionItem[]> {
    const items: Record<string, unknown>[] = await this._getListItemsWithAliases(
      LPA_LISTS.AuditQuestionBank,
      ['Audit Question Bank', 'AuditQuestionBank', 'Audit QuestionBank'],
      5000
    );

    return items
      .filter((item) => {
        const flag: unknown = item.IsActive;
        if (flag === undefined || flag === null || flag === '') {
          return true;
        }
        if (typeof flag === 'boolean') {
          return flag;
        }
        const normalized: string = String(flag).trim().toLowerCase();
        return !['false', 'no', '0', 'inactive'].includes(normalized);
      })
      .map((item, index) => {
        const maxPhotos: number = this._pickNumber(item, ['MaxPhotos', 'PhotoCount', 'RequiredPhotos']);
        const isEvidenceRequired: boolean =
          Boolean(item.EvidenceRequired || item.IsEvidenceRequired || item.MandatoryEvidence) || maxPhotos > 0;

        return {
          Id: this._pickNumber(item, ['Id']),
          Title: this._pickString(item, ['Title', 'QuestionText']),
          Category: this._pickString(item, ['Category', 'QuestionCategory']),
          DepartmentName: this._pickString(item, ['DepartmentName', 'Department', 'PlantDepartment']),
          QuestionText: this._pickString(item, ['QuestionText', 'Title']),
          Instructions: this._pickString(item, ['Instructions', 'PhotoNamingRequirement', 'PhotoNamingReq']),
          IsEvidenceRequired: isEvidenceRequired,
          MaxPhotos: maxPhotos || (isEvidenceRequired ? 1 : 0),
          Sequence: this._pickNumber(item, ['Sequence', 'OrderNo', 'SortOrder', 'Id']) || index + 1,
          Raw: item
        };
      });
  }

  public async upsertAuditResponses(items: IAuditResponseUpsert[]): Promise<void> {
    for (const response of items) {
      const payload: Record<string, unknown> = {
        Title: `R-${response.AuditInstanceId}-${response.AuditQuestionInstanceId}`,
        AuditInstanceId: response.AuditInstanceId,
        AuditQuestionInstanceId: response.AuditQuestionInstanceId,
        ResponseValue: response.ResponseValue,
        Notes: response.Notes || '',
        EvidenceUrls: response.EvidenceUrls || ''
      };

      await this.createListItem(LPA_LISTS.AuditResponses, payload);
    }
  }

  public async submitAudit(auditItemId: number): Promise<void> {
    await this.updateListItem(LPA_LISTS.AuditInstances, auditItemId, {
      Status: 'Submitted',
      SubmittedOn: new Date().toISOString()
    });
  }

  public async acknowledgeAudit(auditItemId: number, accepted: boolean, reason?: string): Promise<void> {
    await this.updateListItem(LPA_LISTS.AuditInstances, auditItemId, {
      Status: accepted ? 'Accepted' : 'Denied',
      DenialReason: accepted ? '' : reason || ''
    });
  }

  public async updateActionStatus(actionId: number, status: string, notes?: string): Promise<void> {
    await this.updateListItem(LPA_LISTS.Actions, actionId, {
      Status: status,
      ClosureNotes: notes || '',
      ClosedDate: status.toLowerCase() === 'closed' ? new Date().toISOString() : null
    });
  }

  public async uploadAuditEvidence(fileName: string, file: Blob, metadata: Record<string, unknown>): Promise<string> {
    return this.uploadFileToLibrary(LPA_LIBRARIES.AuditEvidence, fileName, file, metadata);
  }

  public async uploadActionClosureEvidence(fileName: string, file: Blob, metadata: Record<string, unknown>): Promise<string> {
    return this.uploadFileToLibrary(LPA_LIBRARIES.ActionClosureEvidence, fileName, file, metadata);
  }

  public async getConfigurationValue(key: string): Promise<string> {
    const items: Record<string, unknown>[] = await this.getListItems(LPA_LISTS.ConfigurationSettings, 500);
    const found: Record<string, unknown> | undefined = items.find((item) => {
      const cfgKey: string = this._pickString(item, ['Title', 'Key', 'ConfigKey']);
      return cfgKey.toLowerCase() === key.toLowerCase();
    });
    return found ? this._pickString(found, ['Value', 'ConfigValue']) : '';
  }

  public async getDashboardKpis(role: AppRole): Promise<ILpaKpis> {
    const audits: IAuditInstanceItem[] = await this.getAuditsForRole(role);
    const actions: IActionItem[] = await this.getActionsForRole(role);
    const todayIso: string = new Date().toISOString();

    return {
      totalAudits: audits.length,
      completedAudits: audits.filter((a) => (a.Status || '').toLowerCase() === 'submitted').length,
      openActions: actions.filter((a) => ['open', 'in-progress'].includes((a.Status || '').toLowerCase())).length,
      overdueActions: actions.filter(
        (a) => (a.Status || '').toLowerCase() !== 'closed' && !!a.DueDate && a.DueDate < todayIso
      ).length
    };
  }

  public async getListItems(listName: string, top: number = 5000): Promise<Record<string, unknown>[]> {
    const endpoint: string = `${this._webUrl}/_api/web/lists/getbytitle('${this._escapeListName(listName)}')/items?$top=${top}`;
    const response: ISharePointItemsResponse<Record<string, unknown>> = await this._get(endpoint);
    return response.value || [];
  }

  private async _getListItemsWithAliases(
    primaryName: string,
    aliases: string[],
    top: number = 5000
  ): Promise<Record<string, unknown>[]> {
    const names: string[] = Array.from(new Set([primaryName, ...aliases]));
    let firstSuccessful: Record<string, unknown>[] | undefined;

    for (const name of names) {
      try {
        const items: Record<string, unknown>[] = await this.getListItems(name, top);
        if (firstSuccessful === undefined) {
          firstSuccessful = items;
        }
        if (items.length > 0) {
          return items;
        }
      } catch {
        // Try next list title alias.
      }
    }

    return firstSuccessful || [];
  }

  private async _getUserRoleMappingItems(listName: string): Promise<Record<string, unknown>[]> {
    const base: string = `${this._webUrl}/_api/web/lists/getbytitle('${this._escapeListName(listName)}')/items?$top=1000`;
    const endpoints: string[] = [
      `${base}&$select=*,User/Id,User/EMail,User/Email,User/Name,User/Title,AssignedUser/Id,AssignedUser/EMail,AssignedUser/Email,AssignedUser/Name,AssignedUser/Title,PrimaryDepartment/Id,PrimaryDepartment/Title&$expand=User,AssignedUser,PrimaryDepartment`,
      `${base}&$select=*,User/Id,User/EMail,User/Email,User/Name,User/Title,AssignedUser/Id,AssignedUser/EMail,AssignedUser/Email,AssignedUser/Name,AssignedUser/Title&$expand=User,AssignedUser`,
      base
    ];

    for (const endpoint of endpoints) {
      try {
        const response: ISharePointItemsResponse<Record<string, unknown>> = await this._get(endpoint);
        return response.value || [];
      } catch {
        // Try next query shape.
      }
    }

    throw new Error('Unable to read UserRoleMapping items');
  }

  public async createListItem(listName: string, payload: Record<string, unknown>): Promise<number> {
    const endpoint: string = `${this._webUrl}/_api/web/lists/getbytitle('${this._escapeListName(listName)}')/items`;
    const response: SPHttpClientResponse = await this._context.spHttpClient.post(
      endpoint,
      SPHttpClient.configurations.v1,
      {
        headers: {
          Accept: 'application/json;odata=nometadata',
          'Content-type': 'application/json;odata=nometadata'
        },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      throw new Error(`SharePoint create failed: ${response.status} ${response.statusText}`);
    }

    const json: { Id?: number } = (await response.json()) as { Id?: number };
    return json.Id || 0;
  }

  public async updateListItem(listName: string, itemId: number, payload: Record<string, unknown>): Promise<void> {
    const endpoint: string = `${this._webUrl}/_api/web/lists/getbytitle('${this._escapeListName(listName)}')/items(${itemId})`;
    const response: SPHttpClientResponse = await this._context.spHttpClient.post(
      endpoint,
      SPHttpClient.configurations.v1,
      {
        headers: {
          Accept: 'application/json;odata=nometadata',
          'Content-type': 'application/json;odata=nometadata',
          'IF-MATCH': '*',
          'X-HTTP-Method': 'MERGE'
        },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      throw new Error(`SharePoint update failed: ${response.status} ${response.statusText}`);
    }
  }

  private async uploadFileToLibrary(
    libraryName: string,
    fileName: string,
    file: Blob,
    metadata: Record<string, unknown>
  ): Promise<string> {
    const endpoint: string = `${this._webUrl}/_api/web/lists/getbytitle('${this._escapeListName(libraryName)}')/RootFolder/Files/add(overwrite=true,url='${encodeURIComponent(fileName)}')`;
    const uploadResponse: SPHttpClientResponse = await this._context.spHttpClient.post(
      endpoint,
      SPHttpClient.configurations.v1,
      {
        headers: {
          Accept: 'application/json;odata=nometadata'
        },
        body: file
      }
    );

    if (!uploadResponse.ok) {
      throw new Error(`File upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
    }

    const uploadJson: { ServerRelativeUrl?: string; ListItemAllFields?: { Id?: number } } =
      (await uploadResponse.json()) as { ServerRelativeUrl?: string; ListItemAllFields?: { Id?: number } };

    const itemId: number = uploadJson?.ListItemAllFields?.Id || 0;
    if (itemId > 0 && Object.keys(metadata).length > 0) {
      await this.updateListItem(libraryName, itemId, metadata);
    }

    return `${this._context.pageContext.web.absoluteUrl.replace(/\/$/, '')}${uploadJson.ServerRelativeUrl || ''}`;
  }

  private _pickString(item: Record<string, unknown>, keys: string[]): string {
    for (const key of keys) {
      const value: unknown = item[key];
      if (typeof value === 'string' && value.trim()) {
        return value.trim();
      }
      if (value && typeof value === 'object') {
        const nested: Record<string, unknown> = value as Record<string, unknown>;
        const candidates: unknown[] = [nested.Title, nested.EMail, nested.Name, nested.LookupValue];
        const candidate: unknown = candidates.find((c) => typeof c === 'string' && String(c).trim());
        if (typeof candidate === 'string') {
          return candidate.trim();
        }
      }
    }
    return '';
  }

  private _pickNumber(item: Record<string, unknown>, keys: string[]): number {
    for (const key of keys) {
      const value: unknown = item[key];
      if (typeof value === 'number') {
        return value;
      }
      if (typeof value === 'string' && value !== '') {
        const parsed: number = Number(value);
        if (!Number.isNaN(parsed)) {
          return parsed;
        }
      }
    }
    return 0;
  }

  private _extractUserEmail(item: Record<string, unknown>): string {
    const directFields: string[] = ['UserEmail', 'Email', 'AssignedUserEmail'];
    const userFields: string[] = ['User', 'Title', 'Person', 'AssignedUser'];

    const direct: string = this._pickString(item, directFields);
    if (direct) {
      return direct;
    }

    for (const field of userFields) {
      const value: unknown = item[field];
      if (value && typeof value === 'object') {
        const nested: Record<string, unknown> = value as Record<string, unknown>;
        const email: unknown = nested.EMail || nested.Email || nested.UserName;
        if (typeof email === 'string' && email.trim()) {
          return email.trim();
        }
      }
    }

    return '';
  }

  private _extractCandidateEmails(item: Record<string, unknown>): string[] {
    const direct: string[] = [
      this._pickString(item, ['UserEmail', 'Email', 'AssignedUserEmail', 'LoginName', 'UserName'])
    ].filter(Boolean);

    const nestedSources: string[] = ['User', 'AssignedUser', 'Person', 'Title'];
    const nested: string[] = [];
    for (const field of nestedSources) {
      const value: unknown = item[field];
      if (!value || typeof value !== 'object') {
        continue;
      }
      const v: Record<string, unknown> = value as Record<string, unknown>;
      const candidates: unknown[] = [v.EMail, v.Email, v.Name, v.LoginName, v.UserName];
      for (const candidate of candidates) {
        if (typeof candidate === 'string' && candidate.trim()) {
          nested.push(candidate.trim());
        }
      }
    }

    const inferredEmails: string[] = [];
    for (const value of Object.values(item)) {
      if (typeof value === 'string' && value.includes('@')) {
        inferredEmails.push(value.trim());
      }
    }

    return Array.from(new Set([...direct, ...nested, ...inferredEmails]));
  }

  private _extractCandidateUserIds(item: Record<string, unknown>): number[] {
    const ids: number[] = [];
    const directFields: string[] = ['UserId', 'AssignedUserId', 'PersonId', 'TitleId'];
    for (const key of directFields) {
      const id: number = this._pickNumber(item, [key]);
      if (id > 0) {
        ids.push(id);
      }
    }

    const nestedSources: string[] = ['User', 'AssignedUser', 'Title', 'Person'];
    for (const field of nestedSources) {
      const value: unknown = item[field];
      if (!value || typeof value !== 'object') {
        continue;
      }
      const nested: Record<string, unknown> = value as Record<string, unknown>;
      const id: number = this._pickNumber(nested, ['Id']);
      if (id > 0) {
        ids.push(id);
      }
    }

    return Array.from(new Set(ids));
  }

  private _normalizeIdentity(input: string): string {
    const value: string = String(input || '').trim().toLowerCase();
    if (!value) {
      return '';
    }
    const claimsToken: string = '|membership|';
    const idx: number = value.lastIndexOf(claimsToken);
    if (idx >= 0) {
      return value.substring(idx + claimsToken.length);
    }
    return value;
  }

  private _normalizeDisplayName(input: string): string {
    return String(input || '').trim().toLowerCase().replace(/\s+/g, ' ');
  }

  private _normalizeRoleValue(roleText: string): string {
    const raw: string = String(roleText || '').trim().toLowerCase().replace(/[\s_-]+/g, '');
    if (raw === 'auditor') {
      return 'Auditor';
    }
    if (raw === 'departmentowner') {
      return 'DepartmentOwner';
    }
    if (raw === 'plantmanager' || raw === 'plantmanage') {
      return 'PlantManager';
    }
    if (raw === 'superuser') {
      return 'SuperUser';
    }
    return '';
  }

  private _extractRoleFromItem(item: Record<string, unknown>): string {
    const direct: string = this._pickString(item, [
      'Role',
      'UserRole',
      'RoleName',
      'Roles',
      'AccessRole',
      'UserType'
    ]);
    if (direct) {
      return direct;
    }

    const values: unknown[] = Object.values(item);
    for (const value of values) {
      if (typeof value !== 'string') {
        continue;
      }
      const normalized: string = this._normalizeRoleValue(value);
      if (normalized) {
        return value;
      }
    }

    return '';
  }

  private _extractCandidateDisplayNames(item: Record<string, unknown>): string[] {
    const names: string[] = [];
    const directFields: string[] = ['Title', 'UserName', 'DisplayName', 'Name'];
    for (const field of directFields) {
      const value: unknown = item[field];
      if (typeof value === 'string' && value.trim() && !value.includes('@')) {
        names.push(value.trim());
      }
    }

    const nestedSources: string[] = ['User', 'AssignedUser', 'Person'];
    for (const source of nestedSources) {
      const value: unknown = item[source];
      if (!value || typeof value !== 'object') {
        continue;
      }
      const nested: Record<string, unknown> = value as Record<string, unknown>;
      const candidate: unknown = nested.Title || nested.Name || nested.DisplayName;
      if (typeof candidate === 'string' && candidate.trim()) {
        names.push(candidate.trim());
      }
    }

    return Array.from(new Set(names));
  }

  private async _resolveCurrentUser(): Promise<IResolvedCurrentUser> {
    const contextEmail: string = this._context.pageContext.user.email || '';
    const contextLogin: string = this._context.pageContext.user.loginName || '';
    const contextDisplayName: string = this._context.pageContext.user.displayName || '';
    const legacyId: number = Number((this._context.pageContext.legacyPageContext as { userId?: number } | undefined)?.userId || 0);

    let spUserId: number = legacyId;
    let spEmail: string = contextEmail;
    let spLogin: string = contextLogin;
    let spTitle: string = contextDisplayName;

    try {
      const endpoint: string = `${this._webUrl}/_api/web/currentuser?$select=Id,Email,LoginName,Title`;
      const user: { Id?: number; Email?: string; LoginName?: string; Title?: string } =
        await this._get<{ Id?: number; Email?: string; LoginName?: string; Title?: string }>(endpoint);

      spUserId = Number(user.Id || spUserId || 0);
      spEmail = String(user.Email || spEmail || '');
      spLogin = String(user.LoginName || spLogin || '');
      spTitle = String(user.Title || spTitle || '');
    } catch {
      // Fall back to page context values.
    }

    if (!spUserId && spLogin) {
      try {
        const endpoint: string = `${this._webUrl}/_api/web/ensureuser`;
        const ensured: { Id?: number } = await this._post<{ Id?: number }>(endpoint, {
          logonName: spLogin
        });
        spUserId = Number(ensured?.Id || 0);
      } catch {
        // Keep current id if ensureuser fails.
      }
    }

    return {
      email: spEmail,
      login: spLogin,
      displayName: spTitle || contextDisplayName,
      id: spUserId
    };
  }

  private _escapeListName(name: string): string {
    return name.replace(/'/g, "''");
  }

  private async _get<T>(url: string): Promise<T> {
    const response: SPHttpClientResponse = await this._context.spHttpClient.get(url, SPHttpClient.configurations.v1);

    if (!response.ok) {
      throw new Error(`SharePoint request failed: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
  }

  private async _post<T>(url: string, payload: Record<string, unknown>): Promise<T> {
    const response: SPHttpClientResponse = await this._context.spHttpClient.post(
      url,
      SPHttpClient.configurations.v1,
      {
        headers: {
          Accept: 'application/json;odata=nometadata',
          'Content-type': 'application/json;odata=nometadata'
        },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      throw new Error(`SharePoint request failed: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
  }
}
