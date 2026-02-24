import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    email: string
    name: string
    onboardingCompleted: boolean
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      onboardingCompleted: boolean
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    onboardingCompleted: boolean
  }
}