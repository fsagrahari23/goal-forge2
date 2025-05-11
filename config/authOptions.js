import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDatabase();
        const user = await User.findOne({ email: credentials.email }).select(
          "+password"
        );
        if (!user) throw new Error("No user found with this email");
        const isMatch = await user.matchPassword(credentials.password);
        if (!isMatch) throw new Error("Invalid password");
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            "https://www.googleapis.com/auth/calendar openid email profile",
        },
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        // This block runs on initial sign-in
        token.id = user.id; // For credentials, this is the MongoDB _id; for Google, we'll override it
        token.isAdmin = user.isAdmin || false;
      }

      if (account && account.provider === "google") {
        // Google sign-in: Use email to find or create user
        await connectToDatabase();
        let dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          // If no user exists with this email, create one
          dbUser = await User.create({
            name: user.name,
            email: user.email,
            // No password for Google users; they use OAuth
            isAdmin: false,
            googleTokens: {
              accessToken: account.access_token,
              refreshToken: account.refresh_token,
              expiryDate: account.expires_at * 1000,
            },
          });
        } else {
          // Update existing user with Google tokens
          await User.updateOne(
            { email: user.email },
            {
              $set: {
                googleTokens: {
                  accessToken: account.access_token,
                  refreshToken: account.refresh_token,
                  expiryDate: account.expires_at * 1000,
                },
              },
            }
          );
        }

        // Set token.id to the MongoDB _id (not Google ID)
        token.id = dbUser._id.toString();
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiryDate = account.expires_at * 1000;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id; // MongoDB _id
        session.user.isAdmin = token.isAdmin;
        session.accessToken = token.accessToken; // Google access token
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
