import { LogOut, Menu, School } from 'lucide-react'
import React, { useEffect } from 'react'
import { Button } from "../components/ui/button"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DarkMode from './DarkMode'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./ui/sheet";
// import { Link } from 'react-router-dom'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { Link, useNavigate } from 'react-router-dom'
import { useLoadUserQuery, useLogoutUserMutation } from '@/features/api/authApi'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'

const Navbar = () => {

    const { user } = useSelector(store => store.auth)
    const [logoutUser, { data, isLoading, isSuccess }] = useLogoutUserMutation();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        await logoutUser();
    }
    useEffect(() => {
        if (isSuccess) {
            toast.success(data.message || "User Logged Out")
            navigate("/login")
        }
    }, [isSuccess])


    return (
        <div className="h-16 dark:bg-[#020817] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
            <div className='md:flex max-w-7xl mx-auto hidden justify-between gap-10 h-full'>
                <Link to="/">
                    <div className='flex gap-2 items-center mt-3'>
                        <School size={"30"} />
                        <h1 className='hidden md:block font-extrabold text-2xl'>Newsify</h1>
                    </div></Link>

                {/* User and DarkMode*/}
                <div className='flex items-center gap-8'>
                    {user ? (<DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar>
                                <AvatarImage src={user?.photoUrl} alt="@shadcn" />
                                <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <Link to="mybookmarks">My Bookmarks</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link to="myreadinghistory">History</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link to="profile">Edit Profile</Link>
                                </DropdownMenuItem>
                                {
                                    user.role == "instructor" && (
                                        <DropdownMenuItem>
                                            <Link to="/admin/dashboard">Dashboard</Link>
                                        </DropdownMenuItem>
                                    )}

                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logoutHandler}  >
                                <LogOut />
                                <span>Log out</span>

                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>) :
                        <div className='flex gap-2 items-center'>
                            <Link to="/login"><Button variant="outline">Login</Button></Link>
                            <Link to="/login"> <Button>Signup</Button></Link>
                        </div>
                    }
                    <DarkMode />
                </div>
            </div>

            {/* Mobile Device */}
            <div className="flex md:hidden items-center justify-between px-4 h-full">
                <Link to="/"> <h1 className="font-extrabold text-2xl">Newsify</h1></Link>
                <div className='flex md:hidden items-center justify-between px-4 h-full'>
                    <MobileNavbar />
                </div>
            </div>
        </div>
    )
}

export default Navbar

const MobileNavbar = () => {
    const { user } = useSelector(store => store.auth)
    const [logoutUser, { data, isLoading, isSuccess }] = useLogoutUserMutation();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        await logoutUser();
    }
    useEffect(() => {
        if (isSuccess) {
            toast.success(data.message || "User Logged Out")
            navigate("/login")
        }
    }, [isSuccess])

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    size="icon"
                    className="rounded-full hover:bg-gray-200"
                    variant="outline"
                >
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader className="flex flex-row items-center justify-between mt-2">
                    <Link to="/">
                        <SheetTitle>Newsify</SheetTitle>
                    </Link>
                    <DarkMode />
                </SheetHeader>
                <Separator className="mr-2" />
                {user ? (
                    <div className='flex flex-col gap-2'>
                        <Avatar>
                            <AvatarImage src={user?.photoUrl} alt="@shadcn" />
                            <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <SheetClose asChild>
                            <Link to="mybookmarks">My Bookmarks</Link>
                        </SheetClose>
                        <SheetClose asChild>
                            <Link to="myreadinghistory">History</Link>
                        </SheetClose>
                        <SheetClose asChild>
                            <Link to="profile">Edit Profile</Link>
                        </SheetClose>
                        {user.role === "instructor" && (
                            <SheetClose asChild>
                                <Link to="/admin/dashboard">Dashboard</Link>
                            </SheetClose>
                        )}
                        <SheetClose asChild>
                            <SheetClose asChild>
                                <div
                                    onClick={logoutHandler}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <LogOut />
                                    <span>Log out</span>
                                </div>
                            </SheetClose>

                        </SheetClose>
                    </div>
                ) : (
                    <div className='flex gap-2 items-center'>
                        <SheetClose asChild>
                            <Link to="/login">
                                <Button variant="outline">Login</Button>
                            </Link>
                        </SheetClose>
                        <SheetClose asChild>
                            <Link to="/login">
                                <Button>Signup</Button>
                            </Link>
                        </SheetClose>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};

