## Nextjs starter with next-auth 5 and authentication and auhtorization

A basic setup with prisma, next-auth@5, nextjs 14.x for authentication and authorization.

- Nextjs 14.x
- Prisma
- Next-auth 
  - configured with Credentials, 
  - JWT 
  - custom method for redirection to login based on authorization.
  - Due to the nextjs still only having edge runtime in the middleware (WTF?!).. This repo does not run any prisma in the middleware (edge), which mean auhtorization is done on each page or in layout with  `await authorize()`

Basic setup:

- Next-auth with Crendetials provider
- Prisma and prisma adapter configured
- Authorization system with Roles and permissions
- See app/ dir for example and prisma setup
- Compatible with edge middleware runtime, as we are using JWT as strategy and use `await authorize()` in the app page.tsx files / layouts.

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


### Default login details

the `prisma/seed.ts` file will create some test accounts, and create some user roles and example permissions, modify this file to suit your needs

Admin account

```
email: admin@admin.com
password: admin
```

Contributor account (example of role based autorization with permission system)

```
email: contributor@contributor.com
password: contributor
```

