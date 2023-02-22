import prisma from "../utils/prisma";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

//@desc      Get all Categories
//route      GET /api/v1/categories
//@access    Public
export const getCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const categories = await prisma.categories.findMany({
      include: {
        courses: true,
      },
    });
    res.status(200).json(categories);
  }
);

//@desc      Get Sinlge Category
//route      GET /api/v1/categorys/id
//@access    Public
export const getCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await prisma.categories.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!category) {
    throw new Error(`Category not found with this id ${req.params.id}`);
  }
  res.status(200).json(category);
});

//@desc      Post Create Category
//route      POST /api/v1/category
//@access    Private
export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const category = await prisma.categories.create({
      data: req.body,
    });
    res.status(201).json(category);
  }
);

//@desc      Put Update Category
//route      PUT /api/v1/categorys/id
//@access    Private
export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    let category = await prisma.categories.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!category) {
      throw new Error(
        `Cant update category, Category not found with this id ${req.params.id}`
      );
    }

    category = await prisma.categories.update({
      data: req.body,
      where: {
        id: req.params.id,
      },
    });

    res.status(201).json(category);
  }
);

//@desc      Delete Sinlge Category
//route      DELETE /api/v1/categorys/id
//@access    Private
export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    let category = await prisma.categories.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!category) {
      throw new Error(
        `Cant delete category, Category not found with this id ${req.params.id}`
      );
    }

    category = await prisma.categories.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json("Deleted category success");
  }
);
