<!--

System Guidelines

Use this file to provide the AI with rules and guidelines you want it to follow
when generating UI, UX flows, SPFx components and Fluent UI code for the LPA app.

TIP: Focus on the most important rules so generations stay consistent and usable.


# General guidelines

* Always design **mobile-first for the Auditor role**, then scale up to desktop.
* Use **Fluent UI React components** and SharePoint’s **modern page layout** conventions.
* Prefer **responsive layouts** using Flexbox and CSS Grid. Avoid fixed widths and absolute positioning where possible.
* Keep the **visual chrome minimal**. Do not replicate or override the SharePoint suite bar, command bar, or global nav.
* Follow **one source of truth** for theming: use theme tokens / CSS variables defined in the SharePoint/Fluent theme and the CSS theme provided in this file.
* Default base font-size to **14px** for body text, with clear hierarchy for headings.
* Ensure **keyboard accessibility and screen reader support** (ARIA labels, roles, focus order, focus outlines).
* All critical actions (Submit, Accept, Close Action, etc.) should require explicit user confirmation where failure is costly.
* Favor **non-blocking patterns** (panels, drawers, inline validation) over modal dialogs, except for confirmations.
* Respect **SharePoint performance constraints**: minimize bundle size, lazy-load heavier modules (e.g., camera, analytics dashboards).


# Design system guidelines

The app must visually and behaviorally align with Microsoft 365/SharePoint and Fluent UI.

* Use **Fluent UI design language** (rounded corners, subtle shadows, neutral grays, strong primary).
* Use **neutral backgrounds** and **subtle borders** for cards and surfaces.
* Leverage **Fluent UI typography scale**: H1–H4, body, caption; keep headings clear and concise.
* Use **compact spacing** on mobile, **comfortable spacing** on desktop.
* Respect high contrast requirements and ensure **WCAG AA** color contrast for text and key UI elements.

## Layout

### Mobile

* The **Auditor experience is mobile-first**:
  * Use **full-width cards** with stacked content.
  * Place **primary actions** in a sticky bottom bar where appropriate (e.g., Start Audit, Resume, Submit).
  * Use **one-question-per-screen** for the audit questionnaire whenever possible.
* Avoid multi-column layouts on small screens. Use single column with dividers and cards.
* Use **tabs or segmented controls** for switching between “Upcoming / Today / Completed / Missed” audits.

### Desktop / Web

* For dashboards (Department Owner, Plant Manager, Super User):
  * Use **2–3 column grid layouts** for KPI tiles, charts and tables.
  * Keep side navigation in a **left sidebar** where appropriate; use Fluent UI `Nav` or `VerticalTabs` patterns.
  * Tables and charts should be inside **cards** with clear headers and optional filters in the header area.
* Use **sticky filter bars** or headers for lists with long scrolling (e.g., audit list, actions list).

## Navigation

* Roles and flows:

  * **Auditor**  
    Home → Audit Details → Questionnaire → Photo Capture → Review & Submit → Audit Summary & Actions
  * **Department Owner**  
    Dashboard → My Actions → Action Details & Closure
  * **Plant Manager**  
    Dashboard → Audit / Action Drilldown → NC Evidence View
  * **Super User**  
    Dashboard → (Question Bank / Scheduling / Role Mapping / Automation Logs)

* Use Fluent UI components for navigation:
  * `Pivot` / `Tabs` for top-level sections within a page.
  * `Breadcrumb` for drilldown flows (e.g., Plant → Dept → Audit → Question).
  * `CommandBar` / `Toolbar` for actions like export, filter, refresh.

* Avoid nested navigation more than 3 levels deep. Prefer drilldown panels or details panes over new full pages.

## Cards

### Audit Cards (Auditor Home)

* Must show: Audit ID, Plant, Department, Layer (optional), Due Date, Status.
* Display **status badges** (Pending Acceptance, Accepted, Denied, In Progress, Submitted).
* Show **due date with urgency** (Due Soon, Overdue badges).
* Primary CTAs:
  * If not accepted: **Accept / Deny** buttons.
  * If accepted: **Start / Resume** button.
  * Secondary: **View Summary** (link-style or tertiary button).

### Action Cards (Summary & Department Owner)

* Include: Action ID, Department, Assigned To / Pending With, Due Date, Status.
* Surface overdue state clearly (badge + red text).
* Clicking the card opens **Action Details** in a panel or full page depending on context.

## Buttons

The Button component should follow Fluent UI primary / default / subtle styles.

### Usage

* Use **primary buttons** for main actions per view:
  * Start Audit, Resume Audit, Submit Audit, Close Action, Save Changes.
* Use **default / secondary buttons** for supporting actions:
  * Export, Filter, Cancel, Back.
* Use **subtle / link buttons** for non-critical actions:
  * View summary, View details, Show more.

### Behavior

* **One primary button per main context** (per card or screen) to keep the hierarchy clear.
* Disable primary buttons until required data is valid (e.g., evidence attached for NC, closure evidence for actions).
* Always show **loading state** for long-running operations (e.g., Submit Audit).

## Forms & Questionnaire

### Audit Questionnaire

* Prefer **one question per screen** on mobile; on desktop, you may support a list with clear separation.
* Each question must show:
  * Category label
  * Question text
  * Response options: Compliant / Non-Compliant / NA
  * Notes textarea
  * Evidence button (camera for NC)
* When **Non-Compliant** is selected:
  * Automatically reveal an **evidence capture UI**.
  * Do **not** allow moving to next question if mandatory evidence is missing.
* Show progress as either:
  * “Question X of Y” stepper, or
  * A progress bar (%) at top of screen.

### Validation

* Use inline validation for:
  * Unanswered mandatory questions.
  * Missing mandatory evidence.
* On Review & Submit:
  * Display a summary of errors at the top.
  * Provide direct links/jumps to problematic questions.

## Camera & Evidence

* For Auditors:
  * Evidence is **camera-only** (no gallery upload) as per requirements.
  * Flow: Capture → Retake → Save.
  * Show thumbnail preview inline with question once saved.
* For Department Owners (Closure evidence):
  * Allow **camera or gallery** upload.
* All evidence:
  * Must auto-include timestamp and basic metadata (who, when).
  * Thumbnails should open in a **lightbox / dialog** for full view.

## Tables, Lists, and Dashboards

* Use Fluent UI `DetailsList` / `DataGrid` for:
  * Action lists.
  * Audit lists (Plant Manager, Super User).
  * Question bank management.
* Always provide:
  * Sort on key columns (Due Date, Status, Priority).
  * Filter/search controls near the table header.
* Dashboards (Plant Manager, Super User, Department Owner):
  * Top row: KPI tiles (Completed audits, Open/Overdue actions, NC counts).
  * Middle: Charts (trends, heatmaps, department comparisons).
  * Bottom: Detailed tables and drilldowns.

## Role-Specific UX

### Auditor

* Optimize for **speed and minimal typing**:
  * Use buttons and quick responses over text fields.
  * Use default notes templates where helpful.
* Show clear **status indicators** on home screen.
* Provide **“Today” or “My Next Audit”** short-cuts.
* Ensure flows work reliably in **low connectivity** (autosave, retry).

### Department Owner

* Show **“Need My Attention”** section at top:
  * Overdue actions.
  * Due this week.
* Provide easy **filter by Department, Status, Due Date**.
* Make closure flow explicit:
  * Review original NC + auditor evidence.
  * Add closure notes + evidence.
  * Change status to Closed, with confirmation.

### Plant Manager

* Focus on **plant-wide overview and trends**:
  * KPI strip, charts, and department comparison tables.
* Each card or row should offer a **drilldown** into audits and actions with minimal clicks.

### Super User

* Use **management console** layouts:
  * Clear, dense tables with compact rows.
  * Filters in headers, commands in a top command bar.
* Question Bank:
  * Support bulk upload / download.
  * Show flags like “Mandatory evidence” and plant/department assignment.
* Scheduling & Mapping:
  * Use tabbed interface for Audit frequency, Escalations, Role mapping, Master data.

## Accessibility & Internationalization

* All controls must support **keyboard navigation** and have visible focus states.
* Use **ARIA labels** for camera buttons, evidence previews, status badges.
* Do not hardcode date formats; use local SharePoint/Fluent formatting utilities.
* Ensure text is not embedded inside images; all key information should be accessible to screen readers.


-->