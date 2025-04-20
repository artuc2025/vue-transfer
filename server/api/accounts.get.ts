// server/api/accounts.get.ts
import { defineEventHandler } from "h3";
import { initialAccounts } from "../mockData";

export default defineEventHandler(() => {
  return initialAccounts;
});
