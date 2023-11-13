import connectMongo from "@/database/connection";
import Event from "@/models/Event";
import { EventProps } from "@/types";
import Cors from "cors";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = EventProps[] | { message: string };

const cors = Cors({
  origin: [
    "http://localhost:5173",
    "http://iaafalex.com",
    "https://iaafalex.com",
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
    connectMongo().catch(() => res.json({ message: "Connection failed" }));
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
        });
        // console.log(members);

        res.status(200).json(members);
      } catch (error) {
        res.status(500).json({ message: "Server error occurred" });
      }
    } else if (req.query.type) {
      try {
        const members = await Event.find({ type: req.query.type });
        // console.log(members);

        res.status(200).json(members);
      } catch (error) {
        res.status(500).json({ message: "Server error occurred" });
      }
    } else {
      try {
        const events = await Event.find();
        res.status(200).json(events);
      } catch (error) {
        res.status(500).json({ message: "Server error occurred" });
      }
    }
  }
  if (req.method === "POST") {
    try {
      connectMongo().catch(() => res.json({ message: "Connection failed" }));
      await Event.create(req.body);
      res.status(200).json({ message: "Project added successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error occurred" });
    }
  }
}
