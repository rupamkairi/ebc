# Agent Instructions (ebc Frontend)

You are an AI assistant designed to navigate, understand, and modify the `ebc` frontend application. 
This application is a Next.js App Router based marketplace platform serving multiple user domains (Admin, Buyer, Seller).

## Primary Knowledge Source
Read `Context.md` in this directory to understand the file structure, route architecture, and data fetching paradigms.
Read `../CodeMap.md` to understand how this frontend connects to the `ebc-server`.

## Workflow Priorities
1. **Consistency**: Always align your generated React code with the existing styling conventions (Tailwind). Utilize existing UI components from `src/components/ui`.
2. **Layer Separation**: Maintain clean separation. 
   - UI code stays in `src/components/` and `src/app/`.
   - Data fetching mutations stay in `src/queries/`.
   - Network requests stay in `src/services/`.
   - Global or multi-step form states stay in `src/store/`.
3. **i18n Compliance**: Remember to add necessary locale strings to `src/i18n/locales/` when adding new user-facing text.

When assigned a task, verify the location of files using the `Context.md` directory outlines before diving into code modifications.
