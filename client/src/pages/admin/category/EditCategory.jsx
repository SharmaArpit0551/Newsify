import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useGetCategoryByIdQuery, useUpdateCategoryMutation, useDeleteCategoryMutation } from "../../../features/api/categoryApi.js";
import { toast } from "sonner";


const EditCategory = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();

    // Fetch category data
    const { data, error, isLoading } = useGetCategoryByIdQuery(categoryId);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [updateCategory] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();

    useEffect(() => {
        if (data) {
            setTitle(data.category.name);
            setDescription(data.category?.description);
        }
    }, [data]);

    // Function to handle submitting the form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateCategory({ categoryId, categoryData: { title, description } });
            toast.success("Category updated successfully!");
            navigate("/admin/category");
        } catch (error) {
            toast.error("Failed to update category.");
        }
    };

    // Function to handle deleting the category
    const handleDelete = async () => {
        try {
            await deleteCategory(categoryId);
            toast.success("Category deleted successfully!");
            navigate("/admin/category");
        } catch (error) {
            toast.error("Failed to delete category.");
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error fetching category data</div>;
    }

    return (
        <div className="flex-1 bg-dark-800 text-white">
            <div className="flex items-center justify-between mb-5">
                <h1 className="font-bold text-xl">
                    <Link to={`/admin/category`}>
                        <Button
                            size="icon"
                            variant="outline"
                            className="rounded-full mr-2 border-gray-600 text-white hover:bg-gray-700"
                        >
                            <ArrowLeft size={16} />
                        </Button>
                    </Link>
                    Edit Category Information
                </h1>
                <Link to={`/admin/category`}>
                    <Button
                        className="hover:text-blue-400 text-blue-300"
                        variant="link"
                    >
                        Back to Categories
                    </Button>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="title" className="block font-semibold">
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border border-gray-600 rounded-md dark:bg-dark-700 light:bg-white dark:text-gray-600 light:text-gray-600"
                        placeholder="Enter category title"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="block font-semibold">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border border-gray-600 rounded-md dark:bg-dark-700 light:bg-white dark:text-gray-600 light:text-gray-600"
                        placeholder="Enter category description"
                        required
                    />
                </div>

                <div className="flex justify-between">
                    <Button
                        type="submit"
                        className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Save Changes
                    </Button>
                    <Button
                        type="button"
                        className="bg-red-600 text-white hover:bg-red-700"
                        onClick={handleDelete}
                    >
                        Delete Category
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EditCategory;
