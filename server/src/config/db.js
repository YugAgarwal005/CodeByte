import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  let mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    console.warn("Warning: MONGO_URL environment variable is not defined!");
    return;
  }

  // Sanitize mongoUrl to avoid double slashes after the host (e.g. host.com//dbname)
  try {
    if (mongoUrl.includes("://")) {
      const parts = mongoUrl.split("://");
      const protocol = parts[0];
      let rest = parts[1];
      const queryIndex = rest.indexOf("?");
      let path = queryIndex !== -1 ? rest.substring(0, queryIndex) : rest;
      const query = queryIndex !== -1 ? rest.substring(queryIndex) : "";
      
      // Replace multiple consecutive slashes with a single slash
      path = path.replace(/\/+/g, "/");
      mongoUrl = `${protocol}://${path}${query}`;
    }
  } catch (err) {
    console.error("Error sanitizing MONGO_URL:", err);
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(mongoUrl, opts).then((mongooseInstance) => {
      console.log("Database Connection Successful");
      return mongooseInstance;
    }).catch((err) => {
      cached.promise = null;
      console.error("Database connection error:", err);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
};
