import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from './routes/auth.route';
import { errorHandle } from "./error/errorHandler";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes placeholder
app.get("/", (_, res) => res.send("Micro-Internship Portal API"));
app.use('/api/auth',authRoute);

app.use(errorHandle);
export default app;
