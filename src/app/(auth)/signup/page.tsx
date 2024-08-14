"use client";
import { zodResolver } from "@hookform/resolvers/zod"
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import axios, { AxiosError } from 'axios'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import { API_Response } from "../../../../types"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react";


export default function Signup() {
    const [username, setUsername] = useState<string>('username');
    const [usernameMessage, setUsernameMessage] = useState('')

    const [isCheckingUsername, setIschekingUsername] = useState(false);
    //we are going to use a state variable in order to check the state of the state whether it is in pending state or not if it is in pending state then we are going to use a state variable that can check for the state and depending upon the state it can render the things on the client side.

    const [issubmitting, setIssubmitting] = useState(false);

    const usernameDebounce = useDebounceCallback(setUsername, 300);
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


    const handleGoogleAuth = async () => {
        const response = await signIn('google')
    }

    useEffect(() => {
        const checkUniqueUsername = async () => {
            if (username) {
                setIschekingUsername((prev) => prev = true);
                setUsernameMessage('');
                try {
                    const uniqueUsernameResponse = await axios.get(`/api/check-username?username=${username}`);
                    // console.log(uniqueUsernameResponse);
                    setUsernameMessage(uniqueUsernameResponse.data.message);
                } catch (error) {
                    const axiosError = error as AxiosError<API_Response>;
                    setUsernameMessage(axiosError.response?.data.message ?? 'Error')
                } finally {
                    setIschekingUsername((prev) => prev = false);
                }
            }
        }
        checkUniqueUsername();

    }, [username]);

    const handleSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIssubmitting(true);
        try {
            const userResponse = await axios.post<API_Response>('/api/sign-up', data);
            toast({
                title: "Sucesss",
                description: userResponse.data.message
            })

            router.replace(`/verify/${username}`)
            setIssubmitting(false);
            //how the data is coming inside the response by using an axios through the backend will see by console.log() the response of the userResponse.
            // console.log(userResponse)
        } catch (error) {
            const axiosError = error as AxiosError<API_Response>;
            let errorMessage = axiosError.response?.data.message;
            toast({
                title: "Failure",
                description: errorMessage,
                variant: "destructive"
            })
            setIssubmitting(false);
        }

    }

    //we are using axios call to communicate with the backend only for frontend part we are using the method of router to navigate in the frontend side.

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="scale-95 max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                    <h1 className="text-xl
                     font-extrabold w-full tracking-wider lg:text-2xl mb-6">Join Relatime Feedback</h1>
                    <p className="mb-4">Sign up to start your ananoymous adventure</p>
                </div>
                <div className="flex items-center justify-center">
                    <Button onClick={
                        () => {
                            handleGoogleAuth()
                        }
                    } className="bg-white border text-black hover:text-white"><FcGoogle className="w-full h-full" />&nbsp;&nbsp;Sign in with Google</Button>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="username"
                            //mechanism of the form i.e. render
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="username" {...field}
                                            onChange={
                                                (e) => {
                                                    field.onChange(e);
                                                    usernameDebounce(e.target.value);
                                                }
                                            }
                                        />
                                    </FormControl>
                                    {
                                        isCheckingUsername && <Loader2 className="animate-spin" />

                                        // usernameMessage === "Username is unique" ?
                                        // (<p className="text-sm text-green-500">username is available</p>) :
                                        // (<p className="text-xs text-red-500">username is not available</p>)
                                        // if( usernameMessage === "Username is unique"){
                                        //     <p className="text-sm text-green-500">username is available</p>
                                        // }
                                        // else{
                                        //     <p className="text-xs text-red-500">username is not available</p>
                                        //     setUsername('');
                                        // }

                                        //why the above code is not working
                                    }
                                    <p className={`text-xs ${usernameMessage === "Username is unique" ? "text-green-500" : "text-red-500"}`}>{usernameMessage}</p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            //mechanism of the form i.e. render
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="your-email@gmail.com" {...field}
                                        />
                                    </FormControl>
                                    <p className="text-xs text-blue-500">We'll send you a verification Code</p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            //mechanism of the form i.e. render
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="password" type="password" {...field}

                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="w-full" type="submit">
                            {
                                //use of loader with a field in lucide react library.
                                issubmitting ? (<>

                                    <Loader2 className="mr-2 animate-spin" />
                                    Please wait
                                </>) : "Sign up"
                            }
                        </Button>
                    </form>
                </Form>
                <div className="text-center">
                    <p>
                        Already have an account ?&nbsp;<span>
                            <Link className="text-blue-500 hover:underline hover:text-blue-800" href="/sign-in">Sign in</Link>
                        </span>
                    </p>
                </div>
            </div>

        </div>
    )
}
