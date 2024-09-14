## Nextjs starter with next-auth 5 and authentication and auhtorization

Basic setup:

- Next-auth with Crendetials provider
- Prisma and prisma adapter configured
- Authorization system with Roles and permissions
- See app/ dir for example and prisma setup
- Compatible with edge middleware runtime, as we are using JWT as strategy and use `await authorize()` in the app page.tsx files / layouts.


## Getting Started

Have a postgres installed, or just use docker:

```
docker run --name mypostgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

```bash
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```


## Login details


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
