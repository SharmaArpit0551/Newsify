import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState, useEffect } from 'react';
import Course from './Course';
import { useLoadUserQuery, useUpdateUserMutation } from '@/features/api/authApi';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { useGetCreatorCourseQuery } from '../../features/api/courseApi.js';

const Profile = () => {
    const [name, setName] = useState("");
    const [about, setAbout] = useState("");
    const [profilePhoto, setProfilePhoto] = useState("");
    const [bannerPhoto, setBannerPhoto] = useState("");

    const { data, isLoading, refetch } = useLoadUserQuery();
    const { data: creatorArticles, isLoading: isLoadingCourses } = useGetCreatorCourseQuery();

    const [updateUser, { isLoading: updateUserIsLoading, isError, error, isSuccess }] = useUpdateUserMutation();

    const onChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) setProfilePhoto(file);
        console.log(file);
    };

    const onBannerChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) setBannerPhoto(file);
        console.log(file);
    };

    const updateUserHandler = async () => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("about", about);
        formData.append("profilePhoto", profilePhoto);
        formData.append("bannerPhoto", bannerPhoto);
        await updateUser(formData);
    };

    useEffect(() => {
        refetch();
    }, []);

    useEffect(() => {
        if (isSuccess) {
            refetch();
            toast.success(data.message || "Profile updated.");
        }
        if (isError) {
            toast.error(error.message || "Failed to update profile");
        }
    }, [error, updateUser, isSuccess, isError]);

    const user = data && data.user;

    // Page Skeleton
    if (isLoading || isLoadingCourses) return (
        <>
            <MyProfile />
            <div className="max-w-4xl mx-auto my-24 px-4 md:px-0">
                <div className="my-5">
                    <MyCreatedCourses />  {/* Skeleton for courses */}
                </div>
            </div>
        </>
    );

    return (
        <div className="max-w-[100%] mx-auto px-1 my-24">
            <div className="max-w-4xl mx-auto px-4 my-24">
                <div className="relative w-full h-72 mb-8">
                    <img
                        src={user?.bannerUrl || "https://via.placeholder.com/1280x480"}
                        alt="Banner"
                        className="w-full h-full object-cover rounded-md"
                    />
                </div>
                <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>

                {/* User Profile */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
                    <div className="flex flex-col items-center">
                        <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
                            <AvatarImage
                                src={user?.photoUrl || "https://github.com/shadcn.png"}
                                alt="@shadcn"
                            />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>
                    <div>
                        <div className="mb-2">
                            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
                                Name:
                                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                                    {user.name}
                                </span>
                            </h1>
                        </div>
                        <div className="mb-2">
                            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
                                About:
                                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                                    {user.about || "No description available"}
                                </span>
                            </h1>
                        </div>
                        <div className="mb-2">
                            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
                                Email:
                                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                                    {user.email}
                                </span>
                            </h1>
                        </div>
                        <div className="mb-2">
                            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
                                Role:
                                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                                    {user.role == "instructor" ? "Admin" : "Reader"}
                                </span>
                            </h1>
                        </div>

                        {/* Dialog to update the user Profile */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="sm" className="mt-2">
                                    Edit Profile
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Profile</DialogTitle>
                                    <DialogDescription>
                                        Make changes to your profile here. Click save when you're
                                        done.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label>Name</Label>
                                        <Input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Name"
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label>About</Label>
                                        <Input
                                            type="text"
                                            value={about}
                                            onChange={(e) => setAbout(e.target.value)}
                                            placeholder="About Me"
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label>Profile Photo</Label>
                                        <Input
                                            onChange={onChangeHandler}
                                            type="file"
                                            accept="image/*"
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label>Banner Photo</Label>
                                        <Input
                                            onChange={onBannerChangeHandler}
                                            type="file"
                                            accept="image/*"
                                            className="col-span-3"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        disabled={updateUserIsLoading}
                                        onClick={updateUserHandler}
                                    >
                                        {updateUserIsLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Please wait
                                            </>
                                        ) : (
                                            "Save Changes"
                                        )}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>


                <div>
                    <h1 className="font-medium text-lg">Article you've Published</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
                        {creatorArticles?.length === 0 ? (
                            <h1>You haven't created any Article yet</h1>
                        ) : (
                            creatorArticles.courses?.map((course) => (
                                <Course course={course} key={course._id} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

const MyCreatedCourses = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
        {[...Array(3)].map((_, index) => (
            <div
                key={index}
                className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
            ></div>
        ))}
    </div>
);


const MyProfile = () => (
    <div className="max-w-4xl mx-auto px-4 my-24">
        <Skeleton className="h-8 w-32 mx-auto md:mx-0 mb-6" />
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
            <Skeleton className="h-24 w-24 md:h-32 md:w-32 rounded-full mb-4" />
            <div>
                <div className="mb-2">
                    <Skeleton className="h-6 w-40 mb-2" />
                    <Skeleton className="h-5 w-32" />
                </div>
                <div className="mb-2">
                    <Skeleton className="h-6 w-40 mb-2" />
                    <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="h-10 w-24 mt-4" />
            </div>
        </div>
    </div>
);
