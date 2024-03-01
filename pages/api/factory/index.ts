import connectMongo from "@/database/connection";
import Factory from "@/models/Factory";
import { FactoryProps } from "@/types";
import Cors from "cors";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import User from "@/models/User";

type Data = FactoryProps[] | { message: string };

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
    const { search, limit, page } = req.query;
    await runMiddleware(req, res, cors);
    await connectMongo().catch(() =>
      res.json({ message: "Connection failed" })
    );
    if (search) {
      try {
        // console.log(search);
        const factories = await Factory.find({
          $or: [
            { nameAR: { $regex: search, $options: "i" } },
            { nameEN: { $regex: search, $options: "i" } },
            { typeAR: { $regex: search, $options: "i" } },
            { typeEN: { $regex: search, $options: "i" } },
            { descriptionAR: { $regex: search, $options: "i" } },
            { descriptionEN: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
          ],
        })
          .limit(Number(limit))
          .skip(Number(limit) * Number(page))
          .sort({ createdAt: -1 });
        console.log(factories);
        res.status(200).json(factories);
      } catch (error) {
        res.status(500).json({ message: "Server error occurred" });
      }
    } else {
      try {
        const factories = await Factory.find()
          .limit(Number(limit))
          .skip(Number(limit) * Number(page))
          .sort({ createdAt: -1 });
        res.status(200).json(factories);
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
      await Factory.create(req.body);
      res.status(200).json({ message: "Project added successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error occurred" });
    }
  }
}
