# Architecture and Development Rules

Before modifying or creating code, **first review the current structure of the frontend and backend**. Do not create files, endpoints, actions or hooks without checking whether an equivalent functionality already exists.

The goal is to keep a clean, modular, reusable architecture with no duplication.

> **Note about the project root:** the project does **NOT use a `src/` folder**. All folders (`features/`, `app/`, etc.) live directly at the project root. Never create or reference paths that include `src/`.

---

# 1. Feature-Based Architecture

The project uses a `features`-based architecture.

The structure must be:

```text
features/
└── private/
    └── <module>/
        ├── components/
        ├── hooks/
        ├── actions/
        └── types/
            └── index.ts
```

For the `dashboard` module:

```text
features/
└── private/
    └── dashboard/
        ├── components/
        ├── hooks/
        ├── actions/
        └── types/
            └── index.ts
```

Each module must keep the following inside its own feature:

- `components`
- `hooks`
- `actions`
- `types`

Do not move these elements to global folders if they belong specifically to a feature.

---

# 2. Types and Interfaces

All `types` and `interfaces` belonging to a module must be centralized in:

```text
types/index.ts
```

For `dashboard`:

```text
features/private/dashboard/types/index.ts
```

Do not create separate files such as:

```text
dashboard.types.ts
dashboard.interface.ts
event.types.ts
event.interface.ts
```

if they belong to the same module.

The structure must stay like this:

```text
dashboard/
└── types/
    └── index.ts
```

Inside `index.ts` must live all the `types` and `interfaces` the module needs.

Example:

```ts
export interface DashboardData {
  // ...
}

export interface DashboardFilters {
  // ...
}

export type DashboardItem = {
  // ...
};
```

`components`, `hooks` and `actions` must import types from that `types/index.ts`.

Example:

```ts
import type { DashboardData, DashboardFilters } from '../types';
```

Do not duplicate the same `type` or `interface` across different files.

---

# 3. Components

Components must live inside:

```text
features/private/<module>/components/
```

For `dashboard`:

```text
features/private/dashboard/components/
```

The structure of `dashboard/components` must be exactly:

```text
components/
├── dashboard-header.tsx
├── dashboard-body.tsx
├── dashboard-table.tsx
└── dashboard-about-system.tsx
```

**IMPORTANT: these four files are siblings.**

Do not create a structure like:

```text
components/
├── dashboard-header.tsx
└── dashboard-body/
    └── dashboard-table.tsx
```

nor:

```text
components/
└── dashboard-body/
    ├── dashboard-table.tsx
    └── dashboard-about-system.tsx
```

`dashboard-body.tsx`, `dashboard-table.tsx` and `dashboard-about-system.tsx` are independent files inside `components`.

The full structure is:

```text
features/
└── private/
    └── dashboard/
        ├── components/
        │   ├── dashboard-header.tsx
        │   ├── dashboard-body.tsx
        │   ├── dashboard-table.tsx
        │   └── dashboard-about-system.tsx
        │
        ├── hooks/
        │
        ├── actions/
        │
        └── types/
            └── index.ts
```

---

# 4. Visual Composition of the Dashboard

The four components are independent:

```text
Dashboard
├── DashboardHeader
├── DashboardBody
├── DashboardTable
└── DashboardAboutSystem
```

This represents the composition of the interface, **not a folder structure**.

The files remain siblings:

```text
dashboard-header.tsx
dashboard-body.tsx
dashboard-table.tsx
dashboard-about-system.tsx
```

Do not interpret this composition as nested folders.

---

# 5. Responsibility of Components

Components are mainly responsible for **rendering the interface**.

Components may:

- render elements;
- receive props;
- use hooks;
- display states;
- run UI events;
- compose the interface.

Components must not contain business logic.

They must not:

- call actions directly;
- make backend calls;
- build payloads;
- convert data to uppercase to send it to the backend;
- clean data for requests;
- implement the backend filter logic;
- implement the backend pagination logic;
- duplicate interfaces or types.

The mandatory flow is:

```text
Component
    ↓
Hook
    ↓
Action
    ↓
Backend
```

Never:

```text
Component
    ↓
Action
```

---

# 6. Actions: One File per Endpoint

Each endpoint must have its own `action` file.

Example:

```text
actions/
├── get-event.ts
├── create-event.ts
├── update-event.ts
└── delete-event.ts
```

Each file must have a matching action:

```text
get-event.ts       → getEventAction
create-event.ts    → createEventAction
update-event.ts    → updateEventAction
delete-event.ts    → deleteEventAction
```

The rule is:

```text
1 endpoint
    ↓
1 action
    ↓
1 file
```

Do not group several different endpoints inside the same action.

---

# 7. Hooks: One Hook per Action

Each action must have its own hook.

Example:

```text
hooks/
├── use-get-event.ts
├── use-create-event.ts
├── use-update-event.ts
└── use-delete-event.ts
```

Mapping:

```text
getEventAction      → useGetEvent
createEventAction   → useCreateEvent
updateEventAction   → useUpdateEvent
deleteEventAction   → useDeleteEvent
```

The flow must always be:

```text
Component
    ↓
Hook
    ↓
Action
    ↓
Backend
```

A component must never import an action directly.

---

# 8. Responsibility of Hooks

Hooks are the layer where the logic needed to prepare and deliver data to components lives.

Hooks must handle:

- calls to actions;
- data cleaning;
- data transformation;
- data preparation;
- error handling;
- toasts/notifications;
- state needed by the UI;
- filters;
- pagination;
- parameter preparation;
- transformation of backend responses;
- any logic needed to correctly feed the component.

The component must receive the data already prepared by the hook.

Flow:

```text
Backend
    ↓
Action
    ↓
Hook
    ↓
Prepared data
    ↓
Component
```

---

# 9. POST

When an action is a `POST`, the component must send the data **raw to the hook**.

Flow:

```text
Component
    ↓
Raw data
    ↓
Hook
    ↓
Cleaning
    ↓
Transformation
    ↓
Uppercase
    ↓
Payload
    ↓
Action
    ↓
Backend
```

The component:

- does not build the payload;
- does not convert data to uppercase;
- does not prepare the structure required by the backend.

The hook must:

1. Receive the raw data.
2. Clean the data when applicable.
3. Transform the data when applicable.
4. Convert the required values to uppercase.
5. Build the payload.
6. Run the action.
7. Handle errors.
8. Show the corresponding toasts.
9. Prepare the result for the component.

Conceptual example:

```text
Component
{
  name: "juan",
  lastName: "perez"
}
```

The hook transforms it:

```text
{
  name: "JUAN",
  lastName: "PEREZ"
}
```

And creates the payload the backend needs:

```text
{
  payload: {
    name: "JUAN",
    lastName: "PEREZ"
  }
}
```

The action is limited to communicating with the endpoint.

---

# 10. PUT

For `PUT` the exact same architecture as `POST` applies.

The component sends the raw data to the hook:

```text
Component
    ↓
Hook
```

The hook:

1. receives the data;
2. cleans the data;
3. transforms the data;
4. converts the required values to uppercase;
5. builds the payload;
6. calls the action;
7. handles errors;
8. shows the toasts;
9. delivers the result to the component.

Flow:

```text
Component
    ↓
Hook
    ↓
Payload
    ↓
Action
    ↓
Backend
```

The component must not build the payload.

---

# 11. DELETE

For `DELETE` the POST/PUT transformation is not required.

However, the separation must be kept:

```text
Component
    ↓
Hook
    ↓
Action
    ↓
Backend
```

The component must never call the action directly.

The hook must handle the corresponding errors and toasts.

---

# 12. Specialized GET

GETs must be designed to avoid duplication.

Do not create:

```text
get-event.ts
get-events.ts
```

if both represent the same endpoint and only the behavior changes depending on whether filtering/pagination is used.

There must be **a single specialized GET action** that supports `filter`.

For example:

```text
actions/
└── get-event.ts
```

with one action:

```text
getEventAction()
```

that allows:

```text
filter = true
```

or:

```text
filter = false
```

---

# 13. GET when filter=true

When:

```text
filter = true
```

the GET must fetch the data using the corresponding parameters.

It must support, depending on what the backend needs:

- filters;
- search;
- pagination;
- page;
- limit/size;
- sorting;
- other necessary parameters.

Conceptual example:

```ts
getEventAction({
  filter: true,
  page: 1,
  limit: 10,
  search: 'juan',
});
```

The exact parameter names must be adapted to the real backend.

---

# 14. GET when filter=false

When:

```text
filter = false
```

the GET must fetch all the data.

In this case:

- do not use pagination;
- do not send pagination parameters;
- do not unnecessarily limit the number of records.

This mode is mainly used for:

- `select`;
- combobox;
- dropdown;
- lists that need all records.

Example:

```ts
getEventAction({
  filter: false,
});
```

---

# 15. Do Not Duplicate GET by filter

Do not create:

```text
get-event.ts
get-events.ts
```

just because there are two behaviors.

There must be a single specialized action:

```text
get-event.ts
```

and a single hook:

```text
use-get-event.ts
```

The hook must be usable depending on the need:

```text
useGetEvent({
  filter: true
})
```

for tables, searches and pagination.

And:

```text
useGetEvent({
  filter: false
})
```

for selects and cases where all the data is needed.

---

# 16. Backend and Frontend Must Work Together

Before implementing this logic, carefully review the backend and the frontend.

Do not assume how the endpoint works.

First:

1. Review the existing endpoint.
2. Review its parameters.
3. Review its response.
4. Review how pagination currently works.
5. Review how filters currently work.
6. Determine how `filter=true` must behave.
7. Determine how `filter=false` must behave.
8. Check whether the backend needs changes.
9. Check which part belongs to the frontend.
10. Only then implement actions and hooks.

If the current backend does not correctly allow:

```text
filter=true
```

and:

```text
filter=false
```

the backend must be modified to support both behaviors.

Do not create duplicate endpoints just to solve this difference.

---

# 17. Rule for Combined Hooks

When a component needs the information or logic of two or more hooks, do not place that combination inside the component.

Create a third, specialized hook.

Example:

```text
useGetUsers()
useGetRoles()
        ↓
useUserFormData()
        ↓
Component
```

The third hook must combine and prepare the information.

The component only uses:

```text
useUserFormData()
```

This keeps the logic out of the component.

---

# 18. Hook Reuse

Hooks can be used by any component that needs that functionality.

Example:

```text
DashboardTable
    ↓
useGetEvent()
```

Another component can also use:

```text
AnotherComponent
    ↓
useGetEvent()
```

Do not duplicate logic just because another component needs the same data.

Hooks are reusable.

The only mandatory rule is:

```text
Component ❌ → Action
Component ✅ → Hook → Action
```

---

# 19. Do Not Duplicate Logic

Before creating any new file, check whether an equivalent functionality already exists.

Do not create:

- duplicate actions;
- duplicate hooks;
- duplicate endpoints;
- duplicate GETs;
- duplicate types;
- duplicate interfaces;
- repeated logic between components.

If a functionality can be reused through an existing hook, reuse it.

If existing logic needs to be combined, create a specialized hook.

---

# 20. Full Data Flow

The general architecture must respect:

```text
┌─────────────────────┐
│      Component      │
│      Rendering      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│        Hook         │
│       Logic         │
│      Cleaning       │
│   Transformation    │
│       Toasts        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│       Action        │
│    HTTP Comms       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│       Backend       │
└─────────────────────┘
```

For POST/PUT:

```text
Component
    ↓
Raw data
    ↓
Hook
    ↓
Cleaning + Uppercase + Payload
    ↓
Action
    ↓
Backend
```

For GET:

```text
Component
    ↓
Hook
    ↓
Action
    ↓
Backend
```

with:

```text
filter=true
```

for filtered/paginated queries.

Or:

```text
filter=false
```

to get all the data.

---

# 21. Final Example Structure

A module may end up with a structure like:

```text
features/
└── private/
    └── dashboard/
        │
        ├── components/
        │   ├── dashboard-header.tsx
        │   ├── dashboard-body.tsx
        │   ├── dashboard-table.tsx
        │   └── dashboard-about-system.tsx
        │
        ├── hooks/
        │   ├── use-get-event.ts
        │   ├── use-create-event.ts
        │   ├── use-update-event.ts
        │   ├── use-delete-event.ts
        │   └── ...
        │
        ├── actions/
        │   ├── get-event.ts
        │   ├── create-event.ts
        │   ├── update-event.ts
        │   ├── delete-event.ts
        │   └── ...
        │
        └── types/
            └── index.ts
```

**Important:** the names above are only an example. Before creating files, review the real endpoints and functionalities of the project to determine which ones are needed.

---

# 22. Typed Arrow Functions (mandatory in all files)

In **all files** of the project (components, hooks, actions, utils, etc.) **always use typed arrow functions**.

Do not use the `function name() {}` syntax or `export default function`.

Rules:

- All functions must be arrow functions (`const name = () => {}`).
- Parameters must be typed.
- The return type must be explicitly declared.
- Components must type their props (with a `type` or `interface` defined in the module's `types/index.ts`).
- Do not use `any`; use concrete types, `unknown` or generics.

Component example:

```tsx
import type { DashboardHeaderProps } from '../types';

export const DashboardHeader = ({ title }: DashboardHeaderProps): JSX.Element => {
  return <h1>{title}</h1>;
};
```

Action example:

```ts
import type { GetEventParams, GetEventResponse } from '../types';

export const getEventAction = async (params: GetEventParams): Promise<GetEventResponse> => {
  // communication with the endpoint
};
```

Hook example:

```ts
import type { UseGetEventParams, UseGetEventResult } from '../types';

export const useGetEvent = ({ filter }: UseGetEventParams): UseGetEventResult => {
  // hook logic
};
```

Never:

```tsx
// ❌ Incorrect
export default function DashboardHeader(props) {
  return <h1>{props.title}</h1>;
}
```

Exception: if the framework requires an `export default` (for example `page.tsx` or `layout.tsx` in Next.js), a typed arrow function is still used and exported by default:

```tsx
const DashboardPage = (): JSX.Element => {
  return <DashboardBody />;
};

export default DashboardPage;
```

---

# 23. Language: English URLs, Spanish User-Facing Content

Project language rule:

- **Page URLs / routes: always in English.**
- **Everything the user sees on the page (texts, titles, labels, placeholders, buttons, messages, toasts, displayed errors): in Spanish.**
- Code (file names, folders, variables, functions, hooks, actions, types) stays in English, following the current conventions.

URL examples:

```text
✅ /dashboard
✅ /events
✅ /users/create
✅ /settings/profile

❌ /panel
❌ /eventos
❌ /usuarios/crear
❌ /configuracion/perfil
```

User-facing content example (the visible text is in Spanish):

```tsx
export const EventsHeader = (): JSX.Element => {
  return (
    <header>
      <h1>Eventos</h1>
      <button type="button">Crear evento</button>
    </header>
  );
};
```

Toasts and error messages shown by hooks must also be in Spanish:

```ts
toast.success('Evento creado correctamente');
toast.error('No se pudo crear el evento');
```

---

# 24. Rules You Must Always Follow

### Project root

```text
No src/
```

Folders live at the project root.

### Functions

```text
Always typed arrow functions
```

In all files. Typed parameters and return. No `any`.

### Language

```text
URLs → English
User-facing content → Spanish
```

### Components

```text
Component → Hook
```

Never:

```text
Component → Action
```

### Hooks

```text
Hook → Action
```

The logic goes here.

### Actions

```text
Action → Endpoint
```

One action per endpoint.

### Types

```text
types/index.ts
```

All `types` and `interfaces` of the module must be centralized there.

### POST

```text
Component
→ raw data
→ Hook
→ cleaning
→ uppercase
→ payload
→ Action
→ Backend
```

### PUT

```text
Component
→ raw data
→ Hook
→ cleaning
→ uppercase
→ payload
→ Action
→ Backend
```

### DELETE

```text
Component
→ Hook
→ Action
→ Backend
```

### GET

A single specialized GET when the only difference is the use of a filter:

```text
getEventAction({ filter: true })
```

or:

```text
getEventAction({ filter: false })
```

### Combined hook

If several hooks are needed:

```text
Hook A
Hook B
   ↓
Combined hook
   ↓
Component
```

Do not combine hook logic directly inside the component.

---

# 25. Mandatory Process Before Modifying Code

Before making changes:

### Step 1

Analyze the current project structure (remember: no `src/`).

### Step 2

Analyze the corresponding feature.

### Step 3

Review the existing components.

### Step 4

Review the existing hooks.

### Step 5

Review the existing actions.

### Step 6

Review `types/index.ts`.

### Step 7

Review the real backend endpoints.

### Step 8

Detect duplications.

Especially:

- duplicate GETs;
- duplicate actions;
- duplicate hooks;
- duplicate types.

### Step 9

Determine what must be modified in the backend.

### Step 10

Implement or fix the actions.

### Step 11

Implement or fix the hooks.

### Step 12

Implement combined hooks when needed.

### Step 13

Finally, adapt the components.

### Step 14

Verify that no component calls an action directly.

### Step 15

Verify that all types and interfaces are in the corresponding `types/index.ts`.

### Step 16

Verify there are no unnecessary duplications.

### Step 17

Verify that all functions are typed arrow functions (parameters and return), with no `any`.

### Step 18

Verify that URLs/routes are in English and all user-visible text is in Spanish.

### Step 19

Verify that no path with `src/` was created or referenced.

---

# 26. Main Rule

The priority is **reuse before duplicating**.

Do not create a new action, hook, endpoint, type or component if a solution that can be correctly reused already exists.

The final architecture must respect:

```text
FEATURE
│
├── components
│      ↓
├── hooks
│      ↓
├── actions
│      ↓
└── backend

types/
└── index.ts
```

And for the dashboard components:

```text
components/
├── dashboard-header.tsx
├── dashboard-body.tsx
├── dashboard-table.tsx
└── dashboard-about-system.tsx
```

The four are **sibling files**, not folders nor components nested by file structure.
