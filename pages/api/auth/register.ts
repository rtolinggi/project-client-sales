// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../libs/prisma";
import bcrypt from "bcryptjs";
import type { users } from "@prisma/client";

type Data = {
  success: boolean;
  message?: string;
  user?: users;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res
      .status(401)
      .json({ success: false, message: "Method Not Allowed" });
  }
  const { email, passwordHash, confirmPassword } = req.body;

  if (!email || !passwordHash || !confirmPassword) {
    res.status(401).json({ success: false, message: "All Field Is Required" });
  }

  if (passwordHash !== confirmPassword) {
    return res
      .status(401)
      .json({ success: false, message: "Password Not Match" });
  }

  const userExist = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  if (userExist) {
    return res
      .status(401)
      .json({ success: false, message: "Email already exist" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(passwordHash, salt);

  try {
    const user = await prisma.users.create({
      data: {
        email,
        passwordHash: hashedPassword,
      },
    });
    if (user) {
      return res.status(200).json({ success: true, user });
    }
  } catch (err) {
    console.log(err);
    res.status(500);
  }
}
