# UI / UX GUIDELINES — ATTENDANCE PORTAL

## 1. Design System & Theme Foundations

The **Attendance Portal** user interface is built on modern enterprise dashboard aesthetics using **Tailwind CSS** and **shadcn/ui** design patterns.

### 1.1 Color Tokens & Dark Mode
- **Theme Engine**: [src/context/ThemeContext.tsx](file:///d:/attendance/attendance-portal-v2/src/context/ThemeContext.tsx) toggles `.dark` class on `document.documentElement`, backed by `localStorage` (`attendance-portal-theme`) with fallback to OS preference (`prefers-color-scheme`).
- **Core Palette**:
  - Background Light: `bg-gray-50` / `bg-white`
  - Background Dark: `dark:bg-gray-900` / `dark:bg-gray-800`
  - Card Surfaces: `bg-white dark:bg-gray-850 dark:border-gray-800`
  - Borders: `border-gray-200 dark:border-gray-700`
  - Text Primary: `text-gray-900 dark:text-gray-100`
  - Text Muted: `text-muted-foreground` / `text-gray-500 dark:text-gray-400`

---

## 2. Status Badge Design Tokens

Attendance records across tables and calendars use standard semantic status tokens ([src/components/ui/badge.tsx](file:///d:/attendance/attendance-portal-v2/src/components/ui/badge.tsx)):

| Status | Badge Color Scheme | Border / Icon |
|---|---|---|
| **Present** | `bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300` | Emerald border, check icon |
| **Late** | `bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300` | Amber border, clock icon |
| **Half-Day** | `bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300` | Orange border, timer icon |
| **Leave** | `bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300` | Purple border, coffee icon |
| **Off** | `bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300` | Red border, alert/x icon |
| **Holiday** | `bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300` | Sky/Blue border, sun icon |

---

## 3. UI Component Primitives

All atomic components live under [src/components/ui/](file:///d:/attendance/attendance-portal-v2/src/components/ui/):
- **Button (`button.tsx`)**: Variant styles (`default`, `destructive`, `outline`, `secondary`, `ghost`, `link`) and sizes (`default`, `sm`, `lg`, `icon`).
- **Card (`card.tsx`)**: Composable containers (`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`).
- **Dialog (`dialog.tsx`)**: Modal overlay with focus trap, backdrop blur, header, body, and footer actions.
- **Table (`table.tsx`)**: Responsive data grid (`TableHeader`, `TableRow`, `TableHead`, `TableBody`, `TableCell`).
- **Tabs (`tabs.tsx`)**: Radix UI tab container with styled tab triggers and content panels.
- **Skeleton (`skeleton.tsx`)**: Pulsing gray placeholder box for async loading states.

---

## 4. Toast Notifications

- **Library**: `sonner` ([src/App.tsx:89](file:///d:/attendance/attendance-portal-v2/src/App.tsx#L89))
- **Configuration**: `<Toaster position="bottom-right" richColors />`
- **Guidelines**:
  - Keep notification text under 12 words.
  - Success toasts: Action confirmed (e.g. `"Attendance marked successfully!"`).
  - Error toasts: Actionable problem description (e.g. `"Failed to mark attendance. Check WiFi connection."`).

---

## 5. Navigation & Layout Structures

- **Employee Portal (`src/routes/employee/Layout.tsx`)**:
  - Horizontal top navigation bar with dynamic company logo, navigation links (`Dashboard`, `Calendar`, `Salary`), theme toggle, and Sign Out button.
- **Admin Portal (`src/routes/admin/Layout.tsx`)**:
  - Desktop: Collapsible sidebar / top navigation header with complete admin section links.
  - Mobile: Slide-out hamburger drawer (`isMobileMenuOpen`) ensuring accessibility on phone screens.
