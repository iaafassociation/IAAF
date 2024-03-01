import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import connectMongo from "@/database/connection";
import User from "@/models/User";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",

      // @ts-ignore
      async authorize(
        credentials: { username: string; password: string },
        req
      ) {
        await connectMongo().catch((error) => {
          console.log(error);
        });

        const { username, password } = credentials;
        const user = await User.findOne({ username });
        if (user) {
          const check = await compare(password, user.password);
          if (!check) {
            throw new Error("password");
          }
          return user;
        }
        throw new Error("username");
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  jwt: {
    maxAge: 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user._id;
        token.username = user.username;
        token.role = user.role;
      }

      return { ...token, ...user };
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
        session.user.name = null;
        session.user.email = null;
        session.user.image = null;
      }

      return session;
    },
  },
  pages: {
    signIn: "sign-in",
  },
};

export default NextAuth(authOptions);
