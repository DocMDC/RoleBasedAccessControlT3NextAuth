import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import Link from "next/link"

export default async function AdminPage() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect('/')
  }

  if (session.user.role !== 'admin') {
    return (
      <>
        <h1>Access Denied. You must be an admin to access this page.</h1>
        <h2>Your access level is: {session.user.role}</h2>
        <p>Return to <Link href="/" className="text-red-500">home page</Link></p>
      </>
    )
  }

  return (
    <div>Congrats. You are an {session.user.role} and have rights to access this page.</div>
  )
}
