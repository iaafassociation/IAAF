import type { NextApiRequest, NextApiResponse } from "next";

import connectMongo from "@/database/connection";
import User from "@/models/User";
import { UserProps } from "@/types";
import { hash } from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "./[...nextauth]";

type Data = UserProps[] | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    if (!req.body) return res.status(404).json({ message: "No data found" });
    const { username, password } = req.body;

    try {
      const session = await getServerSession(req, res, authOptions);
      const user = await User.findOne({ username: session?.user.username });
      if (!user || session?.user.role !== "admin")
        return res.status(403).json({ message: "Unauthorized" });

      await connectMongo().catch(() =>
        res.json({ message: "Connection failed" })
      );

      const existingUser = await User.findOne({ username });

      if (existingUser) {
        return res.status(403).json({ message: "User already exists" });
      }

      const hashedPassword = await hash(password, 10);

      await User.create({
        username,
        password: hashedPassword,
        role: "user",
      });

      res.status(200).json({ message: "User created successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error occurred" });
    }
  }
}
