"use client";

import React, { useCallback, useEffect, useState } from 'react'
import { API_Response, Message } from '../../../../types';
import { useSession } from 'next-auth/react';
import { User } from 'next-auth';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import DBConnection from '@/lib/dbConnection';
import axios, { AxiosError } from 'axios';

function page() {
  const [message, setMessage] = useState<Message[]>([]);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const { toast } = useToast();

  if (!session || !session.user) {
    toast({

    })
  }

  //It is an optimised way to do that because internally from message card iteself the message is going to be deleted but we also want to update it in the dashboard even if the actual message got deleted from the backend due to some kind of error occured in backend. 

  const handleDeleteEfficiently = (messageID: string) => {
    setMessage((prev) => (
      prev.filter((el) => (el._id !== messageID))
    ))
  }

  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessages: true,
    }
  })

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  useEffect(() => {
    const fetchMessage = useCallback(async function (refresh: boolean) {
      await DBConnection();
      try {
        setIsMessageLoading(true)
        setIsSwitchLoading(false)
        const messageArray = await axios.get<API_Response>('/api/get-messages');
        setMessage(messageArray.data.messages as Message[])
        if (refresh) {
          toast({
            title: "Success",
            description: "Message Refreshed Successfully"
          })
        }

      } catch (error) {
        const axiosError = error as AxiosError<API_Response>;
        toast({
          title: "Failed to Load Messages",
          description: axiosError.response?.data.message
        })
      } finally {
        setIsMessageLoading(false);
        setIsSwitchLoading(false);
      }
    }, [setIsMessageLoading, setMessage])

  }, [session])

  useEffect(() => {
    useCallback(async () => {
      await DBConnection();
      try {
        setIsSwitchLoading(true)
        const acceptMessageResponse = await axios.get<API_Response>('/api/accept-messages');

        setValue('acceptMessages', acceptMessageResponse.data.isAcceptingMessages as boolean);

      } catch (error) {
        const axiosError = error as AxiosError<API_Response>;
        toast({
          title: "Failed to Load Messages",
          description: axiosError.response?.data.message,
          variant: "destructive"
        })
      }
      finally {
        setIsSwitchLoading(false);
      }
    }, [setValue])
  }, [session, setValue])


  // Handling the Switch for accepting the messages.

  const handleSwitch = async () => {
    await DBConnection();
    try {
      const response = await axios.post<API_Response>('/api/accept-messages', { acceptMessages: !acceptMessages });

      if (response.data.success) {
        //setValue is only for setting the value on the client hand side.
        setValue('acceptMessages', !acceptMessages)
        toast({
          title: "Success",
          description: response.data.message
        })
      } else {
        toast({
          title: "Failure",
          description: response.data.message
        })
      }

    } catch (error) {
      const axiosError = error as AxiosError<API_Response>;
      toast({
        title: "Failure",
        description: axiosError.response?.data.message
      })
    }
  }


  




  if (!message.length || !session || !session.user) {
    return <>
      <div className='flex items-center w-full min-h-screen justify-center text-2xl font-semibold tracking-wide'>
        Message Not Found
      </div>
    </>
  }

  return (
    <div className=''>

    </div>
  )

}

export default page