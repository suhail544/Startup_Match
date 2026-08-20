import dotenv from "dotenv";
dotenv.config();
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import entrepreneurRoute from "./routes/entrepreneur/entrepreneur.routes";
import authRoute from "./routes/auth.routes";
import investorRoute from "./routes/investor/investor.routes";
import ideaRoute from "./routes/entrepreneur/idea.routes";
import savedIdeaRoute from "./routes/investor/savedIdea.routes";
import interestRoute from "./routes/investor/interest.routes";
import { globalErrorHandler } from "./middlewares/error.middleware";

const app = express();
const port = 3000;
app.use(express.json());
app.use((req, res, next) => {
  console.log("🔥 INCOMING REQUEST:", req.method, req.url);
  console.log("BODY:", req.body);
  next();
});
app.use(morgan("dev"));
const allowedOrigins = (
  process.env.FRONTEND_ORIGINS || "http://localhost:5173,http://localhost:5174"
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser requests (e.g., curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
console.log("DB URL:", process.env.DATABASE_URL);
app.use("/api/idea", ideaRoute);
app.use("/api/save-idea", savedIdeaRoute);
app.use("/api/interest", interestRoute);
app.use("/api/auth", authRoute);
app.use("/api/entrepreneur", entrepreneurRoute);
app.use("/api/investor", investorRoute);

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server is running on port http://127.0.0.1:${port}/api`);
  // console.log(process.env)
});
