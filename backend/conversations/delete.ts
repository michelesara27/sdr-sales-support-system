import { api, APIError } from "encore.dev/api";
import { sdrDB } from "../database/db";

interface DeleteConversationParams {
  id: number;
}

// Deletes a conversation and all its messages.
export const deleteConversation = api<DeleteConversationParams, void>(
  { expose: true, method: "DELETE", path: "/conversations/:id" },
  async ({ id }) => {
    // Check if conversation exists
    const existingConversation = await sdrDB.queryRow<{ id: number }>`
      SELECT id FROM conversations WHERE id = ${id}
    `;

    if (!existingConversation) {
      throw APIError.notFound("conversation not found");
    }

    // Delete conversation (cascading deletes will handle messages)
    await sdrDB.exec`DELETE FROM conversations WHERE id = ${id}`;
  }
);
