"use client"
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function ClientPage() {
    const {data: session} = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/')
        }
    })
    
    if (!session?.user) return

  return (
    <div>
        <h1>This is a private client page component accessing auth</h1>
        <h1>Welcome {session.user.name}</h1>
        <h1>Your access level is {session.user.role}</h1>
    </div>
  )
}
