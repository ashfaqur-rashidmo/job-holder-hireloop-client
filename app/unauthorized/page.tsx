import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-3xl font-bold tracking-tight">Unauthorized</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        You do not have permission to access this page. Sign in with an account
        that has access, or head back home.
      </p>
      <Link href="/" className={buttonVariants({ variant: "outline" })}>
        Back to Home
      </Link>
    </div>
  )
}
