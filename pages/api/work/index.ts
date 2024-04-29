import connectMongo from "@/database/connection";
import Work from "@/models/Work";
import { WorkProps } from "@/types";
import Cors from "cors";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = WorkProps[] | { message: string };

const cors = Cors({
  origin: [
    "http://localhost:5173",
    "http://iaafalex.com",
    "https://iaafalex.com",
    "https://iaafalex.netlify.app",
  ],
  methods: ["POST"],
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
  await runMiddleware(req, res, cors);
  if (req.method === "GET") {
    const { search, limit, page } = req.query;
    try {
      await connectMongo().catch(() =>
        res.json({ message: "Connection failed" })
      );

      if (search) {
        // console.log(search);
        const works = await Work.find({
          $or: [
            { name: { $regex: search, $options: "i" } },
            { bDate: { $regex: search, $options: "i" } },
            { education: { $regex: search, $options: "i" } },
            { job: { $regex: search, $options: "i" } },
            { college: { $regex: search, $options: "i" } },
            { university: { $regex: search, $options: "i" } },
            { gradYear: { $regex: search, $options: "i" } },
            { experience: { $regex: search, $options: "i" } },
          ],
        })
          .limit(Number(limit))
          .skip(Number(limit) * Number(page))
          .sort({ createdAt: -1 });
        res.status(200).json(works);
      } else {
        const works = await Work.find()
          .limit(Number(limit))
          .skip(Number(limit) * Number(page))
          .sort({ createdAt: -1 });
        res.status(200).json(works);
      }
    } catch (error) {
      res.status(500).json({ message: "Server error occurred" });
    }
  }
  if (req.method === "POST") {
    try {
      await connectMongo().catch(() =>
        res.json({ message: "Connection failed" })
      );
      await Work.create(req.body);
      res.status(200).json({ message: "Work added successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error occurred" });
    }
  }
}
