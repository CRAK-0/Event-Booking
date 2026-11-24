import { pool } from "../src/db.js";

try {
  const result = await pool.query("SELECT * FROM events");
  console.log(result.rows);
} catch (error) {
  console.error("Database test failed:", error);
} finally {
  await pool.end();
}
