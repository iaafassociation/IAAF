import connectMongo from "@/database/connection";
import { UserProps } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import User from "@/models/User";

type Data = UserProps[] | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    await connectMongo().catch(() =>
      res.json({ message: "Connection failed" })
    );
    if (req.query.search) {
      try {
        const users = await User.find({
          $or: [{ username: { $regex: req.query.search, $options: "i" } }],
        }).sort({ date: -1 });

        res.status(200).json(users);
      } catch (error) {
        res.status(500).json({ message: "Server error occurred" });
      }
    } else {
      try {
        const users = await User.find().sort({ date: -1 });
        res.status(200).json(users);
      } catch (error) {
        res.status(500).json({ message: "Server error occurred" });
      }
    }
  }
}
