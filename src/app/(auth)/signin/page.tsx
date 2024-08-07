"use client";

import { signInSchema } from '@/schemas/signInSchema'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { useState } from 'react'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Link from 'next/link'
import { sign } from 'crypto'
import axios, { AxiosError } from 'axios'
import { API_Response } from '../../../../types'
import { signIn } from 'next-auth/react'

function page() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIssubmitting] = useState(false);
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema)
  })
  const handleSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      const loginResponse = await signIn('credentials', {
        //after login authjs will automatically redirect to a specific path so we are telling authjs to do not redirect to any page after successfull login i am here to handle it explicitely.
        redirect: false,
        identifier: data.identifier,
        password: data.password
      })
      if (loginResponse?.error) {
        toast({
          title: "Failed",
          description: "Failed to login, either username or password is incorrect",
          variant: "destructive"
        })
      }
      console.log(loginResponse)
      if(loginResponse?.url) {
        toast({
          title: "Success",
          description: "Login Successfully",
          variant: "default"
        })
        router.replace('/dashboard')
      }
      

    } catch (error) {
      const errorMsg = error as AxiosError<API_Response>
      toast({
        title: "Failed to Login",
        description: errorMsg.response?.data.message,
        variant: "destructive"
      })

    }


  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="scale-95 max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-xl
                     font-extrabold w-full tracking-wider lg:text-2xl mb-6">Join Relatime Feedback</h1>
          <p className="mb-4">Sign In to start your ananoymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              //mechanism of the form i.e. render
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="email or username" {...field}

                    />
                  </FormControl>

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
                    <Input placeholder="password" required type="password" {...field}

                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              {
                isSubmitting ? (<>
                  <Loader2 className="mr-2 animate-spin" />
                  Logging in
                </>
                ) : "Log in"
              }
            </Button>
          </form>
        </Form>
        <div className="text-center">
          <p>
            Don't have an account ?&nbsp;<span>
              <Link className="text-blue-500 hover:underline hover:text-blue-800" href="/signup">Sign up</Link>
            </span>
          </p>
        </div>
      </div>

    </div>
  )
}

export default page