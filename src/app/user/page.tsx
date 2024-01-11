import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import type { User } from "next-auth"


export default async function UserPage() {
    const session = await getServerAuthSession();
    console.log(session?.user)
    console.log(session?.user.role)

    if (!session) {
        redirect('/')
    }

  return (
    <>
    <div>This is the private user page. Welcome {session.user.name} .</div>
    <h2>Your role is {session.user.role}</h2>
    </>
  )
}
