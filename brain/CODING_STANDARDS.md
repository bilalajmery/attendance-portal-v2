# CODING STANDARDS & CONVENTIONS — ATTENDANCE PORTAL

This document outlines the coding patterns, conventions, and style rules observed across the **Attendance Portal** codebase. All new code must adhere to these established standards.

---

## 1. TypeScript & Type Definitions

- **Strict Typing**: All variables, function parameters, and return types should be typed where reasonable. Do not use `any` unless required for complex Firestore mutation payloads.
- **Centralized Data Models**: Shared interfaces belong in [src/types/index.ts](file:///d:/attendance/attendance-portal-v2/src/types/index.ts).
- **Firestore Timestamps**: Distinguish JavaScript `Date` objects from Firebase `Timestamp` objects. Use helper `getSafeDate()` when dealing with values that could be serialized strings or Timestamps.
- **Null Safety**: Always handle possible `null` or `undefined` returns from Firestore `getDoc()`.

---

## 2. React Components & Hooks

- **Component Structure**: Functional components with explicit `React.FC` or `React.FC<Props>` typing:
  ```tsx
  export const MyComponent: React.FC<MyComponentProps> = ({ propA, propB }) => { ... };
  ```
- **State Management**: Prefer local component state (`useState`) for UI-only variables; use React Context (`useAuth()`, `useSettings()`, `useTheme()`) for cross-cutting state.
- **Async Data Fetching**: Encapsulate async logic within named functions (`loadData = async () => { ... }`) invoked inside `useEffect()`.
- **Loading Skeletons**: Use `<Skeleton className="..." />` from `src/components/ui/skeleton.tsx` instead of generic spinners during initial page loads.

---

## 3. Styling & Tailwind CSS

- **Tailwind Utility Classes**: Avoid custom CSS files. Apply Tailwind utility classes directly in `className`.
- **Class Merging**: Always use the `cn(...)` utility ([src/lib/utils.ts](file:///d:/attendance/attendance-portal-v2/src/lib/utils.ts)) when merging conditional or external class names:
  ```tsx
  import { cn } from "../../lib/utils";
  <div className={cn("base-classes", isCondition && "conditional-classes", className)} />
  ```
- **Dark Mode Support**: Every surface must support light and dark theme classes using Tailwind's `dark:` prefix:
  ```tsx
  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700"
  ```
- **Consistent Colors**:
  - Present: `emerald` / `green`
  - Late: `amber` / `yellow`
  - Half-Day: `orange`
  - Leave: `purple`
  - Off: `red` / `destructive`
  - Holiday: `blue` / `sky`

---

## 4. Date & Time Manipulation

- **Standard Library**: Exclusively use `date-fns` (version 3.x).
- **Date String Format**: Standardize on `"yyyy-MM-dd"` for document IDs and keys.
- **Time String Format**: Standardize on `"HH:mm"` for 24-hour configurations and `"hh:mm a"` for 12-hour display.
- **Safe Interval Handling**: Use `eachDayOfInterval` and `isWithinInterval` for multi-day ranges.

---

## 5. Error Handling & User Feedback

- **Toaster Notifications**: Use `sonner` via `toast.success("...")`, `toast.error("...")`, and `toast.info("...")`.
- **User-Facing Errors**: Never display raw error stack traces to users. Catch errors, log details via `console.error()`, and display a helpful message:
  ```tsx
  try {
    await performAction();
    toast.success("Action completed successfully");
  } catch (error: any) {
    console.error("Action failed:", error);
    toast.error(error.message || "Failed to perform action");
  }
  ```

---

## 6. Import Path Conventions

- While `tsconfig.json` and `vite.config.ts` configure the `@/` path alias pointing to `./src/`, the codebase underwent an import flattening migration (`fix-imports.*`) to use explicit **relative paths** (e.g. `../../lib/firestore`).
- Maintain relative path consistency within existing subdirectories unless modifying the entire module.
