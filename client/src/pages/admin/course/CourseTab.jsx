import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import {
    useGetCourseByIdQuery,
    usePublishCourseMutation,
    useUpdateCourseMutation,
    useDeleteCourseMutation,
} from '@/features/api/courseApi';
import { toast } from 'sonner';
import { Label } from 'recharts';

const CourseTab = () => {
    const params = useParams();
    const courseId = params.courseId;

    const navigate = useNavigate();
    const [publishCourse] = usePublishCourseMutation();
    const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();
    const [updateCourse, { data, isLoading, isSuccess, error }] = useUpdateCourseMutation();
    const { data: courseByIdData, isLoading: courseByIdLoading } = useGetCourseByIdQuery(courseId);

    const [input, setInput] = useState({
        articleTitle: "",
        subTitle: "",
        description: "",
        isPublished: false,
        publishedAt: "",
        readingTime: "",
        courseThumbnail: "",
    });

    const [previewThumbnail, setPreviewThumbnail] = useState("");

    const publishCourseHandler = async (e) => {
        try {
            const response = await publishCourse({ courseId, query: e });
            if (response.data) {
                toast.success(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to Change the Status of Article");
        }
    };

    const deleteCourseHandler = async () => {
        try {
            const response = await deleteCourse(courseId);
            if (response?.data) {
                toast.success("Article deleted successfully.");
                navigate("/admin/course");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete the article.");
        }
    };

    useEffect(() => {
        if (courseByIdData?.article) {
            const course = courseByIdData.article;

            setInput({
                articleTitle: course.articleTitle,
                subTitle: course.subTitle,
                isPublished: course.isPublished,
                publishedAt: course.publishedAt || "",
                readingTime: course.readingTime || "",
                courseThumbnail: course.articleThumbnail || "",
            });
            setPreviewThumbnail(course.articleThumbnail);
            toast.success("Article Details Fetched");
        }
    }, [courseByIdData]);

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };

    return (
        <Card className="w-full max-w-3xl mx-auto p-4 md:p-6">
            <CardHeader className="flex flex-col md:flex-row md:justify-between gap-4">
                <div>
                    <CardTitle>Basic Article Information</CardTitle>
                    <CardDescription>
                        Make changes to your Article here. Click save when you're done.
                    </CardDescription>
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                    <Button
                        variant="outline"
                        onClick={() => publishCourseHandler(input.isPublished ? "false" : "true")}
                    >
                        {input.isPublished ? "Unpublish" : "Publish"}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={deleteCourseHandler}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <Loader2 className="animate-spin h-4 w-4" />
                        ) : (
                            "Delete Article"
                        )}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-6 mt-5">
                    <div>
                        <Label>Title</Label>
                        <Input
                            type="text"
                            name="articleTitle"
                            value={input.articleTitle}
                            onChange={changeEventHandler}
                            placeholder="Ex. Fullstack Developer"
                        />
                    </div>
                    <div>
                        <Label>Subtitle</Label>
                        <Input
                            type="text"
                            name="subTitle"
                            value={input.subTitle}
                            onChange={changeEventHandler}
                            placeholder="Ex. Become a Fullstack developer from zero to hero in 2 months"
                        />
                    </div>
                    <div>
                        <Label>Course Thumbnail</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            className="w-full md:w-auto"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setInput({ ...input, courseThumbnail: file });
                                    const fileReader = new FileReader();
                                    fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
                                    fileReader.readAsDataURL(file);
                                }
                            }}
                        />
                        {previewThumbnail && (
                            <img
                                src={previewThumbnail}
                                className="w-full md:w-64 my-2"
                                alt="courseThumbnail"
                            />
                        )}
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <Button onClick={() => navigate("/admin/course")} variant="outline">
                            Cancel
                        </Button>
                        <Button
                            disabled={isLoading}
                            onClick={async () => {
                                const formData = new FormData();
                                formData.append("articleTitle", input.articleTitle);
                                formData.append("subTitle", input.subTitle);
                                formData.append("description", input.description);
                                formData.append("isPublished", input.isPublished);
                                formData.append(
                                    "publishedAt",
                                    input.isPublished ? new Date() : input.publishedAt
                                );
                                formData.append("readingTime", input.readingTime);
                                formData.append("courseThumbnail", input.courseThumbnail);
                                await updateCourse({ formData, courseId });
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                    Please Wait
                                </>
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CourseTab;
