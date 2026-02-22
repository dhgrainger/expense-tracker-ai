import { Expense } from "@/types/expense";

function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function ts(daysAgoN: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgoN);
  return d.toISOString();
}

export const SAMPLE_EXPENSES: Expense[] = [
  // This month
  {
    id: makeId(),
    date: daysAgo(1),
    amount: 67.43,
    category: "Food",
    description: "Weekly grocery run - Whole Foods",
    createdAt: ts(1),
  },
  {
    id: makeId(),
    date: daysAgo(2),
    amount: 14.5,
    category: "Transportation",
    description: "Uber ride to airport",
    createdAt: ts(2),
  },
  {
    id: makeId(),
    date: daysAgo(3),
    amount: 120.0,
    category: "Bills",
    description: "Electric bill - October",
    createdAt: ts(3),
  },
  {
    id: makeId(),
    date: daysAgo(4),
    amount: 38.75,
    category: "Food",
    description: "Dinner at Trattoria Roma",
    createdAt: ts(4),
  },
  {
    id: makeId(),
    date: daysAgo(5),
    amount: 89.99,
    category: "Entertainment",
    description: "Annual Spotify subscription",
    createdAt: ts(5),
  },
  {
    id: makeId(),
    date: daysAgo(7),
    amount: 145.2,
    category: "Shopping",
    description: "Amazon - home office supplies",
    createdAt: ts(7),
  },
  {
    id: makeId(),
    date: daysAgo(8),
    amount: 22.0,
    category: "Food",
    description: "Lunch with coworkers",
    createdAt: ts(8),
  },
  {
    id: makeId(),
    date: daysAgo(10),
    amount: 55.0,
    category: "Bills",
    description: "Internet bill",
    createdAt: ts(10),
  },
  {
    id: makeId(),
    date: daysAgo(12),
    amount: 31.5,
    category: "Transportation",
    description: "Monthly bus pass",
    createdAt: ts(12),
  },
  {
    id: makeId(),
    date: daysAgo(14),
    amount: 200.0,
    category: "Entertainment",
    description: "Concert tickets x2",
    createdAt: ts(14),
  },
  // Last month
  {
    id: makeId(),
    date: daysAgo(35),
    amount: 72.1,
    category: "Food",
    description: "Grocery shopping - Trader Joe's",
    createdAt: ts(35),
  },
  {
    id: makeId(),
    date: daysAgo(37),
    amount: 250.0,
    category: "Bills",
    description: "Phone bill - family plan",
    createdAt: ts(37),
  },
  {
    id: makeId(),
    date: daysAgo(40),
    amount: 88.5,
    category: "Transportation",
    description: "Gas fill-up",
    createdAt: ts(40),
  },
  {
    id: makeId(),
    date: daysAgo(42),
    amount: 195.0,
    category: "Shopping",
    description: "Winter clothing haul",
    createdAt: ts(42),
  },
  {
    id: makeId(),
    date: daysAgo(45),
    amount: 45.0,
    category: "Entertainment",
    description: "Movie night - tickets + popcorn",
    createdAt: ts(45),
  },
  {
    id: makeId(),
    date: daysAgo(48),
    amount: 29.99,
    category: "Entertainment",
    description: "Netflix subscription",
    createdAt: ts(48),
  },
  {
    id: makeId(),
    date: daysAgo(50),
    amount: 340.0,
    category: "Bills",
    description: "Home insurance premium",
    createdAt: ts(50),
  },
  {
    id: makeId(),
    date: daysAgo(55),
    amount: 18.5,
    category: "Food",
    description: "Coffee & snacks for the week",
    createdAt: ts(55),
  },
  // Two months ago
  {
    id: makeId(),
    date: daysAgo(65),
    amount: 80.25,
    category: "Food",
    description: "Grocery run - Safeway",
    createdAt: ts(65),
  },
  {
    id: makeId(),
    date: daysAgo(68),
    amount: 112.0,
    category: "Transportation",
    description: "Car service & oil change",
    createdAt: ts(68),
  },
  {
    id: makeId(),
    date: daysAgo(72),
    amount: 75.0,
    category: "Entertainment",
    description: "Museum annual pass",
    createdAt: ts(72),
  },
  {
    id: makeId(),
    date: daysAgo(75),
    amount: 420.0,
    category: "Bills",
    description: "Quarterly water & sewage",
    createdAt: ts(75),
  },
  {
    id: makeId(),
    date: daysAgo(78),
    amount: 310.0,
    category: "Shopping",
    description: "New running shoes - Nike",
    createdAt: ts(78),
  },
  {
    id: makeId(),
    date: daysAgo(80),
    amount: 42.0,
    category: "Other",
    description: "Haircut & tip",
    createdAt: ts(80),
  },
  // Three months ago
  {
    id: makeId(),
    date: daysAgo(95),
    amount: 63.0,
    category: "Food",
    description: "Farmers market haul",
    createdAt: ts(95),
  },
  {
    id: makeId(),
    date: daysAgo(98),
    amount: 180.0,
    category: "Bills",
    description: "Electric + gas combined",
    createdAt: ts(98),
  },
  {
    id: makeId(),
    date: daysAgo(100),
    amount: 250.0,
    category: "Shopping",
    description: "Birthday gifts for family",
    createdAt: ts(100),
  },
  {
    id: makeId(),
    date: daysAgo(105),
    amount: 35.0,
    category: "Transportation",
    description: "Parking fees for the month",
    createdAt: ts(105),
  },
  {
    id: makeId(),
    date: daysAgo(110),
    amount: 99.0,
    category: "Entertainment",
    description: "Video game purchase",
    createdAt: ts(110),
  },
];
