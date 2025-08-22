import { SQLDatabase } from 'encore.dev/storage/sqldb';

export const sdrDB = new SQLDatabase("sdr_system", {
  migrations: "./migrations",
});
