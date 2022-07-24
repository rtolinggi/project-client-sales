import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res
      .status(400)
      .json({ success: false, message: "Method Not Allowed" });

  return res.status(200).json({ success: true, message: "TESTING API SUCCES" });
}
