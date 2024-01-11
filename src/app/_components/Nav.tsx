import Link from "next/link"

export default function Nav() {
  return (
    <nav className="bg-blue-800 p-4">
            <ul className="flex justify-evenly text-2xl font-bold">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/api/auth/signin">Sign In</Link></li>
                <li><Link href="/api/auth/signout">Sign Out</Link></li>
                <li><Link href="/not-protected">Not protected</Link></li>
                <li><Link href="/admin">Admin</Link></li>
                <li><Link href="/user">User</Link></li>
                <li><Link href="/client">Protected client</Link></li>
            </ul>
        </nav>
  )
}
