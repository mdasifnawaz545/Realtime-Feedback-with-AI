"use client";
import React from 'react'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import Image from 'next/image';
import { Button } from "@/components/ui/button"
import  Link  from 'next/link';
//All the information related to the user is stored in the User object as well as it also contains the session related information as well as tokens and it is by default provided by the next-auth.
function Navbar() {
    const { data: session } = useSession();
    const user: User = session?.user as User
    return (
        
            <nav className='flex border-b-2 items-center justify-between px-6 w-full h-14 shadow-lg '>
                <div>
                    <a href="/dashboard"><h1 className='text-xl font-bold tracking-wide text-black'>Realtime Feedback.</h1></a>
                </div>
                <div>
                    {
                        user ? (<Button onClick={() => { signOut() }}>Sign out</Button>) : (<div className='flex items-center justify-center gap-2'><Link href='/signup'><Button>Sign up</Button></Link><Link href='/signin'><Button>Sign in</Button></Link></div>)
                    }
                </div>
            </nav>
        
    )
}

export default Navbar