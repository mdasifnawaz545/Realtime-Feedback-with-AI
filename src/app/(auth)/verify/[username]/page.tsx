"use client";

import { useToast } from "@/components/ui/use-toast"
import * as z from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { verifySchema } from "@/schemas/verifySchema"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { API_Response } from "../../../../../types"
import { useState } from "react"
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

//we are using z.infer in order to assign the data type only because whatever datatype is there it is defined as a zod validation shema so we are assigning that value so we have to extract the datatype first from the zod schema using z.infer


type Props = {
    params: {
        username: string
    }
}

function Verify({ params: { username } }: Props) {
    const [submitting, setSubmitting] = useState<boolean>(false);
    const { toast } = useToast();
    const router = useRouter();
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        /*defaultValues: {
            code1: 0,
            code2: 0,
            code3: 0,
            code4: 0,
            code5: 0,
            code6: 0,
        }*/
    })

    const handleSubmit = async (data: z.infer<typeof verifySchema>) => {
        setSubmitting(true);
        let verificationCode: string = ''
        for (const key in data) {
            verificationCode += data[key as keyof typeof data];
        }

        try {
            console.log(verificationCode)
            const verificationResponse = await axios.post<API_Response>('/api/verify-code', { username, verificationCode })
            if (verificationResponse.data.success) {
                toast({
                    title: "Sucess",
                    description: "Registered successfully",
                    variant: "default"
                })
                router.replace('/login');
            }
            else {
                toast({
                    title: "Failed",
                    description: "Failed to Signup",
                    variant: "destructive"
                })
            }
            // else {

            //     const loginUser = await signIn('credentials', { redirect: false, identifier: data.email, password: data.password });
            //     if (loginUser?.url) {
            //         toast({
            //             title: "Success",
            //             description: "Login Successfully"
            //         })
            //     }
            //     else {
            //         toast({
            //             title: "Failed",
            //             description: "Failed to Login"
            //         })
            //     }

            // }

        } catch (error) {
            const axiosError = error as AxiosError<API_Response>;
            const errMsg = axiosError.response?.data.message;
            toast({
                title: "Failed",
                description: errMsg,
                variant: "destructive"
            })
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="scale-95 max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                    <h1 className="text-xl
                     font-extrabold w-full tracking-wider lg:text-2xl mb-6">Join Relatime Feedback</h1>
                    <p className="mb-4">Hey {username} Kindly check Your Email for Verfication Code</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <div className="flex items-center justify-center w-full gap-4">


                            <FormField
                                control={form.control}
                                name="code1"
                                //mechanism of the form i.e. render
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="0" maxLength={1} {...field} className="w-9"
                                            />
                                        </FormControl>


                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="code2"
                                //mechanism of the form i.e. render
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="0" maxLength={1} {...field} className="w-9"
                                            />
                                        </FormControl>


                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="code3"
                                //mechanism of the form i.e. render
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="0" maxLength={1} {...field} className="w-9"
                                            />
                                        </FormControl>


                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="code4"
                                //mechanism of the form i.e. render
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="0" maxLength={1} {...field} className="w-9"
                                            />
                                        </FormControl>


                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="code5"
                                //mechanism of the form i.e. render
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="0" maxLength={1} {...field} className="w-9"
                                            />
                                        </FormControl>


                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="code6"
                                //mechanism of the form i.e. render
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="0" maxLength={1} {...field} className="w-9"
                                            />
                                        </FormControl>


                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button className="w-full" type="submit">
                            {
                                submitting ? (
                                    <Loader2 className="mr-1 animate-spin">Verifying, Please wait</Loader2>
                                ) : "Verify"
                            }
                        </Button>
                    </form>
                </Form>

            </div>

        </div>
    )
}

export default Verify