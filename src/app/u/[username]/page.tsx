import React from 'react'

type Props = {
    params: {
        username: string
    }
}

function page({ params: { username } }: Props) {
    return (
        <div>page</div>
    )
}

export default page