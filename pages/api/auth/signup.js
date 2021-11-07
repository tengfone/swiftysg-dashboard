import { hashPassword } from "../../../helper/auth";
import { connectToDatabase } from "../../../helper/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;
    const { user, password, secretCode } = data;
    if (
      !user ||
      !password ||
      password.trim().length < 7
    ) {
      res.status(422).json({
        message: "Invalid Input",
      });
      return;
    }
    const client = await connectToDatabase();
    const db = client.db();

    // Check if user exist
    const existingUser = await db.collection("dashboardUsers").findOne({ user: user });

    if (existingUser) {
      res.status(422).json({ message: "User Exists Already" });
      client.close();
      return;
    }

    const hashedPassword = await hashPassword(password);
    const result = await db.collection("dashboardUsers").insertOne({
      user: user,
      password: hashedPassword,
    });
    res.status(201).json({ message: "User created" });
    client.close();
  }
}