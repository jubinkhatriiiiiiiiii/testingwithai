import serverless from "serverless-http";
import express from "express";
import cors from "cors";
import { handleDemo } from "../../server/routes/demo";
import assistantRouter from "../../server/routes/assistant";

// Create a new express app for the Netlify function
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Example API routes
app.get("/api/ping", (_req, res) => {
  res.json({ message: "Hello from Express server v2!" });
});

app.get("/api/demo", handleDemo);

// Use the assistant router for all /api routes
app.use("/api", assistantRouter);

// Export the serverless function handler
export const handler = serverless(app);
