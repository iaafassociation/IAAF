import connectMongo from "@/database/connection";
import Complaint from "@/models/Complaint";
import { ComplaintProps } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = ComplaintProps[] | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      connectMongo().catch(() => res.json({ message: "Connection failed" }));
      await Complaint.deleteOne({ _id: id });
      res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error occurred" });
    }
  }
}
