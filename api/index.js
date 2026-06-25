import { connectDB } from "../server/src/config/db.js";
import app from "../server/src/app.js";

// Connect to MongoDB
await connectDB();

export default app;
