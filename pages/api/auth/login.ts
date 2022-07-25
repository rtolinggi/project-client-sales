// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../libs/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import type { users } from "@prisma/client";

type Data = {
  success: boolean;
  message?: string;
  user?: {
    userId: string;
    email: string;
    fullname?: string;
    jobTitle?: string;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res
      .status(401)
      .json({ success: false, message: "Methon not allowed" });
  }

  const { email, passwordHash } = req.body;

  if (!email || !passwordHash) {
    return res
      .status(401)
      .json({ success: false, message: "Field is required" });
  }

  let user: users | null;
  try {
    user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Email not found" });
    }

    if (!user.isActive || !user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Email must verified and user must active",
      });
    }

    if (user && !(await bcrypt.compare(passwordHash, user.passwordHash))) {
      return res
        .status(401)
        .json({ success: false, message: "invalid credentials" });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Inernal server error" });
  }

  const refreshToken = jwt.sign(
    {
      id: user.userId,
      email: user.email,
    },
    process.env.SECRET as string,
    {
      expiresIn: "30d",
    }
  );

  console.log(refreshToken);

  try {
    await prisma.users.update({
      where: {
        userId: user.userId,
      },
      data: {
        refreshToken,
      },
    });

    const serialised = serialize("OursiteJWT", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    res.setHeader("Set-Cookie", serialised);
    return res
      .status(200)
      .json({
        success: true,
        user: { userId: user.userId, email: user.email },
      });
  } catch (error) {
    console.log(console.error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
