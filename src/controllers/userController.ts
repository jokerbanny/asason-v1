import prisma from "../utils/prisma";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import bcrypt = require("bcryptjs");

//@desc      Get all Users
//route      GET /api/v1/users
//@access    Private
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await prisma.users.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      courses: {
        select: {
          course: true,
        },
      },
    },
  });
  res.status(200).json(users);
});

//@desc      Get Sinlge User
//route      GET /api/v1/users/id
//@access    Private
export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.users.findUnique({
    where: {
      id: req.params.id,
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
    },
  });

  if (!user) {
    throw new Error(`uer not found by id ${req.params.id}`);
  }

  res.status(200).json(user);
});

//@desc      Post Create User
//route      POST /api/v1/users
//@access    Private
export const createUser = asyncHandler(async (req: Request, res: Response) => {
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
  res.status(201).json(user);
});

//@desc      Put Update User
//route      PUT /api/v1/users/id
//@access    Private
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  let user = await prisma.users.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!user) {
    throw new Error(`Cant update user, user not found by id ${req.params.id}`);
  }

  // @ts-ignore
  user = await prisma.users.update({
    data: req.body,
    where: {
      id: req.params.id,
    },
    select: {
      id: true,
      username: true,
      email: true,
    },
  });

  res.status(201).json(user);
});

//@desc      Delete Sinlge User
//route      DELETE /api/v1/users/id
//@access    Private
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  let user = await prisma.users.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!user) {
    throw new Error(`Cant delete user, user not found by id ${req.params.id}`);
  }

  await prisma.users.delete({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json("deleted user success");
});
