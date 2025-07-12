import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCreateCategoryMutation } from "../../../features/api/categoryApi.js";
import { toast } from "sonner";

const AddCategory = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [createCategory, { data, isLoading, error, isSuccess }] =
        useCreateCategoryMutation();

    const navigate = useNavigate();

    const createCategoryHandler = async () => {
        await createCategory({ name: title, description });
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Category Created Successfully");
            navigate("/admin/category");
        } else if (error) {
            toast.error(error?.data?.message || "Failed to create category");
        }
    }, [isSuccess, error]);

    return (
        <div className="flex-1 mx-10">
            <div className="mb-4">
                <h1 className="font-bold text-xl">
                    Add a New Category
                </h1>
                <p className="text-sm">
                    Provide a title and description for the category you want to add to organize your Article effectively.
                </p>
            </div>
            <div className="space-y-4">
                {/* Title Input */}
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter category title"
                    />
                </div>

                {/* Description Input */}
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter category description"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => navigate("/admin/category")}>
                        Back
                    </Button>
                    <Button disabled={isLoading} onClick={createCategoryHandler}>
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

export default AddCategory;
