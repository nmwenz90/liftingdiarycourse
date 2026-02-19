# UI Coding Standards

## Component Library

All UI components in this project must use **shadcn/ui**. No custom components should be created. If a UI element is needed, use the corresponding shadcn/ui component or compose existing shadcn/ui components together.

- Use `npx shadcn@latest add <component>` to add new components
- Components are installed to `src/components/ui/`
- Do not modify the generated shadcn/ui component files unless absolutely necessary for theming
- Do not create custom wrapper components — use shadcn/ui components directly in pages and layouts

## Date Formatting

All dates must be formatted using **date-fns** with the `do MMM yyyy` format pattern.

```ts
import { format } from "date-fns";

format(new Date(2025, 8, 1), "do MMM yyyy");  // "1st Sep 2025"
format(new Date(2026, 7, 2), "do MMM yyyy");  // "2nd Aug 2026"
format(new Date(2026, 0, 3), "do MMM yyyy");  // "3rd Jan 2026"
format(new Date(2027, 5, 4), "do MMM yyyy");  // "4th Jun 2027"
```

Do not use `toLocaleDateString()`, `Intl.DateTimeFormat`, or any other date formatting approach.
