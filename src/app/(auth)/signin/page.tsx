'use client'
import React from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'


function page() {
    const { data: session } = useSession();
    if (session) {
        return (
            <div className='flex flex-col items-center justify-center w-full h-full'>
                Signed in as {session.user.email} <br />
                <button className='bg-blue-950 text-white p-2' onClick={() => { signOut() }}>Sign Out</button>
            </div>
        )
    }
    return (
        <div  className='flex flex-col items-center justify-center w-full min-h-screen'>
            Not signed in <br />
            <button  className='bg-blue-950 text-white p-2 rounded-xl px-4'  onClick={() => { signIn() }}>Sign In</button>
        </div>
    )
}

export default page