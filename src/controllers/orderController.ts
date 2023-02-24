import prisma from "../utils/prisma";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

interface OrderDetails {
  orderDetails: OrderDetail[];
}

interface OrderDetail {
  courseId: string;
  courseType: string;
  courseName: string;
  coursePrice: number;
}

//@desc      Get all Orders
//route      GET /api/v1/orders
//@access    Private
export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await prisma.orders.findMany({
    include: {
      orderDetail: true,
      enrolleds: true,
    },
  });
  res.status(200).json(orders);
});

//@desc      Get all Orders
//route      GET /api/v1/orders
//@access    Private
export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await prisma.orders.findUnique({
    where: {
      id: req.params.id,
    },
    include: {
      orderDetail: true,
      enrolleds: true,
    },
  });

  if (!order) {
    throw new Error(`not found order with id ${req.params.id}`);
  }

  res.status(200).json(order);
});

//@desc      Post Create Order
//route      POST /api/v1/order
//@access    Private
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { imagePayment, subTotal, total, courseItems } = req.body;
  const order = await prisma.orders.create({
    data: {
      // @ts-ignore
      userId: req.user.id,
      imagePayment,
      subTotal,
      total,
      orderDetail: {
        create: courseItems,
      },
    },
    include: {
      orderDetail: true,
    },
  });

  res.status(201).json(order);
});

//@desc      Put Update Order
//route      PUT /api/v1/orders/id
//@access    Private
export const updateOrder = asyncHandler(async (req: Request, res: Response) => {
  let order = await prisma.orders.findUnique({
    where: {
      id: req.params.id,
    },
    include: {
      orderDetail: true,
    },
  });

  if (!order) {
    throw new Error(`not found order with id ${req.params.id}`);
  }

  // Update Order To Success Payment
  if (req.body.status === "SUCCESS") {
    // @ts-ignore
    order = await prisma.orders.update({
      where: {
        id: req.params.id,
      },
      data: {
        status: req.body.status,
        enrolleds: {
          // @ts-ignore
          create: order.orderDetail?.map((item: OrderDetail) => {
            return {
              courseId: item.courseId,
              courseType: item.courseType,
              courseName: item.courseName,
              coursePrice: item.coursePrice,
              userId: order?.userId,
            };
          }),
        },
      },
      include: {
        enrolleds: true,
        orderDetail: true,
      },
    });
  }
  res.status(201).json(order);
});

//@desc      Delete Update Order
//route      DELETE /api/v1/orders/id
//@access    Private
export const deleteOrder = asyncHandler(async (req: Request, res: Response) => {
  await prisma.orders.delete({
    where: {
      id: req.params.id,
    },
  });

  res.status(200).json("Deleted order success");
});
