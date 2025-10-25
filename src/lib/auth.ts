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
    async signIn({ user, account, profile }) {
      // Just allow sign in - AdminUser will be created in session callback
      return true;
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        
        // Get Discord ID from account
        const account = await prisma.account.findFirst({
          where: {
            userId: user.id,
            provider: "discord",
          },
        });

        if (account) {
          // Create or update admin user record
          try {
            let adminProfile = await prisma.adminUser.findUnique({
              where: { userId: user.id },
            });

            if (!adminProfile) {
              // Create new AdminUser if doesn't exist
              adminProfile = await prisma.adminUser.create({
                data: {
                  userId: user.id,
                  discordId: account.providerAccountId,
                  discordTag: user.name || "Unknown",
                  role: "InfinityGG_Team",
                  permissions: [],
                  lastLogin: new Date(),
                },
              });
            } else {
              // Update last login
              await prisma.adminUser.update({
                where: { id: adminProfile.id },
                data: {
                  lastLogin: new Date(),
                  discordTag: user.name || adminProfile.discordTag,
                },
              });
            }

            // Attach to session
            (session.user as any).admin = {
              role: adminProfile.role,
              permissions: adminProfile.permissions,
              active: adminProfile.active,
            };
          } catch (error) {
            console.error("Error with admin profile:", error);
          }
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// Helper to get session in server components
export { auth as getServerSession };