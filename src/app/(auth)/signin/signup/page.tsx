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
import { API_Response } from "../../../../../types"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"


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

    }, [usernameDebounce]);

    const handleSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIssubmitting(true);
        try {
            const userResponse = await axios.post('/api/sign-up', data);
            toast({
                title: "Sucesss",
                description: userResponse.data.message
            })
            router.replace(`/verify/${username}`)
            setIssubmitting(false);
            //how the data is coming inside the response by using an axios through the backend will see by console.log() the response of the userResponse.
            console.log(userResponse)
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
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="texte-4xl
                     font-extrabold tracking-tighter lg:text-5xl mb-6">Join Relatime Feedback</h1>
                    <p className="mb-4">Sign up to start your ananoymous adventure</p>
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
                                                    setUsername(e.target.value);
                                                }
                                            }
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
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
                                        <Input placeholder="youremail@gmail.com" {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
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
                                        <Input placeholder="password" {...field}

                                        />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">
                            {
                                issubmitting ? (
                                    <Loader2 className="mr-6">Please wait</Loader2>
                                ) : "Sign up"
                            }
                        </Button>
                    </form>
                </Form>
                <div className="text-center">
                    <p>
                        Already have an account ?&nbsp;<span>
                            <Link href="/sign-in">Sign in</Link>
                        </span>
                    </p>
                </div>
            </div>

        </div>
    )
}

export default page