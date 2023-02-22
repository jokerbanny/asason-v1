import prisma from "../utils/prisma";
import asyncHandler from "express-async-handler";
import bcrypt = require("bcryptjs");
import jwt = require("jsonwebtoken");
import { Request, Response } from "express";

interface UserInfo {
  id: string;
  username: string;
  password: string;
}

//@desc      Register user
//route      POST /api/v1/auth/register
//@access    Public
export const userRegister = asyncHandler(
  async (req: Request, res: Response) => {
    let user = await prisma.users.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (user) {
      res.status(400);
      throw new Error("User already exists");
    }
    user = await prisma.users.create({
      data: {
        ...req.body,
        password: bcrypt.hashSync(req.body.password, 10),
      },
    });
    sendTokenResponse(user, 201, res);
  }
);

//@desc      Login user
//route      POST /api/v1/auth/login
//@access    Public
export const userLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validation email password
  if (!email || !password) {
    res.status(400);
    throw new Error(`Please provide an email or password`);
  }

  // check for user
  const user = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    res.status(404);
    throw new Error("user not register in website");
  }

  // check if password matches
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Password is wrong");
  }

  sendTokenResponse(user, 200, res);
});

// controllers / auth.js
//@desc      Log user out / clear cookiew
//route      GET /api/v1/auth/logout
//@access    Private
export const userLogout = asyncHandler(async (req: Request, res: Response) => {
  res.cookie("token", "none"),
    {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    };
  res.status(200).json({});
});

//@desc      Get current logged in user
//route      POST /api/v1/auth/me
//@access    Private
export const userAccount = asyncHandler(async (req: Request, res: Response) => {
  let user = await prisma.users.findUnique({
    where: {
      // @ts-ignore
      id: req.user.id,
    },
    select: {
      id: true,
      username: true,
      email: true,
      courses: {
        select: {
          course: true,
        },
      },
      orders: {
        include: {
          orderDetail: true,
        },
      },
    },
  });

  res.status(200).json(user);
});

//@desc      Update user details
//route      PUT /api/v1/auth/updatedetails
//@access    Private
export const userUpdateDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const { username, email } = req.body;

    const user = await prisma.users.update({
      where: {
        // @ts-ignore
        id: req.user.id,
      },
      data: { username, email },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    res.status(200).json(user);
  }
);

//@desc      Updaet password
//route      PUT /api/v1/auth/updatepassword
//@access    Private
export const userUpdatePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await prisma.users.findUnique({
      where: {
        // @ts-ignore
        id: req.user.id,
      },
    });

    // check if password matches
    const isMatch = await bcrypt.compare(
      req.body.currentPassword,
      // @ts-ignore
      user.password
    );

    if (!isMatch) {
      res.status(401);
      throw new Error("Password is not match.");
    }

    // Update Password
    await prisma.users.update({
      where: {
        // @ts-ignore
        id: req.user.id,
      },
      data: {
        password: bcrypt.hashSync(req.body.newPassword, 10),
      },
    });

    res.status(200).json(user);
  }
);

// Get token from sign, create cookiew and send response
const sendTokenResponse = async (
  user: UserInfo,
  statusCode: number,
  res: Response
) => {
  // Create token
  // @ts-ignore
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  const options = {
    expires: new Date(
      // @ts-ignore
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // if(process.env.NODE_ENV === 'production') {
  //     options.secure = true;
  // };

  res.status(statusCode).cookie("token", token, options).json(token);
};
