# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: Firebase Realtime Database (web SDK; project `vibeglobally-79ca7`, asia-southeast1)
- **Validation**: Zod (`zod/v4`)
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## VibeGlobally Admin Features

### Existing Admin Pages
- `/admin` — Dashboard with stats overview
- `/admin/contacts` — Lead/contact management (status, search, delete)
- `/admin/testimonials` — Testimonial CRUD (add, delete, display)

### Content Editor Pages (new)
All are accessible via the "Content Editor" collapsible in the admin sidebar:
- `/admin/edit-hero` — Edit hero section (badge, headline, sub-headline, tagline, stats)
- `/admin/edit-services` — Edit service cards (title, description, highlight flag, reorder)
- `/admin/edit-results` — Edit metrics and work history entries
- `/admin/edit-tools` — Manage CRM tools and industries lists (add/remove tags)
- `/admin/edit-clients` — Edit clients section heading and the list of client names
- `/admin/edit-values` — Edit the VIBE framework heading and value pillars (letter / word / description)
- `/admin/edit-contact` — Edit contact section heading, process steps, contact details (email / phone / address), and form labels

### Content Storage (Firebase Realtime Database)
- `lib/db` exposes typed repositories (`contactsRepo`, `testimonialsRepo`, `siteContentRepo`) backed by the Firebase Web SDK
- RTDB paths: `/contacts/{pushKey}`, `/testimonials/{pushKey}`, `/site_content/{section}`
- IDs are Firebase push keys (strings) — the OpenAPI spec uses `type: string` for `id`
- API routes: `GET /api/content/:section` (public) and `PUT /api/content/:section` (auth required)
- Sections: `hero`, `services`, `results`, `tools`, `clients`, `values`, `contact`
- All public landing page components fetch live from the API with hardcoded fallback defaults
- Fixed orval zod codegen config (`mode: "single"` with absolute target path) to avoid workspace index regeneration bug

### Firebase Setup Notes
- Config is hard-coded in `lib/db/src/firebase.ts` (project `vibeglobally-79ca7`, asia-southeast1)
- The Realtime Database security rules must allow the API server to read/write the `/contacts`, `/testimonials`, and `/site_content` paths
- Avoid using `orderByChild` + `equalTo` queries unless `.indexOn` rules are added; current repo implementation filters in-memory
