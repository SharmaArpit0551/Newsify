import React from 'react'
// import article from './article.jsx';
import { useLoadUserQuery } from '@/features/api/authApi';
import { useGetBookmarksQuery } from '@/features/api/authApi'; // Import the RTK query hook
import { Card, CardContent } from "@/components/ui/card"; // Assuming you have a Card component to display the article
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";


const MyBookmarks = () => {

    const { data, isLoading, isError } = useGetBookmarksQuery(); // Use the RTK hook to get bookmarks

    if (isLoading) return <h1>Loading...</h1>;
    if (isError) return <h1>Failed to load bookmarks</h1>;
    return (
        <div className="text-center">
            <h1 className="font-bold text-2xl mt-20">SEE WHAT YOU HAVE SAVED!</h1>
            <div className="my-5">
                {isLoading ? (
                    <MyLearningSkeleton />
                ) : data.bookmarks.length === 0 ? (
                    <p>You have not saved any article right now</p>
                ) : (
                    <div className="max-w-7xl mx-auto p-6">
                        <h2 className="font-bold text-3xl text-center mb-10"></h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {data?.bookmarks?.map((article) => (
                                <Link to={`/article-detail/${article._id}`} key={article._id}>
                                    <Card className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                                        <div className="relative">
                                            <img
                                                src={article.articleThumbnail}
                                                alt="article"
                                                className="w-full h-36 object-cover rounded-t-lg"
                                            />
                                        </div>
                                        <CardContent className="px-5 py-4 space-y-3">
                                            <h1 className="hover:underline font-bold text-lg truncate">
                                                {article.articleTitle}
                                            </h1>
                                            <h5 className="hover:underline truncate">
                                                {article.subTitle}
                                            </h5>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={article.creator.photoUrl || "https://github.com/shadcn.png"} alt="@shadcn" />
                                                        <AvatarFallback>CN</AvatarFallback>
                                                    </Avatar>
                                                    <h1 className="font-medium text-sm">
                                                        {article.creator?.name}
                                                    </h1>
                                                </div>
                                                <Badge className="bg-blue-600 text-white px-2 py-1 text-xs rounded-full">
                                                    {article.readingTime} Mins
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>









    )
}

export default MyBookmarks

const MyLearningSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
            <div
                key={index}
                className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
            ></div>
        ))}
    </div>
);
