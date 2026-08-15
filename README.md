Downgrade tsx package version to `4.19.2` for Big Sur support.

## Local dev
`npm run dev:dependencies:start` - brings up db and redis
`npm run dev` - runs webserver with live reloading

## Prisma migrations

Development
After editing `schema.prisma`:
`npx prisma migrate dev --name <migration name>`

Check status
`npx prisma migrate status`

Regenerate prisma client files
`npx prisma generate`

Production
`npm run db:migrate:ci`