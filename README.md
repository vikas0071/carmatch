This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# CarMatch — Take-Home Submission
**Role: Software Engineer — AI-Native · CarDekho Group**
**Candidate: Vikas Bishnoi**

---

Hi team,

Please find my take-home assignment submission below.

## Deliverables

- **Build Process Recording:** https://drive.google.com/file/d/13H9I_2xcj0m4i_Fg-hQzE1NsRyWPgY4Q/view?usp=sharing
- **Deployed App Demo:** https://drive.google.com/file/d/16LbDYePQRR0QW1LwHSaS-Jlrbg0Kbp3C/view?usp=sharing
- **GitHub Repo:** https://github.com/vikas0071/carmatch
- **Live URL:** https://carmatch-q1yx69u88-vikas-bishnois-projects.vercel.app

## Quick Summary

I built **CarMatch** — an AI-powered car recommendation assistant that takes a confused buyer through a 5-question quiz and returns a personalized shortlist of 3 cars, with Claude explaining *why* each car fits their specific profile.

**Stack:** Next.js 14 + Tailwind + SQLite (Prisma) + Claude API (`claude-sonnet-4-20250514`) + Vercel

**What's working end-to-end:**
- Quiz onboarding flow (budget, use case, fuel type, features, priority)
- AI-powered recommendations via `/api/recommend` — Claude receives full car dataset + user answers, returns structured JSON shortlist with match reasoning
- Car detail page with full specs, pros/cons
- Side-by-side comparison of two cars
- 35-car seed dataset (Indian market, ₹5L–₹35L range)
- Deployed on Vercel, runs locally with `npm run dev`

**What I cut:** Auth, real images, mobile polish, unit tests, follow-up chat (scoped but deprioritized to protect the core flow).

The README covers tech decisions, AI tool usage, and what I'd add with more time.

Thanks for reviewing!