import connectMongo from "@/database/connection";
import Factory from "@/models/Factory";
import { FactoryProps } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = FactoryProps[] | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    try {
      const { id } = req.query;
      connectMongo().catch(() => res.json({ message: "Connection failed" }));
      const factory = await Factory.findOne({ _id: id });
      res.status(200).json(factory);
    } catch (error) {
      res.status(500).json({ message: "Server error occurred" });
    }
  }
  if (req.method === "PUT") {
    try {
      const { id } = req.query;
      connectMongo().catch(() => res.json({ message: "Connection failed" }));
      const factories = await Factory.find();
      res.status(200).json(factories);
    } catch (error) {
      res.status(500).json({ message: "Server error occurred" });
    }
  }
  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      connectMongo().catch(() => res.json({ message: "Connection failed" }));
      await Factory.deleteOne({ _id: id });
      res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error occurred" });
    }
  }
}
