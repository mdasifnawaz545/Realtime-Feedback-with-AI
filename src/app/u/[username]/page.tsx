"use client";
import { useToast } from '@/components/ui/use-toast';
import DBConnection from '@/lib/dbConnection'
import UserModel from '@/model/User';
import axios, { AxiosError } from 'axios';
import React, { useState } from 'react'
import { API_Response, User } from '../../../../types';
import { useForm } from 'react-hook-form';
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from "@/components/ui/textarea"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { sendMessageSchema } from '@/schemas/sendMessageSchema';
import Link from 'next/link';

type Props = {
    params: {
        username: string
    }
}

function page({ params: { username } }: Props) {

    const [isSending, setIsSending] = useState(false);
    const { toast } = useToast();
    const form = useForm<z.infer<typeof sendMessageSchema>>({
        resolver: zodResolver(sendMessageSchema)
    })

    const handleSendMessage = async (data: z.infer<typeof sendMessageSchema>) => {
        try {
            setIsSending(true);
            let message = data.message;
            const response = await axios.post<API_Response>('/api/send-message', { username, message })
            if (response.data.success) {
                toast({
                    title: "Success",
                    description: response.data.message
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<API_Response>
            toast({
                title: "Failed",
                description: axiosError.response?.data.message
            })
        } finally {
            setIsSending(false);
        }
    }
    return (
        <div className='w-full  min-h-screen flex flex-col items-center justify-start'>
            <h1 className='text-4xl font-bold mt-10'>Public Profile Link</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSendMessage)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="message"
                        //mechanism of the form i.e. render
                        render={({ field }) => (
                            <FormItem>
                                <br />
                                <br />
                                <br />
                                <FormLabel className='font-light'>Send anonymous message to, <b className='font-bold'>{username}</b></FormLabel>

                                <FormControl>
                                    <Textarea className='w-72 lg:w-[35rem]' placeholder="Enter Your Message" {...field}
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button className='w-full' type="submit">
                        {
                            isSending ? (<>
                                <Loader2 className="mr-2 animate-spin" />
                                Please wait
                            </>
                            ) : "Send Message"
                        }
                    </Button>
                </form>
            </Form>

<br />
<br />
<br />
            <div className='flex flex-col gap-4 items-center justify-center'>
                <p>Get Your Message Board</p>
                <Link href={'/signup'}><Button>
                    Create Your Account
                </Button></Link>
                

            </div>
        </div>
    )
}

export default page