'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import axios, { AxiosError } from 'axios'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import { API_Response } from "../../../../types"


const page = async () => {
    const [username, setUsername] = useState<string>('username');
    const [usernameMessage, setUsernameMessage] = useState('')

    const [isCheckingUsername, setIschekingUsername] = useState(false);
    //we are going to use a state variable in order to check the state of the state whether it is in pending state or not if it is in pending state then we are going to use a state variable that can check for the state and depending upon the state it can render the things on the client side.

    const [issubmitting, setIssubmitting] = useState(false);

    const usernameDebounce = useDebounceValue(username, 500);
    //we are using a set debounceValue reacthookts in order to control a state varible for the assignnig the value to that variable i.e. by using this  we are taking control on the variable and saying that we are dedupeing  the username so you assign them value not immediately but after some delay, As a result it will reduce the load from the server.

    const { toast } = useToast();

    const router = useRouter();
    //useRouter is used to navigate the user from one route to another route, we can also do that in a hardcoded value but it is a better parctise in nextjs to do that.

    //zod implementation
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }

    })

    useEffect(() => {
        const checkUniqueUsername = async () => {
            if (usernameDebounce) {
                setIschekingUsername((prev) => prev = true);
                setUsernameMessage('');
                try {
                    const uniqueUsernameResponse = await axios.get(`/api/check-username?username=${usernameDebounce}`);
                    console.log(uniqueUsernameResponse);
                    setUsername(uniqueUsernameResponse.data.message);
                } catch (error) {
                    const axiosError = error as AxiosError<API_Response>;
                    setUsernameMessage(axiosError.response?.data.message ?? 'Error')
                } finally {
                    setIschekingUsername((prev) => prev = false);
                }
            }
        }
        checkUniqueUsername();

    }, [usernameDebounce]);

    const handleSubmit = async(data:z.infer<typeof signUpSchema>)=>{
        setIssubmitting(true);
        
    }

    return (
        <div>page</div>
    )
}

export default page