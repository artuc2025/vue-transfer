// server/api/transfer.post.ts
import { defineEventHandler, readBody } from "h3";
import { initialAccounts, initialCards } from "../mockData";

const cloneDeep = <T>(obj: T): T => {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(cloneDeep) as unknown as T;
  const clonedObj: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = cloneDeep(obj[key]);
    }
  }
  return clonedObj;
};

export default defineEventHandler(async (event) => {
  // use readBody instead of useBody
  const { fromType, fromId, toType, toId, amount } = await readBody(event);

  // Deep‑clone so we don’t mutate the originals
  const accounts = cloneDeep(initialAccounts);
  const cards = cloneDeep(initialCards);

  // Helper to find and adjust
  const adjust = (
    list: any[],
    id: string | number,
    field: "balance" | "limit",
    delta: number
  ) => {
    const item = list.find((i) => String(i.id) === String(id));
    if (!item) throw new Error(`Item ${id} not found`);
    item[field] = +(item[field] + delta).toFixed(2);
  };

  // Subtract from “from”
  if (fromType === "account") adjust(accounts, fromId, "balance", -amount);
  else adjust(cards, fromId, "limit", -amount);

  // Add to “to”
  if (toType === "account") adjust(accounts, toId, "balance", amount);
  else adjust(cards, toId, "limit", amount);

  return { accounts, cards };
});
