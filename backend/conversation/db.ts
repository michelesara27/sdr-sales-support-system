import { SQLDatabase } from "encore.dev/storage/sqldb";

export const conversationDB = new SQLDatabase("conversation", {
  migrations: "./migrations",
});
