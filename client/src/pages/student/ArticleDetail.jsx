import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeInfo, Heart, Trash } from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useGetArticleByCategoryQuery, useGetCourseByIdQuery, useSummarizeDescriptionMutation } from "@/features/api/courseApi";
import { useAddBookmarkMutation, useReadingHistoryMutation, useRemoveBookmarkMutation } from "@/features/api/authApi";
import { useCreateCommentMutation, useGetCommentsByCourseQuery, useDeleteCommentMutation } from "@/features/api/commentApi.js";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useSelector } from "react-redux";

const ArticleDetail = () => {
    const params = useParams();
    const courseId = params.courseId;
    const navigate = useNavigate();

    // API calls
    const { data, isLoading, isError } = useGetCourseByIdQuery(courseId);
    const { data: relatedArticlesData, isLoading: relatedLoading } = useGetArticleByCategoryQuery(courseId);
    const [summarizeDescription, { data: summarizedData, isLoading: summarizedLoading }] = useSummarizeDescriptionMutation();
    const [addBookmark, { isLoading: addLoading }] = useAddBookmarkMutation();
    const [removeBookmark, { isLoading: removeLoading }] = useRemoveBookmarkMutation();
    const [createComment, { isLoading: createCommentLoading }] = useCreateCommentMutation();

    const { data: commentsData, isLoading: commentsLoading, isError: commentsError } = useGetCommentsByCourseQuery(courseId);
    const [deleteComment] = useDeleteCommentMutation();

    // State management
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [comment, setComment] = useState("");
    const { user } = useSelector(store => store.auth);
    const userId = user._id;
    // Fetch related articles and handle comments
    const [relatedArticles, setRelatedArticles] = useState([]);
    const [comments, setComments] = useState([]);


    const [readingHistory, { }] = useReadingHistoryMutation();
    useEffect(() => {
        if (courseId) {
            readingHistory({ userId, articleId: courseId })
        }
    }, [courseId]);



    useEffect(() => {
        if (data?.article?.isBookmarked) {
            setIsBookmarked(true);
        } else {
            setIsBookmarked(false);
        }

        if (relatedArticlesData?.similarArticles) {
            setRelatedArticles(relatedArticlesData.similarArticles);
        }

        if (commentsData?.comments) {
            setComments(commentsData.comments);
        }
    }, [data, relatedArticlesData, commentsData]);

    // Error and loading handling
    if (isLoading) return <h1>Loading...</h1>;
    if (isError) return <h1>Failed to load course details</h1>;
    if (commentsError) return <h1>Failed to load comments</h1>;

    const { article } = data;

    // Summarize Description Handler
    const summarizeDescriptionHandler = async () => {
        await summarizeDescription(courseId);
    };

    // Handle Bookmark functionality
    const handleAddBookmark = async () => {
        try {
            await addBookmark(courseId);
            setIsBookmarked(true);
        } catch (error) {
            console.error("Error adding bookmark:", error);
        }
    };

    const handleRemoveBookmark = async () => {
        try {
            await removeBookmark(courseId);
            setIsBookmarked(false);
        } catch (error) {
            console.error("Error removing bookmark:", error);
        }
    };

    // Handle Comment Submission
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (comment.trim()) {
            try {
                const response = await createComment({ content: comment, courseId });
                setComments([...comments, response.data.comment]);
                setComment("");
            } catch (error) {
                console.error("Error adding comment:", error);
            }
        }
    };

    // Handle Comment Deletion
    const handleCommentDelete = async (commentId) => {
        try {
            await deleteComment(commentId);
            setComments(comments.filter((comment) => comment._id !== commentId));
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    return (
        <div className="space-y-5 mt-20">
            <div className="space-y-5 mt-20">
                <div className="bg-[#2D2F31] text-white">
                    <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
                        <h1 className="font-bold text-2xl md:text-3xl">{article?.articleTitle}</h1>
                        <p className="text-base md:text-lg">{article?.subTitle}</p>
                        <p>
                            <div className="flex items-center space-x-2">
                                Created By{" "}
                                <img
                                    src={article?.creator?.photoUrl}
                                    className="ml-3 w-8 h-8 rounded-full"
                                    alt="Profile"
                                />
                                <span className="text-[#C0C4FC] underline italic">{article?.creator.name}</span>
                            </div>
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                            <BadgeInfo size={16} />
                            <p>Last updated {article?.createdAt.split("T")[0]}</p>
                        </div>
                        <p>Reading Time: {article?.readingTime} Minutes Approximately</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
                    <div className="w-full lg:w-1/2 space-y-5">
                        <h1 className="font-bold text-xl md:text-2xl">Description</h1>
                        <p className="text-sm" dangerouslySetInnerHTML={{ __html: article?.description }} />
                    </div>

                    <div className="w-full lg:w-1/3">
                        <Card>
                            <CardContent className="p-4 flex flex-col">
                                {/* Article Category */}
                                <div className="mb-2">
                                    <span className="text-sm font-semibold text-gray-700">Category: </span>
                                    <span className="text-sm text-gray-500">{article?.category.name}</span>
                                </div>

                                {/* Article Tags */}
                                <div className="flex flex-wrap gap-2">
                                    {article?.tags?.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="text-xs text-white bg-blue-500 rounded-full px-3 py-1"
                                        >
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Button
                            className="w-full mt-6 bg-red-600 text-white"
                            onClick={isBookmarked ? handleRemoveBookmark : handleAddBookmark}
                            disabled={addLoading || removeLoading}
                        >
                            <Heart />
                            {isBookmarked ? "Remove from Bookmark" : "Add to Bookmark"}
                        </Button>
                        <Button
                            className="w-full mt-6"
                            disabled={summarizedLoading}
                            onClick={summarizeDescriptionHandler}
                        >
                            Summarize Detail
                        </Button>

                        <Card className="mt-4">
                            <CardContent className="p-4 mt-4">
                                {summarizedLoading ? (
                                    <p>Loading summary...</p>
                                ) : summarizedData?.summarizedText ? (
                                    <p>{summarizedData.summarizedText}</p>
                                ) : (
                                    <p>No summary available.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Comment Section */}
                    <div className="max-w-7xl mx-auto px-4 md:px-8 mt-3">
                        <h2 className="font-bold text-2xl">Comments</h2>
                        <form onSubmit={handleCommentSubmit} className="mt-4">
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="w-full p-3 border border-gray-300 rounded-md text-gray-900"
                                rows="1"
                            />
                            <Button
                                type="submit"
                                className="mt-2 w-full bg-blue-600 text-white"
                                disabled={createCommentLoading}
                            >
                                Add Comment
                            </Button>
                        </form>

                        {/* Display Comments */}
                        {commentsLoading ? (
                            <p>Loading comments...</p>
                        ) : commentsData?.comments?.length > 0 ? (
                            <div className="mt-4 space-y-4">
                                {commentsData.comments.map((comment) => (
                                    <div key={comment._id} className="border-b pb-4">
                                        <div className="flex items-start gap-4">
                                            <Avatar className="h-12 w-12 rounded-full">
                                                <AvatarImage src={comment.creator.photoUrl || "https://github.com/shadcn.png"} alt="author" />
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <span className="font-semibold text-gray-800">{comment.creator.name}</span>
                                                <p className="text-white">{comment.content}</p>
                                            </div>
                                            {user.role == "instructor" && (
                                                <Trash onClick={() => handleCommentDelete(comment._id)}> </Trash>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-4">No comments yet.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Related Articles Section */}
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <h2 className="font-bold text-2xl">Related Articles</h2>
                {relatedLoading ? (
                    <p>Loading related articles...</p>
                ) : relatedArticles.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                        {relatedArticles.map((article) => (
                            <Card key={article._id} className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
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
                                            <Avatar className="h-8 w-8  ">
                                                <AvatarImage src={article.creator.photoUrl} alt="author" />
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                            <span>{article.creator.name}</span>
                                        </div>
                                        <Button>Read Article</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p>No related articles found.</p>
                )}
            </div>
        </div >
    );
};

export default ArticleDetail;
