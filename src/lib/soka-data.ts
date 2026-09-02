export type CategoryId = "groceries" | "school" | "electricity" | "household" | "other";

export type Category = {
  id: CategoryId;
  label: string;
  blurb: string;
  icon: "cart" | "book" | "bolt" | "home" | "sparkle";
};

export const CATEGORIES: Category[] = [
  { id: "groceries", label: "Groceries", blurb: "Monthly food basket", icon: "cart" },
  { id: "school", label: "School Supplies", blurb: "Uniforms, books, stationery", icon: "book" },
  { id: "electricity", label: "Electricity", blurb: "Prepaid units for the month", icon: "bolt" },
  { id: "household", label: "Household", blurb: "Cleaning & home essentials", icon: "home" },
  { id: "other", label: "Other", blurb: "Anything your circle needs", icon: "sparkle" },
];

export type Member = { id: string; name: string; initials: string };

export type Contribution = {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  date: string;
  status: "success" | "pending" | "failed";
};

export type Goal = {
  id: string;
  title: string;
  category: CategoryId;
  target: number;
  deadline: string;
  code: string;
  members: Member[];
  contributions: Contribution[];
  purchase?: { bundleId: string; bundleName: string; merchant: string; amount: number; date: string };
  boostDismissed?: boolean;
};

export type Bundle = {
  id: string;
  name: string;
  merchant: string;
  price: number;
  items: string;
};

export const BUNDLES: Bundle[] = [
  { id: "b1", name: "Family Food Basket", merchant: "Shoprite", price: 1500, items: "Maize meal 10kg, rice, oil, tinned goods, sugar" },
  { id: "b2", name: "Essentials Starter Box", merchant: "Boxer", price: 950, items: "Bread, milk, eggs, pap, soup mix" },
  { id: "b3", name: "School Kit Bundle", merchant: "PEP", price: 1200, items: "Stationery pack, exercise books, backpack" },
  { id: "b4", name: "Prepaid Electricity 500 units", merchant: "Eskom", price: 800, items: "Token delivered by SMS" },
];

export const ME: Member = { id: "m0", name: "You", initials: "YO" };

const THANDI: Member = { id: "m1", name: "Thandi Mokoena", initials: "TM" };
const SIPHO: Member = { id: "m2", name: "Sipho Dlamini", initials: "SD" };
const NALEDI: Member = { id: "m3", name: "Naledi Khumalo", initials: "NK" };

const SAMPLE_MEMBERS: Member[] = [ME, THANDI, SIPHO, NALEDI];

const DAY_MS = 86_400_000;

/** Local calendar date N days from today, as YYYY-MM-DD. */
function daysFromNow(n: number) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Full ISO timestamp N days ago (staggered mid-morning so it always reads realistically). */
function daysAgo(n: number, hour = 9) {
  const d = new Date();
  d.setHours(hour, 30, 0, 0);
  d.setDate(d.getDate() - n);
  return d.toISOString();
}


export const SAMPLE_GOALS: Goal[] = [
  {
    id: "g1",
    title: "October Food Basket",
    category: "groceries",
    target: 1500,
    deadline: daysFromNow(3),
    code: "SOKA-4KZ9",
    members: SAMPLE_MEMBERS,
    contributions: [
      { id: "c1", memberId: "m1", memberName: "Thandi Mokoena", amount: 500, date: daysAgo(11, 8), status: "success" },
      { id: "c2", memberId: "m2", memberName: "Sipho Dlamini", amount: 300, date: daysAgo(6, 13), status: "success" },
      { id: "c3", memberId: "m0", memberName: "You", amount: 250, date: daysAgo(2, 18), status: "success" },
    ],
  },
  {
    id: "g2",
    title: "Grade 4 School Kit",
    category: "school",
    target: 1200,
    deadline: daysFromNow(12),
    code: "SOKA-7HQ2",
    members: [ME, THANDI, NALEDI],
    contributions: [
      { id: "c4", memberId: "m0", memberName: "You", amount: 200, date: daysAgo(5, 10), status: "success" },
      { id: "c5", memberId: "m3", memberName: "Naledi Khumalo", amount: 150, date: daysAgo(1, 16), status: "success" },
    ],
  },
  {
    id: "g3",
    title: "Prepaid Electricity — Block C",
    category: "electricity",
    target: 800,
    deadline: daysFromNow(0),
    code: "SOKA-2VD8",
    members: [ME, SIPHO],
    contributions: [
      { id: "c6", memberId: "m2", memberName: "Sipho Dlamini", amount: 450, date: daysAgo(8, 7), status: "success" },
      { id: "c7", memberId: "m0", memberName: "You", amount: 350, date: daysAgo(3, 14), status: "success" },
    ],
  },
];

export const NEW_MEMBER_POOL: Member[] = [
  { id: "m4", name: "Lerato Nkosi", initials: "LN" },
  { id: "m5", name: "Bongani Zulu", initials: "BZ" },
];

export function funded(goal: Goal) {
  return goal.contributions
    .filter((c) => c.status === "success")
    .reduce((sum, c) => sum + c.amount, 0);
}

export function percent(goal: Goal) {
  return Math.min(100, Math.round((funded(goal) / goal.target) * 100));
}

/** Parse a YYYY-MM-DD or full ISO string; seconds-based epoch numbers are upscaled. */
function parseDate(input: string | number | undefined | null): Date | null {
  if (input === undefined || input === null || input === "") return null;
  if (typeof input === "number") {
    const ms = input < 1e11 ? input * 1000 : input;
    const dn = new Date(ms);
    return Number.isNaN(dn.getTime()) ? null : dn;
  }
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(input);
  const d = new Date(dateOnly ? `${input}T12:00:00` : input);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function daysLeft(goal: Goal) {
  const due = parseDate(goal.deadline);
  if (!due) return 0;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfDue = new Date(due);
  startOfDue.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((startOfDue.getTime() - startOfToday.getTime()) / DAY_MS));
}

export function formatZar(amount: number) {
  // Manual grouping keeps SSR and client output identical regardless of locale.
  return "R" + Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDate(iso: string) {
  const d = parseDate(iso);
  if (!d) return "Date unavailable";
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function formatDateTime(iso: string) {
  const d = parseDate(iso);
  if (!d) return "Date unavailable";
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${formatDate(iso)}, ${hh}:${mm}`;
}


export function categoryOf(id: CategoryId) {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1]!;
}
