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
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Loader2, RefreshCcw } from 'lucide-react';
import { MessageCard } from '@/components/MessageCard';
import messageArray from '../../../messageArray.json'
import Card from '@/components/Card';

type messageArr = {
  createdAt: Date,
  message: string,
  _id: string,
}

export default function page() {
  const [messages, setMessages] = useState<messageArr[]>([]);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const { toast } = useToast();

  if (!session || !session.user) {
    toast({
      title: "user not found",
      description: "User not found"
    })
  }

  //It is an optimised way to do that because internally from message card iteself the message is going to be deleted but we also want to update it in the dashboard even if the actual message got deleted from the backend due to some kind of error occured in backend. 

  const handleDeleteEfficiently = async (messageID: string) => {

    try {
      const deleteResponse = await axios.delete<API_Response>(`api/delete-message/${messageID}`);
      console.log(deleteResponse)
      if (deleteResponse.data.success) {
        toast({
          title: "Success",
          description: deleteResponse.data.message
        })
      }

    } catch (error) {
      const axiosError = error as AxiosError<API_Response>;
      toast({
        title: "Success",
        description: axiosError.response?.data.message
      })

    }
    setMessages((prev) => (
      prev.filter((el) => (el._id !== messageID))
    ))
  }

  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema),
  })

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');


  const fetchMessage = useCallback(async function (refresh: boolean = false) {
    await DBConnection();
    try {
      setIsMessageLoading(true)
      setIsSwitchLoading(false)
      const messageArray = await axios.get<API_Response>('/api/get-messages');
      setMessages(messageArray.data.messages as messageArr[])
      console.log(messageArray)
      console.log(messages)
      if (refresh) {
        toast({
          title: "Success",
          description: "Message Refreshed Successfully"
        })
      }
      else {
        toast({
          title: "Success",
          description: "Message Refreshed Successfully"
        })
      }

    } catch (error) {
      const axiosError = error as AxiosError<API_Response>;
      toast({
        title: "Failed to Load Messages from database",
        description: axiosError.response?.data.message
      })
    } finally {
      setIsMessageLoading(false);
      setIsSwitchLoading(false);
    }
  }, [setIsMessageLoading, setMessages])


  const fetchAcceptMessages = useCallback(async () => {
    await DBConnection();
    try {
      setIsSwitchLoading(true)
      const acceptMessageResponse = await axios.get<API_Response>('/api/accept-messages');

      setValue('acceptMessages', acceptMessageResponse.data.isAcceptingMessages as boolean);
      console.log(acceptMessageResponse.data.isAcceptingMessages)

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


  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessage();
    fetchAcceptMessages();
    console.log(messages);
  }, [session, fetchMessage]);


  // Handling the Switch for accepting the messages.

  const handleSwitch = async () => {
    await DBConnection();
    try {
      const acceptMessage=!acceptMessages;
      const response = await axios.post<API_Response>('/api/accept-messages', { acceptMessage});

      if (response.data.success) {
        //setValue is only for setting the value on the client hand side.
        setValue('acceptMessages', !acceptMessages)
        toast({
          title: "Success",
          description: "Message Acceptance changed"
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


  const { username } = session?.user as User || {};

  //Creating a base url for the user so that anyone with this link is able to send feedback messages.
  const baseURL = `${window.location.protocol}//${window.location.host}`
  const profileURL = `${baseURL}/u/${username}`;

  const copyToClipboard = () => {
    //In Nextjs or for react just we need window as well to copy an item into the clipboard.``
    navigator.clipboard.writeText(profileURL)
    toast({
      title: "Success",
      description: "Profile URL has been copied to Clipboard"
    })
  }

  if (!session || !session.user) {
    return <>
      <div className='flex items-center w-full min-h-screen justify-center text-2xl font-semibold tracking-wide'>
        Message Not Found
      </div>
    </>
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileURL}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitch}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessage(true);
        }}
      >
        {isMessageLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="p-4 flex flex-wrap items-center justify-center gap-4">
        {
          (messages.map((message, index) => (
            <Card id={message._id} message={message} func={handleDeleteEfficiently} />
          )))

        }
      </div>
    </div>
  );

}

