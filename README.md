# Web-Sprint 2026 — NMIMS Indore ACM Student Chapter

> **Preserving Legacy. Showcasing Innovation.**
> Two Years of Innovation. One Digital Legacy.

Award-ready ACM Student Chapter website built with React, Tailwind CSS, Framer Motion, Express, and MongoDB.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS 4, Framer Motion |
| Backend | Node.js, Express, MongoDB (Mongoose) |
| Auth | JWT (Admin Dashboard) |
| Deploy | Vercel (frontend), Render/Railway (backend) |

## Project Structure

```
acm/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI, layout, home sections
│   │   ├── pages/          # All 11 public pages + admin
│   │   ├── context/        # Theme (dark/light)
│   │   ├── hooks/          # useFetch
│   │   ├── services/       # API client
│   │   └── data/           # Static fallback data
│   └── public/images/      # Brand assets
├── server/                 # Express API
│   └── src/
│       ├── models/         # 12 MongoDB schemas
│       ├── routes/         # REST API
│       ├── controllers/    # Business logic
│       └── middleware/     # Auth, errors
└── package.json            # Root scripts
```

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Install dependencies

```bash
npm install
cd client && npm install
cd ../server && npm install
```

### 2. Configure environment

```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your MongoDB URI and JWT secret.

### 3. Seed database

```bash
npm run seed
```

Default admin: `admin@acm-nmimsindore.org` / `Admin@2026`

### 4. Run development

```bash
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:5000/api

## Pages

1. **Home** — Hero, stats, vision, events, projects, CTA
2. **About** — ACM global, chapter history, timeline, values
3. **Events** — Archive with search & filters, detail pages
4. **Gallery** — Masonry layout, lightbox, category filters
5. **Team** — Leadership cards with layered typography
6. **Projects** — Showcase with tech badges, GitHub links
7. **Achievements** — Awards dashboard & timeline
8. **Live** — Real-time announcements & countdown
9. **Membership** — Registration form, FAQ, benefits
10. **Blog** — Technical posts & newsletter
11. **Contact** — Form, map, social links

## Admin Dashboard

Access at `/admin/login` — manage events, team, projects, gallery, blogs, and view analytics.

## Deployment

### Frontend (Vercel)

```bash
cd client
vercel --prod
```

Set `VITE_API_URL` to your production API URL.

### Backend (Render/Railway)

Deploy `server/` with environment variables from `.env.example`.

## Database Collections

Events, Gallery, Team Members, Projects, Achievements, Blogs, Members, Recruitment Applications, Announcements, Statistics, Contacts, Users

## License

MIT — NMIMS Indore ACM Student Chapter
