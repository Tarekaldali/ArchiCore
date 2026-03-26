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
- `npm run seed` - seed initial data

## Seeding Data

If you want initial sample data, run:

```bash
npm run seed
```

## Notes

- The app uses Next.js App Router.
- Admin pages are available under `/admin`.
- Public pages include home, about, services, projects, blog, news, and contact.

