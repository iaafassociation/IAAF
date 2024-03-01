import { getServerSession } from "next-auth";
import type { NextApiRequest, NextApiResponse } from "next";

import connectMongo from "@/database/connection";
import Complaint from "@/models/Complaint";
import { ComplaintProps } from "@/types";
import { authOptions } from "../auth/[...nextauth]";
import User from "@/models/User";

type Data = ComplaintProps[] | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "DELETE") {
    try {
      const session = await getServerSession(req, res, authOptions);
      const user = await User.findOne({ username: session?.user.username });
      if (!user) return res.status(403).json({ message: "Unauthorized" });
      const { id } = req.query;
      await connectMongo().catch(() =>
        res.json({ message: "Connection failed" })
      );
      await Complaint.deleteOne({ _id: id });
      res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error occurred" });
    }
  }
}
