import 'next-auth'
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            _id?: string;
            verified?: boolean;
            isAcceptingMessages?: boolean;
            username?: string
        } & DefaultSession['user'] // Default session if we are not explicitely defining.
    }
    interface User {
        _id?: string,
        verified?: boolean,
        isAcceptingMessages: boolean,
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