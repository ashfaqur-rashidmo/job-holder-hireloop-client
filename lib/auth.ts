import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"


const client = new MongoClient(process.env.BETTER_AUTH_DB_URI as string)
const db = client.db("hireloopdb")

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,

  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: ["seeker", "recruiter", "admin"],
        input: true,
        defaultValue: "seeker",
      },
      // Seeker profile details (Settings page). Saved through better-auth's
      // built-in update-user endpoint — no custom backend needed.
      headline: {
        type: "string",
        input: true,
        defaultValue: "",
      },
      bio: {
        type: "string",
        input: true,
        defaultValue: "",
      },
      // Skills as one comma-separated string (e.g. "Figma,UI Design").
      skills: {
        type: "string",
        input: true,
        defaultValue: "",
      },
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
 
  
  database: mongodbAdapter(db, {
    client,
  }),
})
