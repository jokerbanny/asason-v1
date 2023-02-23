import prisma from "../utils/prisma";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { TopicLesson } from "./../models/topicLesson";

//@desc      Get all Courses
//route      GET /api/v1/courses
//@access    Public
export const getCourses = asyncHandler(async (req: Request, res: Response) => {
  const courses = await prisma.courses.findMany({
    include: {
      categories: true,
      students: {
        select: {
          userId: true,
        },
      },
    },
  });
  res.status(200).json(courses);
});

//@desc      Get Single Courses
//route      GET /api/v1/courses/id
//@access    Public
export const getCourse = asyncHandler(async (req: Request, res: Response) => {
  const course = await prisma.courses.findUnique({
    where: {
      id: req.params.id,
    },
    include: {
      categories: true,
      topics: {
        select: {
          id: true,
          name: true,
          lessons: true,
        },
      },
      whatYouWillLearns: true,
      targetedAudiences: true,
      materialsIncludeds: true,
      requirements: true,
      tags: true,
      discount: true,
      students: true,
    },
  });

  if (!course) {
    throw new Error(`Course not found by this id ${req.params.id}`);
  }

  res.status(200).json(course);
});

export const createCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const { topics } = req.body;
    let course = await prisma.courses.findUnique({
      where: {
        name: req.body.name,
      },
    });

    if (course) {
      res.status(400);
      throw new Error("Course already exists");
    }
    course = await prisma.courses.create({
      data: {
        courseType: req.body.courseType,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        views: req.body.views,
        difficultyLevel: req.body.difficultyLevel,
        instructor: req.body.instructor,
        thumbnail: req.body.thumbnail,
        demoVideo: req.body.demoVideo,
        publicCourse: req.body.publicCourse,
        categories: {
          connect: req.body.categories,
        },
        topics: {
          create: req.body.topics.map(item => {
            return {}
          })
        },
        whatYouWillLearns: {
          create: req.body.whatYouWillLearns,
        },
        targetedAudiences: {
          create: req.body.targetedAudiences,
        },
        materialsIncludeds: {
          create: req.body.materialsIncludeds,
        },
        requirements: {
          create: req.body.requirements,
        },
        tags: {
          create: req.body.tags,
        },
        students: {
          create: req.body.students,
        },
      },

      include: {
        topics: {
          include: {
            lessons: true,
          },
        },
        whatYouWillLearns: true,
        targetedAudiences: true,
        materialsIncludeds: true,
        requirements: true,
        tags: true,
        students: true,
      },
    });

    res.status(201).json(course);
  }
);

//@desc      Update Single Courses
//route      UPDATE /api/v1/courses/id
//@access    Private
export const updateCourse = asyncHandler(
  async (req: Request, res: Response) => {
    let course = await prisma.courses.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!course) {
      throw new Error(
        `Cant update this course, course not found with id ${req.params.id}`
      );
    }

    course = await prisma.courses.update({
      data: req.body,
      where: {
        id: req.params.id,
      },
    });

    res.status(201).json(course);
  }
);

//@desc      Delete Sinlge Course
//route      DELETE /api/v1/courses/id
//@access    Private
export const deleteDiscount = asyncHandler(
  async (req: Request, res: Response) => {
    let course = await prisma.courses.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!course) {
      throw new Error(
        `Cant delete this course, course not found with id ${req.params.id}`
      );
    }

    await prisma.courses.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json("deleted course success");
  }
);
