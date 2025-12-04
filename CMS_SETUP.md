# Kreatale CMS Setup Guide

## Prerequisites

1. **PostgreSQL Database**: You need a PostgreSQL database (can be Vercel Postgres, Supabase, Neon, Railway, or self-hosted)
2. **Environment Variables**: Set up your `.env.local` file

## Initial Setup

### 1. Configure Environment Variables

Create or update `.env.local` with the following:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Vercel Blob Storage (for media uploads)
BLOB_READ_WRITE_TOKEN=your-blob-token-here
```

**Generate NEXTAUTH_SECRET**:

```bash
openssl rand -base64 32
```

### 2. Set Up Database

Generate and run migrations:

```bash
# Generate migration files
npm run db:generate

# Push schema to database (or run migrations)
npm run db:push
```

### 3. Create First Admin User

```bash
npm run create-admin <email> <password> [name]
```

Example:

```bash
npm run create-admin admin@example.com mypassword123 "Admin User"
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. Access Admin Panel

Navigate to: `http://localhost:3000/admin/login`

## Database Commands

- `npm run db:generate` - Generate migration files from schema changes
- `npm run db:push` - Push schema changes directly to database (development)
- `npm run db:migrate` - Run migrations (production)
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Project Structure

```
src/
├── app/
│   ├── admin/              # Admin dashboard routes
│   │   ├── login/         # Login page
│   │   ├── posts/         # Blog post management
│   │   ├── projects/      # Project management
│   │   ├── media/         # Media library
│   │   └── users/         # User management
│   └── api/
│       └── auth/          # NextAuth API routes
│       └── cms/           # CMS API routes
├── lib/
│   └── cms/
│       ├── db/            # Database schema and client
│       ├── auth/          # Authentication configuration
│       ├── permissions.ts # RBAC permissions
│       └── queries/       # Database queries
└── components/
    └── cms/               # CMS React components
```

## Roles & Permissions

- **super_admin**: Full access to everything
- **admin**: Can manage content and media, view users
- **editor**: Can create, edit, and publish content
- **author**: Can create and edit own content (cannot publish)
- **viewer**: Read-only access

## Next Steps

1. Set up your database connection
2. Run migrations
3. Create your first admin user
4. Start building content!

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check database is accessible from your network
- Ensure database exists

### Authentication Issues

- Make sure `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your domain
- Check admin user was created successfully

### Migration Issues

- Run `npm run db:push` for development
- Use `npm run db:migrate` for production
- Check Drizzle Studio: `npm run db:studio`

