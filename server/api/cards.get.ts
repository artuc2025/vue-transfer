// server/api/cards.get.ts
import { defineEventHandler } from "h3";
import { initialCards } from "../mockData";

export default defineEventHandler(() => {
  return initialCards;
});
