import { Request, Response, NextFunction } from "express";
import prisma from "../utils/prisma";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Set token from Bearer token in header
      token = req.headers.authorization.split(" ")[1];
    }
    // middlewares / auth.js --- Uncomment
    // Set token from cookie
    else if (req.cookies.token) {
      token = req.cookies.token;
    }

    try {
      // Verify token
      // @ts-ignore
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      // @ts-ignore
      req.user = await prisma.users.findUnique({
        where: {
          id: decoded.id,
        },
      });
      // @ts-ignore
      if (!req.user) {
        res.status(401);
        throw new Error("Not authirised");
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized");
    }

    if (!token) {
      res.status(401);
      throw new Error("Not authorized");
    }
  }
);

export const authorize = (...roles: ["ADMIN"]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    if (!roles.includes(req.user.roles)) {
      res.status(401);
      throw new Error(
        // @ts-ignore
        `User role ${req.user.roles} is not authorized to access this route`
      );
    }
    next();
  };
};
