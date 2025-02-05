"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import dayjs from "dayjs";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { API_Response } from "../../types";
import axios, { AxiosError } from "axios";
import { useToast } from "./ui/use-toast";
import { RiDeleteBinLine } from "react-icons/ri";

// Define prop type properly
type MessageCardProps = {
    message: {
        _id: string;
        message: string;
        createdAt: Date;
    };
    onDelete: (messageID: string) => void; // Callback function
};

export function MessageCard({ message, onDelete }: MessageCardProps) {
    const { toast } = useToast();

    // Function to handle message deletion
    const handleDeleteMessage = async () => {
        try {
            const deleteResponse = await axios.delete<API_Response>(
                `/api/delete-message/${message._id}`
            );

            if (deleteResponse.data.success) {
                toast({
                    title: "Success",
                    description: deleteResponse.data.message,
                });
                onDelete(message._id); // Update UI after deletion
            }
        } catch (error) {
            const axiosError = error as AxiosError<API_Response>;
            toast({
                title: "Failed",
                description: axiosError.response?.data.message,
            });
        }
    };

    return (
        <Card className="w-96 scale-90">
            <CardHeader>
                <CardTitle>Message From Anonymous</CardTitle>
                <CardDescription></CardDescription>
                <div className="text-sm">
                    {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
                </div>
            </CardHeader>
            <CardContent>
                <div>
                {message.message}
                </div>
            </CardContent>
            <CardFooter>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                        <RiDeleteBinLine />
                        <span className="ml-1"></span>Delete
                        </Button>
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
                            <AlertDialogAction onClick={()=>{onDelete(message._id)}} className="bg-red-500">
                            <RiDeleteBinLine />
                               <span className="ml-1"></span> Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    );
}
