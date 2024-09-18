## Nextjs SaaS starter with next-auth 5 and authentication and auhtorization for SaaS

A complete setup for SaaS with prisma, next-auth@5, nextjs 14.x for authentication and authorization.

- Nextjs 14.x
- Prisma
- Next-auth 
- Shadcn forms (react-hook-form)

Features:

- [x] Login with credentials
- [x] Password reset
- [x] Registration
- [x] Email support
- [x] Create organizations
- [x] Invite members to organization.

## Getting Started

1. Have a postgres installed, or just use docker:
    
    ```
    docker run --name mypostgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
    ```

2. Copy `.env` to `.env.local` and change env vars to postgres db etc.


3. Install, migrate db and run
    ```bash
    npm install
    npx prisma migrate dev
    npx prisma db seed
    npm run dev
    ```

