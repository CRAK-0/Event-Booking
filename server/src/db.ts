import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in .env");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on("connect", () => {
  console.log("New database connection established");
});

pool.on("error", (err) => {
  console.error("Unexpected database error:", err);
});

export const query = async <T = any>(
  sql: string,
  params?: unknown[],
): Promise<T[]> => {
  const result = await pool.query(sql, params);
  return result.rows as T[];
};
