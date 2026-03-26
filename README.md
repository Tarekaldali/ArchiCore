# ArchiCore

ArchiCore is a Next.js application for an architecture-focused website with public pages, blog and news sections, project listings, and an admin area for managing content.

## Requirements

- Node.js 18 or newer
- npm
- MongoDB database

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
copy .env.example .env
```

3. Update `.env` with your own values.

## Environment Variables

The project expects these variables:

- `MONGODB_URI`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Use `.env.example` as the template.

## Run the Project

Start the development server:

```bash
npm run dev
```

Then open:

```bash
http://localhost:3000
```

## Available Scripts

- `npm run dev` - start the app in development mode
- `npm run build` - build the app for production
- `npm run start` - run the production build
- `npm run lint` - run ESLint
- `npm run seed` - reset and seed initial data
- `npm run seed -- --keep-existing` - add seed data without clearing existing records

## Teacher Quick Start

Use these commands on a fresh machine:

```bash
npm install
copy .env.example .env
# fill .env values (especially MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD, NEXTAUTH_SECRET)
npm run seed
npm run dev
```

## Seeding Data

`npm run seed` now populates:

- projects
- team
- services
- blogs
- news
- default home/about content
- default site settings

If `.env` exists, the seed script auto-loads it.

## Notes

- The app uses Next.js App Router.
- Admin pages are available under `/admin`.
- Public pages include home, about, services, projects, blog, news, and contact.
