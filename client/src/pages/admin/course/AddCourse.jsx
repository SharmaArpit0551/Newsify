import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useCreateCourseMutation } from '@/features/api/courseApi';
import { useGetAllCategoriesQuery } from '@/features/api/categoryApi';
import { useGetAllTagsQuery } from '@/features/api/tagApi';
import { toast } from 'sonner';
import RichTextEditor from '@/components/RichTextEditor';

const AddCourse = () => {
    // const [articleTitle, setArticleTitle] = useState('');
    // const [subTitle, setSubTitle] = useState('');
    // const [description, setDescription] = useState('');
    // const [category, setCategory] = useState('');
    // const [tags, setTags] = useState('');
    // const [readingTime, setReadingTime] = useState('');
    // const [publishedAt, setPublishedAt] = useState('');

    const [input, setInput] = useState({
        articleTitle: "",
        subTitle: "",
        description: "",
        category: "",
        tags: "",
        isPublished: false,
        publishedAt: "",
        readingTime: "",
        courseThumbnail: "",
    });

    const [previewThumbnail, setPreviewThumbnail] = useState("");

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };

    const handleSelectChange = (name, value) => {
        setInput((prev) => ({ ...prev, [name]: value }));
    };



    const navigate = useNavigate();
    const { data: categoriesData, isLoading: categoriesLoading } = useGetAllCategoriesQuery();
    const { data: tagsData, isLoading: tagsLoading } = useGetAllTagsQuery();
    const [createCourse, { data, isLoading, error, isSuccess }] = useCreateCourseMutation();

    const createCourseHandler = async () => {
        const formData = new FormData();
        formData.append("articleTitle", input.articleTitle);
        formData.append("subTitle", input.subTitle);
        formData.append("courseThumbnail", input.courseThumbnail);
        formData.append("description", input.description);
        formData.append("category", input.category);
        formData.append("tags", input.tags);
        formData.append("isPublished", input.isPublished);
        formData.append(
            "publishedAt",
            input.isPublished ? new Date().toISOString() : input.publishedAt
        );
        formData.append("readingTime", input.readingTime);

        // Log formData for debugging
        console.log("FormData entries:");
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        await createCourse(formData);
    };


    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Article Created Successfully");
            navigate("/admin/course");
        } else if (error) {
            toast.error(error?.data?.message || "Article creation failed");
        }
    }, [isSuccess, error, data, navigate]);

    return (
        <div className="flex-1 mx-10">
            <div className="mb-4">
                <h1 className="font-bold text-xl">Add a New Article</h1>
                <p className="text-sm">Provide the required details to create a new article.</p>
            </div>
            <div className="space-y-4">
                <div>
                    <Label>Title</Label>
                    <Input
                        type="text"
                        name="articleTitle"
                        value={input.articleTitle}
                        onChange={changeEventHandler}
                        placeholder="Article Title"
                    />
                </div>
                <div>
                    <Label>Subtitle</Label>
                    <Input
                        type="text"
                        name="subTitle"
                        value={input.subTitle}
                        onChange={changeEventHandler}
                        placeholder="Article Subtitle"
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
                <div>
                    <Label>Description</Label>
                    <RichTextEditor
                        value={input.description}
                        onChange={(value) => setInput((prev) => ({ ...prev, description: value }))}
                    />
                </div>
                <div>
                    <Label>Category</Label>
                    <Select value={input.category} onValueChange={(value) => handleSelectChange("category", value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Category</SelectLabel>
                                {categoriesLoading ? (
                                    <SelectItem value="loading">Loading...</SelectItem>
                                ) : (
                                    categoriesData?.categories?.map((cat) => (
                                        <SelectItem key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Tags</Label>
                    <Select
                        multiple
                        value={input.tags}
                        onValueChange={(value) => handleSelectChange("tags", value)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select tags" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Tags</SelectLabel>
                                {tagsLoading ? (
                                    <SelectItem value="loading">Loading...</SelectItem>
                                ) : (
                                    tagsData?.tags?.map((tag) => (
                                        <SelectItem key={tag._id} value={tag._id}>
                                            {tag.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Reading Time (in minutes)</Label>
                    <Input
                        type="number"
                        name="readingTime"
                        value={input.readingTime}
                        onChange={changeEventHandler}
                        placeholder="Estimated Reading Time"
                    />
                </div>
                <div>
                    <Label>Published At</Label>
                    <Input
                        type="date"
                        name="publishedAt"
                        value={input.publishedAt}
                        onChange={changeEventHandler}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => navigate("/admin/course")}>Back</Button>
                    <Button disabled={isLoading} onClick={createCourseHandler}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please Wait
                            </>
                        ) : (
                            "Create"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddCourse;
