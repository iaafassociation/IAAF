import connectMongo from "@/database/connection";
import Member from "@/models/Member";
import { MemberProps } from "@/types";
import Cors from "cors";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import User from "@/models/User";

type Data = MemberProps[] | { message: string };

const cors = Cors({
  origin: [
    "http://localhost:5173",
    "http://iaafalex.com",
    "https://iaafalex.com",
    "https://iaafalex.netlify.app",
  ],
  methods: ["GET"],
});

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    // console.log(req.query.search);
    await runMiddleware(req, res, cors);
    await connectMongo().catch(() =>
      res.json({ message: "Connection failed" })
    );
    if (req.query.search) {
      try {
        const members = await Member.find({
          $or: [
            { nameAR: { $regex: req.query.search, $options: "i" } },
            { nameEN: { $regex: req.query.search, $options: "i" } },
          ],
        });
        // console.log(members);

        res.status(200).json(members);
      } catch (error) {
        res.status(500).json({ message: "Server error occurred" });
      }
    } else {
      try {
        const members = await Member.find();
        res.status(200).json(members);
      } catch (error) {
        res.status(500).json({ message: "Server error occurred" });
      }
    }
  }
  if (req.method === "POST") {
    try {
      const session = await getServerSession(req, res, authOptions);
      const user = await User.findOne({ username: session?.user.username });
      if (!user) return res.status(403).json({ message: "Unauthorized" });
      console.log(req.body);
      await connectMongo().catch(() =>
        res.json({ message: "Connection failed" })
      );
      await Member.create(req.body);
      res.status(200).json({ message: "Member added successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error occurred" });
    }
  }
}
