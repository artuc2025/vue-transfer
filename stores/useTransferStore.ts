// stores/useTransferStore.ts
import { defineStore } from "pinia";

export type SourceItem = {
  key: string;
  rawId: number | string;
  type: "account" | "card";
  name: string;
  amount: number;
};

export const useTransferStore = defineStore("transfer", {
  state: () => ({
    accounts: [] as { id: number; name: string; balance: number }[],
    cards: [] as { id: string; name: string; limit: number }[],
  }),
  getters: {
    mergedItems: (state): SourceItem[] => [
      ...state.accounts.map((acc) => ({
        key: `account-${acc.id}`,
        rawId: acc.id,
        type: "account" as const,
        name: acc.name,
        amount: acc.balance,
      })),
      ...state.cards.map((card) => ({
        key: `card-${card.id}`,
        rawId: card.id,
        type: "card" as const,
        name: card.name,
        amount: card.limit,
      })),
    ],
  },
  actions: {
    async fetchAccountsAndCards() {
      const [accounts, cards] = await Promise.all([
        $fetch("/api/accounts"),
        $fetch("/api/cards"),
      ]);
      this.accounts = accounts;
      this.cards = cards;
    },

    /**
     * Perform the transfer, then sync store with updated balances.
     */
    async transferFunds(from: SourceItem, to: SourceItem, amount: number) {
      const payload = {
        fromType: from.type,
        fromId: from.rawId,
        toType: to.type,
        toId: to.rawId,
        amount,
      };
      const { accounts, cards } = await $fetch("/api/transfer", {
        method: "POST",
        body: payload,
      });
      this.accounts = accounts;
      this.cards = cards;
    },
  },
});
