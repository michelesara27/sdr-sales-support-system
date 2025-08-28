import { api } from "encore.dev/api";
import { conversationDB } from "./db";

export interface ConversationStatsResponse {
  openConversations: number;
}

// Retrieves conversation statistics for the dashboard.
export const getStats = api<void, ConversationStatsResponse>(
  { expose: true, method: "GET", path: "/conversations/stats" },
  async () => {
    const row = await conversationDB.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM conversations
    `;

    return {
      openConversations: row?.count || 0,
    };
  }
);
