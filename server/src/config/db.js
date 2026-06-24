import mongoose from "mongoose";

export const connectDB = async () => {
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

  try {
    await mongoose.connect(mongoUrl);
    console.log("Database Connection Successful");
  } catch (err) {
    console.error("Database connection error:", err);
  }
};
