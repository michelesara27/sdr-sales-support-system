import { SQLDatabase } from "encore.dev/storage/sqldb";

export const projectDB = new SQLDatabase("project", {
  migrations: "./migrations",
});
