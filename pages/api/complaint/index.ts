import connectMongo from "@/database/connection";
import Complaint from "@/models/Complaint";
import { ComplaintProps } from "@/types";
import Cors from "cors";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = ComplaintProps[] | { message: string };

const cors = Cors({
  origin: [
    "http://localhost:5173",
    "http://iaafalex.com",
    "https://iaafalex.com",
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
    try {
      connectMongo().catch(() => res.json({ message: "Connection failed" }));
      const complaints = await Complaint.find();
      res.status(200).json(complaints);
    } catch (error) {
      res.status(500).json({ message: "Server error occurred" });
    }
  }
  if (req.method === "POST") {
    try {
      connectMongo().catch(() => res.json({ message: "Connection failed" }));
      await Complaint.create(req.body);
      res.status(200).json({ message: "Project added successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error occurred" });
    }
  }
}
