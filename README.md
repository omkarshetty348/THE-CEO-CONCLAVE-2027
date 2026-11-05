# THE CEO CONCLAVE 2027 – Official Website & Invitation System

**Tagline:** One Platform. Powerful Perspectives.

Invitation-only two-day business leadership event in Bengaluru (22–23 January 2027, proposed).

This is a full-stack Next.js application with:

- Public website (Home, About, Speakers, Agenda, Sponsors, Venue, Request Invitation, Status, Contact, etc.)
- Invitation request engine with admin approval workflow
- Digital pass + QR code generation
- Role-based admin dashboard foundation
- Resend email integration
- Neon PostgreSQL + Prisma
- Browser-only setup (no terminal required after deploy)

---

## Student-Friendly Deployment (No Terminal Required)

### 1. Download & Extract
Download the project ZIP and extract it on your computer.

### 2. Create a GitHub Repository
1. Go to [github.com](https://github.com) and sign in.
2. Click **New repository**.
3. Name it e.g. `ceo-conclave-2027`.
4. Keep it **Public** or **Private**.
5. Do **not** initialise with README.
6. Click **Create repository**.
7. On the next page, click **uploading an existing file**.
8. Drag **all** the extracted project files and folders into the browser and commit.

### 3. Create a Neon Database
1. Go to [console.neon.tech](https://console.neon.tech) and sign up / log in.
2. Create a new project.
3. Copy the **connection string** (it looks like `postgresql://...@...neon.tech/neondb?sslmode=require`).

### 4. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New Project** → Import your `ceo-conclave-2027` repository.
3. Before deploying, open **Environment Variables** and add:

| Variable | Required? | Description |
|----------|-----------|-------------|
| `DATABASE_URL` | **Yes** | Neon connection string |
| `AUTH_SECRET` | **Yes** | Long random string (at least 32 characters). You can generate one at https://generate-secret.vercel.app/32 |
| `NEXT_PUBLIC_APP_URL` | **Yes** | Your Vercel URL, e.g. `https://ceo-conclave-2027.vercel.app` (update after first deploy if needed) |
| `RESEND_API_KEY` | Recommended | From https://resend.com → API Keys |
| `RESEND_FROM_EMAIL` | Recommended | `onboarding@resend.dev` for testing, or your verified domain email |
| `RESEND_FROM_NAME` | Optional | `THE CEO CONCLAVE 2027` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Optional | For image uploads |
| `CLOUDINARY_API_KEY` | Optional | |
| `CLOUDINARY_API_SECRET` | Optional | |

4. Click **Deploy**.

### 5. Run One-Time Setup
1. After deploy succeeds, open: `https://YOUR-APP.vercel.app/setup`
2. Create the first **Super Admin** account (name, email, password).
3. The setup page locks itself after this.
4. Go to `/admin/login` and sign in.

### 6. (Recommended) Seed Full Content
After first login, if speakers/agenda are empty, you can run the seed from the Vercel dashboard using a one-time script, or re-deploy after ensuring the seed runs. The setup creates a minimal event record so the public site works immediately.

---

## What Is Implemented

### Fully Working
- Project structure, Tailwind design system (black + neon purple/blue)
- Prisma schema covering all major entities (users, roles, event, speakers, sessions, sponsors, invitation requests, passes, check-ins, contacts, emails, audit logs, etc.)
- Seed data for roles, permissions, event, speakers, agenda, sponsor categories, form fields, email templates
- Public Home page with countdown, stats, speaker preview, CTA
- About, Speakers, Agenda, Venue, Sponsors, Contact, Privacy, Terms pages
- Invitation Request form + API with validation, duplicate prevention, reference ID
- Request Status page
- Digital pass page with QR
- Browser-only `/setup` page that creates Super Admin
- Admin login (NextAuth credentials) + Dashboard + Requests review (Approve / Waitlist / Reject)
- Email helper (Resend) with template variable replacement
- QR code generation helper
- `.env.example`, `vercel.json`, `.gitignore`
- **No cron jobs** — the site runs without any scheduled background tasks

### Scaffolded / Needs Extension
- Full admin CRUD for speakers, agenda, sponsors, settings
- QR scanner / check-in UI
- Direct invitations
- CSV exports
- Full RBAC enforcement on every admin API route

The database schema and core invitation + auth flow are production-ready foundations. The admin modules and remaining pages follow the same patterns already established.

---

## Local Development (Optional – for developers)

```bash
npm install
cp .env.example .env.local
# Fill DATABASE_URL, AUTH_SECRET, etc.
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

Then open http://localhost:3000/setup

---

## Important Notes

- **Dates, venue, speakers and sponsorships are proposed and subject to confirmation.**
- Never commit real secrets. Use Vercel Environment Variables only.
- For production emails, verify a domain in Resend (do not rely on `onboarding@resend.dev` long-term).
- The hard capacity limit of 180 is configurable in the Event settings (default OFF).

---

## Support

If the public pages show empty data after first deploy, ensure:
1. `DATABASE_URL` is correct and the Neon project is active.
2. You ran `/setup` successfully.
3. Seed data was applied (re-run seed or add content from admin once dashboard modules are extended).

This project is designed so a college student can deploy it by uploading files to GitHub and configuring environment variables in Vercel — no local Node.js or terminal required for the basic live site.
