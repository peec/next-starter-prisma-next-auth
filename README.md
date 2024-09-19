# Nextjs SaaS starter boilerplate


Demo: https://next-starter-saas.vercel.app/

A complete setup for SaaS with prisma, next-auth@5, nextjs 14.x for authentication and authorization.

Customize to your needs.

- Nextjs 14.x
- Prisma
- Next-auth (v5)
- Shadcn
- React-email for designing emails
- Multi-tenant: Organization model schema, shared db.

## Features (and upcoming features):

- [x] Login with credentials
- [x] Password reset
- [x] Registration
- [x] Email support
- [x] Create organizations
- [x] Invite members to organization.
- [x] Organization settings for changing org-name.
- [x] User profile management with change password feature / set password
- [ ] Delete organization
- [ ] Stripe for automated billing

## Getting Started

1. Have a postgres installed, or just use docker:
    
    ```
    docker run --name mypostgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
    ```

2. Copy `.env` to `.env.local` and change env vars to postgres db etc. 
   If you dont need google login provider remove respective env vars in `src/env.server.mjs`

3. Install, migrate db and run
    ```bash
    npm install
    npx prisma migrate dev
    npm run dev
    ```

## Organization Models and security concerns

- ALL models belonging to an organizaiton should have the `orgId` column.
- Always add where { ...., orgId: orgId }
- server actions that is to be used against any organizations should use the `securedOrganizationAction` wrapper ( see `src/lib/action-utils.ts`).



## Prisma studio for development

You can open the prisma studio like so:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/boilerplate-next?schema=public" npx prisma  studio
```
