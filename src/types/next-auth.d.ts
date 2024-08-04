import 'next-auth'
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            _id?: string;
            verified?: boolean;
            isAcceptingMessages?: boolean;
            username?: string
        } & DefaultSession['user']
    }
    interface User {
        _id?: string,
        verified?: boolean,
        isAcceptingMessage: Boolean,
        username: string,

    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
        verified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string
    }
}