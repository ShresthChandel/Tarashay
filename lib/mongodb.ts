import dns from "node:dns";
import mongoose from "mongoose";

// Some ISPs/routers break Node.js SRV lookups (ECONNREFUSED querySrv) while
// nslookup works. Public DNS fixes mongodb+srv:// on Windows and similar networks.
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Singleton MongoDB connection for Next.js serverless / HMR.
 * Call from API routes and server components only — not from client.
 */
export async function connectDB(): Promise<typeof mongoose> {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error(
      "Please define MONGODB_URI in .env.local (MongoDB Atlas connection string)"
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(mongoUri, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
