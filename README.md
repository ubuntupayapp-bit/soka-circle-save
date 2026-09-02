# Soka Together

Build a mobile-first web app called SOKA — a social savings app where groups pool small contributions toward everyday essentials (groceries, school supplies, electricity) and then pay for them together. Use mock/local data for now; no real backend or auth needed, I'll be wiring that separately.

## Brand and tone

- Warm, community-first, financially empowering — not corporate-fintech, not childish

- Primary use context: South African users on mobile, often mid-range Android phones, so keep the UI lightweight and legible over flashy

- Color direction: warm, optimistic palette — avoid using MTN's yellow/black brand colors as the app's own identity, since this runs inside their platform as a distinct Mini App, not a re-skin of MoMo itself. Pick a palette that feels distinct from MTN's branding (e.g. a warm teal/coral or deep green/gold pairing) so SOKA reads as its own product

- Typography: clean, highly legible sans-serif, generous tap targets (this is a payments-adjacent app, precision matters)

- Avoid generic AI-template look: no default purple gradients, no cookie-cutter SaaS hero sections — this is a utility app people will open quickly and often, so prioritize clarity and speed-to-action over decoration

## Screens to build (in this order)

1. **Discover** — a simple category picker: Groceries, School Supplies, Electricity, Household, Other. Each category as a large, tappable card with an icon.

2. **Create Goal** — form with: goal title, category (pre-filled from Discover), target amount (ZAR), deadline (date picker). Show a simple preview of the goal card as they fill it in.

3. **Circle** — after creating a goal, show an invite screen: a shareable link/code prominently displayed with a copy button, and a list of members who've joined so far (mock 2-3 sample members with avatars/initials).

4. **Contribute** — a screen to enter a contribution amount with quick-select buttons (R20, R50, R100, custom), a clear "Contribute via MoMo" primary action button, and three visual states to design: pending (spinner/waiting), success (checkmark + updated total), and failed (error state with retry).

5. **Progress dashboard** — the main "my goals" view: goal cards each showing a progress bar, "R1,050 / R1,500 — 70% funded", days remaining, and member avatars. Tapping a goal opens its detail view (contribution history list + the Contribute action).

6. **SOKA Boost nudge** — a dismissible card/banner design that appears on the goal detail view when a goal is close to its deadline and mostly funded, e.g. "You're R150 away — invite someone to add R50" with a share action. Should feel encouraging, not alarming.

7. **Buy Essentials** — appears on a goal detail view once it hits 100% funded. Shows a simple list of merchant/bundle options (mock 3-4 sample essentials bundles with names and prices), a selection state, and a "Confirm Purchase" action.

8. **Purchase confirmation** — success screen after Buy Essentials: receipt-style summary (goal name, amount, merchant, date), and a "Done" action that would return the user to MoMo (just make this a button for now).

## Technical constraints (important)

- Must be installable as a PWA — include a manifest.json and basic service worker

- Build with React (not Lovable's other framework options) so it's straightforward to hand off to a separate Node/Express backend

- Keep all components small and composable — I'll need to lift state up and wire real API calls into them afterward, so avoid deeply nested logic baked into single mega-components

- Use realistic mock data throughout (sample goals, sample members, sample bundles) so the flow feels alive when demoed as-is

Build all 8 screens with working navigation between them using mock data end to end, so the full Save → Pool → Pay loop can be clicked through before any real backend is connected.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a533d15f-d9db-4be2-ba80-665c093f1230).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
