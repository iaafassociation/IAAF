import connectMongo from "@/database/connection";
import Event from "@/models/Event";
import { EventProps } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import User from "@/models/User";

type Data = EventProps[] | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    try {
      const { id } = req.query;
      await connectMongo().catch(() =>
        res.json({ message: "Connection failed" })
      );
      const event = await Event.findOne({ _id: id });
      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ message: "Server error occurred" });
    }
  }
  if (req.method === "PUT") {
    try {
      const session = await getServerSession(req, res, authOptions);
      const user = await User.findOne({ username: session?.user.username });
      if (!user) return res.status(403).json({ message: "Unauthorized" });
      const { id } = req.query;
      await connectMongo().catch(() =>
        res.json({ message: "Connection failed" })
      );
      const event = await Event.findOneAndUpdate({ _id: id }, req.body);
      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ message: "Server error occurred" });
    }
  }
  if (req.method === "DELETE") {
    try {
      const session = await getServerSession(req, res, authOptions);
      const user = await User.findOne({ username: session?.user.username });
      if (!user) return res.status(403).json({ message: "Unauthorized" });
      const { id } = req.query;
      await connectMongo().catch(() =>
        res.json({ message: "Connection failed" })
      );
      await Event.deleteOne({ _id: id });
      res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error occurred" });
    }
  }
}
