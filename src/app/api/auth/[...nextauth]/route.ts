// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextAuthOptions } from "next-auth"
import { validateInput, required, isEmail } from '@/utils/validation'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing username or password")
        }

        const usernameErrors = validateInput(credentials.username, [required, isEmail])
        const passwordErrors = validateInput(credentials.password, [required])

        if (usernameErrors.length > 0 || passwordErrors.length > 0) {
          throw new Error("Invalid username or password format")
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.username
          }
        })

        if (!user) {
          throw new Error("User not found")
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error("Invalid password")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        const user = await prisma.user.findUnique({
          where: { id: token.sub },
        });
        if (!user) {
          // User not found in database, clear session
          return null;
        }
        session.user.id = token.sub;
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }