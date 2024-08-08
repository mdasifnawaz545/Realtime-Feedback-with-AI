"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { API_Response, Message } from "../../types"
import axios, { AxiosError } from "axios"
import { title } from "process"
import { useToast } from "./ui/use-toast"

type Props = {
    params: {
        message: Message,
        func: (messageID: string) => void
    }
}

function MessageCard({ params: { message, func } }: Props) {

    const { toast } = useToast();

    const handleDeleteMessage = async () => {
        try {
            const deleteResponse = await axios.delete<API_Response>(`api/delete-message/${message._id}`);
            if (deleteResponse.data.success) {
                toast({
                    title: "Success",
                    description: deleteResponse.data.message;
                })
            }

        } catch (error) {
            const axiosError = error as AxiosError<API_Response>;
            toast({
                title: "Failed",
                description: axiosError.response?.data.message
            })

        }

        return (
            <Card>
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Card Content</p>
                </CardContent>
                <CardFooter>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive"><><X className="mr-1 h-5 w-5" />Delete</></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    messages and remove the data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => { handleDeleteMessage() }}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>

        )
    }
}
export default MessageCard