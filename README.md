# Dream

Minimal accountability platform. Post your dream. Show daily proof. Maintain streak.

## Features

- **Create a Dream** — Set your goal with optional description and link
- **Daily Proof** — Post what you did today to work toward your dream
- **Streak Tracking** — Visualize your consistency
- **Explore** — See what others are building
- **Support** — Optional Venmo link for community support

## Tech Stack

- Next.js 15 (App Router)
- Tailwind CSS
- Supabase (Auth + Database)
- Vercel

## Database Schema

### users
- id (uuid, primary key)
- email (text)
- name (text)
- venmo_url (text, nullable)
- created_at (timestamp)

### dreams
- id (uuid, primary key)
- user_id (uuid, foreign key)
- title (text)
- description (text, nullable)
- dream_link (text, nullable)
- created_at (timestamp)

### proof_posts
- id (uuid, primary key)
- user_id (uuid, foreign key)
- content (text)
- image_url (text, nullable)
- created_at (timestamp)

## Setup

1. Clone the repo
2. Install dependencies: `npm install`
3. Create Supabase project at https://supabase.com
4. Run the SQL schema in Supabase SQL editor
5. Copy `.env.local.example` to `.env.local` and add your Supabase credentials
6. Run locally: `npm run dev`
7. Deploy to Vercel

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Pages

- `/` — Landing page
- `/signup` — Create account
- `/login` — Sign in
- `/create` — Create your dream
- `/profile` — Your profile + proof feed
- `/explore` — Browse all users
- `/user/[id]` — Public user profile

## License

MIT