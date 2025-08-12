# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is OrthoPlannerCloud - a full-stack web application for orthodontic treatment planning and client management. The project consists of:

- **Frontend**: React + TypeScript + Vite SPA with TailwindCSS and Radix UI components
- **Backend**: Supabase (PostgreSQL database with Row Level Security, Authentication, Real-time subscriptions)
- **Database Schema**: Custom `op3dcloud` schema with clients, patients, users, and role-based access control

## Development Commands

### Frontend (from `frontend/` directory)
```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Linting and formatting (uses Biome)
pnpm lint      # Lint and auto-fix
pnpm format    # Format code
pnpm check     # Combined lint + format
```

### Supabase (from project root)
```bash
# Start local Supabase development environment
supabase start

# Stop local environment
supabase stop

# Reset database (applies migrations and seeds)
supabase db reset

# Generate TypeScript types
supabase gen types typescript --local --schema op3dcloud > frontend/src/types/db/database.types.ts

# Create new migration
supabase migration new <migration_name>

# Push to remote (production)
supabase db push
```

## Architecture

### Frontend Structure
- **Pages**: Route-based page components in `src/pages/`
  - `clients/` - Client management (main dashboard)
  - `patient/` - Patient management and creation
  - `sign-in/`, `register/` - Authentication pages
- **Components**: Reusable UI components in `src/components/`
  - `ui/` - Base Radix UI components with custom styling
- **Services**: API layer in `src/services/supabase/`
  - Each service handles specific domain operations (clients, patients, users, auth)
- **State Management**: Zustand stores in `src/state/stores/`
- **Router**: React Router v7 with route guards for authentication

### Database Architecture
- **Custom Schema**: `op3dcloud` (not `public`)
- **Role-Based Access**: Users have roles (client, planner) via `user_has_role` junction table
- **Views**: Simplified data access via `view_clients`, `view_planners`
- **Functions**: Database functions for role assignment
- **RLS**: Row Level Security policies control data access

### Key Patterns
- **Authentication**: Supabase Auth with custom role management
- **Type Safety**: Auto-generated TypeScript types from Supabase schema
- **State Management**: Zustand for global state (user, theme, modals, sidebar)
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: TailwindCSS with custom design system via Radix UI
- **Code Quality**: Biome for linting/formatting (tab indentation, 80 char width)

### Environment Variables
Frontend requires these environment variables in `.env`:
```
VITE_SUPABASE_PROJECT_URL=
VITE_SUPABASE_API_KEY=
VITE_SUPABASE_SERVICE_ROLE=
VITE_SUPABASE_SCHEMA=op3dcloud
```

## Important Notes

- **Schema**: Always work with `op3dcloud` schema, not `public`
- **Types**: Regenerate database types after schema changes
- **Migrations**: Use structured approach with separate files for different DB objects (schema, tables, views, functions)
- **RLS**: All database access is controlled by Row Level Security policies
- **Roles**: Users must have appropriate roles to access different parts of the application
- **Component Library**: Use existing Radix UI components from `src/components/ui/` rather than creating new ones
- **Code Style**: Follow Biome configuration (tabs, double quotes, 80 char width)

## Testing and Quality

Run these commands before committing:
```bash
pnpm check  # Lint and format
pnpm build  # Ensure build succeeds
```

The project uses Biome for code quality with strict rules enabled. Always run linting before commits.