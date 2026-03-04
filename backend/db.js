import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

if (!process.env.DATABASE_URL)
  throw new error("DATABASE_URL is not set in the .env file");

const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql);

export default db;
