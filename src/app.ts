import express, { Application } from "express";
import "dotenv/config";
import "colors.ts";
import cors from "cors";
import cookieParser from "cookie-parser";

import errorHandler from "./middlewares/erorMiddleware";
import { userRoute } from "./routes";

const app: Application = express();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Enable CORS
app.use(cors());

// All Routes

app.use("/api/v1/users", userRoute);

// Error Hanler
app.use(errorHandler);

export { app };
