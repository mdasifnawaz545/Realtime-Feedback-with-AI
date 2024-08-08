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
        <div className=''>
            <nav className='flex items-center justify-between px-2 w-full h-14 shadow-lg '>
                <div>
                    <a href="/dashboard"><h1 className='text-xl text-bold tracking-widest text-gray-900'>Realtime <span className='text-xl text-gray-500'>Feedback</span></h1></a>
                </div>
                <div>
                    {
                        user ? (<Button onClick={() => { signOut() }}>Sign out</Button>) : (<div className='flex items-center justify-center gap-2'><Link href='/signup'><Button>Sign up</Button></Link><Link href='/signin'><Button>Sign in</Button></Link></div>)
                    }
                </div>
            </nav>
        </div>
    )
}

export default Navbar