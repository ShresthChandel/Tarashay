import { config } from "dotenv";
import { resolve } from "path";

/**
 * Load .env.local for standalone scripts (seed, create-admin).
 * Next.js loads this automatically; tsx scripts need this import first.
 */
config({ path: resolve(process.cwd(), ".env.local") });
