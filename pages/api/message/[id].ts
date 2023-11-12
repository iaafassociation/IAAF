import connectMongo from "@/database/connection";
import Message from "@/models/Message";
import { MessageProps } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = MessageProps[] | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      connectMongo().catch(() => res.json({ message: "Connection failed" }));
      await Message.deleteOne({ _id: id });
      res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error occurred" });
    }
  }
}
