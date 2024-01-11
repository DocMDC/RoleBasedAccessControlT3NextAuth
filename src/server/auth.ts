import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { env } from "../env";
import { db } from "./db";
import GitHubProvider from 'next-auth/providers/github'
import { GithubProfile } from 'next-auth/providers/github'


//May be helpful to see the entire github profile schema: https://github.com/nextauthjs/next-auth/blob/v4/packages/next-auth/src/providers/github.ts

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      login: string;
      // ...other properties
      role: string;
    } & DefaultSession["user"];
  }

  //Must include this interface to allow sesssion access to user.role and user.name
  interface User {
    role: string;
    name: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GitHubProvider({
      profile(profile: GithubProfile) {
        return {
          //this will populate the user schema based on information pulled from the auth provider
          name: profile.login,
          email: profile.email,
          role: profile.role ?? "user",
          id: profile.id.toString(),
          image: profile.avatar_url,
        }
      },
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email
        // role: session.user.role
        //name and role are undefined in session
      },
    }),
    // session: ({ session, user }) => {
    //   session.user.role = user.role

    //   return session
    // },
    async redirect({url, baseUrl}) {
      return baseUrl
    }
    // async redirect({ url, baseUrl }) {
    //   if (url.startsWith("/")) return `${baseUrl}${url}`
    // }
  },
  //can add custom pages in place of the default sign in and sign out pages if desired
  pages: {
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    //When using this configuration, ensure that these pages actually exist. For example error: '/auth/error' refers to a page file at pages/auth/error.js.
  }
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
