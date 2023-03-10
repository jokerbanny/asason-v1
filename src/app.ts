import express, { Application } from "express";
import "dotenv/config";
import "colors.ts";
import cors from "cors";
import cookieParser from "cookie-parser";

import errorHandler from "./middlewares/erorMiddleware";
import {
  authRoute,
  courseRoute,
  userRoute,
  categoryRoute,
  orderRoute,
} from "./routes";

const app: Application = express();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Enable CORS
app.use(cors());

// All Routes

app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/courses", courseRoute);
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/orders", orderRoute);

// Error Hanler
app.use(errorHandler);

export { app };
