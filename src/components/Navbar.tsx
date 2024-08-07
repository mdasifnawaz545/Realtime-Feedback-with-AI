import React from 'react'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import Image from 'next/image';
//All the information related to the user is stored in the User object as well as it also contains the session related information as well as tokens and it is by default provided by the next-auth.
function Navbar() {
    const { data: session } = useSession();
    const user:User = session?.user
    return (
        <div className=''>
            <nav>
                <div>
                    <h1 className='text-bold tracking-widest text-gray-900'>Realtime <span className='text-gray-400'>Feedback</span></h1>
                </div>
                <div>
                    {

                    }
                </div>
            </nav>
        </div>
    )
}

export default Navbar