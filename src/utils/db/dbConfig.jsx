import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
const sql = neon("postgresql://neondb_owner:bIDF7e9wsjnu@ep-square-heart-a1rp4vev.ap-southeast-1.aws.neon.tech/w2w?sslmode=require");
export const db = drizzle(sql, { schema });
