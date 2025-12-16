import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        // Determine if it's a doctor route based on the role passed in credentials
        const isDoctorRoute = credentials?.role === "doctor";

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/${
            isDoctorRoute ? "doctor/login" : "login"
          }`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
              role: credentials?.role,
            }),
          }
        );

        const user = await res.json();
        if (res.ok && user) return user;
        return null; // return null if login fails
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const customer = user?.data?.customer;

        token.user = {
          ...user,
          role: customer?.type,
          subType: customer?.subType,
          permissions: customer?.permissions,
          token: user?.data?.token,
        };
      }

      return token;
    },

    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
};
