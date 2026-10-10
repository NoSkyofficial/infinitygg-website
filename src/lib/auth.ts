import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Discord from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "identify email guilds guilds.members.read",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
      }
      
      // ALWAYS fetch fresh admin data (not just on sign in)
      if (token.id) {
        try {
          const adminProfile = await prisma.adminUser.findUnique({
            where: { userId: token.id as string },
          });

          if (adminProfile) {
            token.admin = {
              id: adminProfile.id,
              role: adminProfile.role,
              permissions: adminProfile.permissions || [],
              active: adminProfile.active,
            };
            
          } else {
            token.admin = null;
          }
        } catch (error) {
          console.error("[Auth JWT] Error fetching admin:", error);
          token.admin = null;
        }
      }
      
      return token;
    },
    
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        (session.user as any).admin = token.admin;
        
      }
      return session;
    },
  },
  events: {
    async linkAccount({ user, account }) {
      
      if (account.provider === "discord") {
        try {
          const existingAdmin = await prisma.adminUser.findUnique({
            where: { userId: user.id },
          });

          if (existingAdmin) {
            await prisma.adminUser.update({
              where: { id: existingAdmin.id },
              data: {
                lastLogin: new Date(),
                discordTag: user.name || existingAdmin.discordTag,
              },
            });
            return;
          }

          const newAdmin = await prisma.adminUser.create({
            data: {
              userId: user.id as string,
              discordId: account.providerAccountId,
              discordTag: user.name || "Unknown",
              role: "InfinityGG_Team",
              permissions: [], // Będzie miał permissions z roli
              lastLogin: new Date(),
            },
          });
        } catch (error) {
          console.error("[Event] Error in linkAccount:", error);
        }
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export { auth as getServerSession };