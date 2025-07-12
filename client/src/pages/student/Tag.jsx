import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useGetArticlesByTagQuery } from '@/features/api/tagApi';

const Tag = () => {
    const params = useParams();
    const tagId = params.tagId;
    const { data, isLoading, isError } = useGetArticlesByTagQuery(tagId)
    console.log(data)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    if (isLoading) return <h1>Loading...</h1>;
    if (isError) return <h1>Failed to load Articles</h1>;

    const totalPages = Math.ceil(data.articles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = data?.articles.slice(startIndex, startIndex + itemsPerPage);
    console.log(data.articles)
    return (
        <div className="text-center">
            <h1 className="font-bold text-2xl mt-20">Articles on related tag</h1>
            <div className="my-5">
                {isLoading ? (
                    <MyLearningSkeleton />
                ) : data.articles.length === 0 ? (
                    <p>There is no article yet</p>
                ) : (
                    <div className="max-w-7xl mx-auto p-6">
                        <h2 className="font-bold text-3xl text-center mb-10"></h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {currentItems?.map((article) => (
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
                                                        <AvatarImage src={article.creator?.photoUrl || "https://github.com/shadcn.png"} alt="@shadcn" />
                                                    </Avatar>
                                                    <h1 className="font-medium text-sm">
                                                        {article.creator?.name}
                                                    </h1>
                                                </div>
                                                <Badge className="bg-blue-600 text-white px-2 py-1 text-xs rounded-full">
                                                    {article?.readingTime} Mins
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                        <div className="flex justify-center mt-6">
                            <Button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="mr-4"
                            >
                                Previous
                            </Button>
                            <Button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Tag

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