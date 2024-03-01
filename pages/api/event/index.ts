import connectMongo from "@/database/connection";
import Event from "@/models/Event";
import { EventProps } from "@/types";
import Cors from "cors";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import User from "@/models/User";

type Data = EventProps[] | { message: string };

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
    await runMiddleware(req, res, cors);
    await connectMongo().catch(() =>
      res.json({ message: "Connection failed" })
    );
    if (req.query.search) {
      try {
        const members = await Event.find({
          $or: [
            { titleAR: { $regex: req.query.search, $options: "i" } },
            { titleEN: { $regex: req.query.search, $options: "i" } },
            { descriptionAR: { $regex: req.query.search, $options: "i" } },
            { descriptionEN: { $regex: req.query.search, $options: "i" } },
            { date: { $regex: req.query.search, $options: "i" } },
          ],
        }).sort({ date: -1 });
        // console.log(members);

        res.status(200).json(members);
      } catch (error) {
        res.status(500).json({ message: "Server error occurred" });
      }
    } else {
      try {
        const events = await Event.find().sort({ date: -1 });
        res.status(200).json(events);
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
      await connectMongo().catch(() =>
        res.json({ message: "Connection failed" })
      );
      await Event.create(req.body);
      res.status(200).json({ message: "Project added successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error occurred" });
    }
  }
}
