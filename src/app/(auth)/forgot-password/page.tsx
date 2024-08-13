"use client";

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { forgotPasswordSchema } from '@/schemas/forgotPasswordSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { z } from 'zod';

function page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const handleSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    setIsSubmitting((prev) => prev = !prev)
    //handling the function of sending the email and verifying the email and then changing the password with a message.
    const toast = useToast();
    const passwordChangeResponse = await axios.post('/api/forgot-password', { data })





    setIsSubmitting((prev) => prev = !prev)
  }

  return (
    <div className='w-full flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-96 scale-90 md:scale-100 p-4 bg-white rounded-md  shadow-lg'>
        <h1 className='text-center text-2xl font-bold'>Forgot Password ?</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Password</FormLabel>
                  <FormControl>
                    <Input placeholder="old password" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input placeholder="new password" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className='w-full text-center'>Continue</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default page