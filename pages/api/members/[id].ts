import connectMongo from "@/database/connection";
import Member from "@/models/Member";
import { FactoryProps } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = FactoryProps[] | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const { id } = req.query;
    connectMongo().catch(() => res.json({ message: "Connection failed" }));
    const member = await Member.findOne({ _id: id });
    res.status(200).json(member);
  }
  if (req.method === "PUT") {
    const { id } = req.query;
    connectMongo().catch(() => res.json({ message: "Connection failed" }));
    const members = await Member.findOneAndUpdate({ _id: id }, req.body);
    res.status(200).json(members);
  }
  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      connectMongo().catch(() => res.json({ message: "Connection failed" }));
      await Member.deleteOne({ _id: id });
      res.status(200).json({ message: "Member deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error occurred" });
    }
  }
}
