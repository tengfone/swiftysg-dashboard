import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "../../../helper/auth";
import { connectToDatabase } from "../../../helper/db";

export default NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days (seconds)
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        user: { label: "User Name", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await connectToDatabase();
        const usersCollection = client.db().collection("dashboardUsers");
        const user = await usersCollection.findOne({
          user: credentials.user,
        });

        if (!user) {
          client.close();
          throw new Error("User not found");
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          client.close();
          throw new Error("Invalid password");
        }

        client.close();

        return { id: String(user._id), name: user.user, user: user.user };
      },
    }),
  ],
});
