import React from 'react'
import { API_Response } from '../../types';
import axios, { AxiosError } from 'axios';
import { useToast } from './ui/use-toast';
import { Button } from './ui/button';
import dayjs from 'dayjs';
import { RiDeleteBin6Line } from 'react-icons/ri'

type Props = {
    id: string,
    message: {

        message: string,
        createdAt: Date
    },
    func: (messageID: string) => void;
}

type props = {
    message: {
        message: string,
        createdAt: Date
    }
    id: string,
    func: (messageID: string) => void
}

function Card({ message,id,func }: props): any {

    const { toast } = useToast();
   
    const handleDelete=()=>{
        func(id!);
    }


    return (

        <div className='md:w-80 w-64 border-2 flex justify-between gap-4 border-gray-200 p-4'>
            <div >               <h1>{message.message}</h1>
                <br />
                <p>{dayjs(message.createdAt).format('MMM D, YYYY - hh:mm A')}</p></div>
            <div className='flex items-start justify-end'>
                <Button className='h-10 w-10 relative bg-red-700'><RiDeleteBin6Line className='w-96 absolute ' onClick={()=>{handleDelete()}} /></Button>
            </div>

        </div>
    )
}

export default Card