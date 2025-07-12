import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { useGetAllCategoriesQuery } from "@/features/api/categoryApi";
import { useGetAllTagsQuery } from "@/features/api/tagApi";
import { useGetAllPublishedCoursesQuery } from "@/features/api/courseApi"; // Import the new hook

const Dashboard = () => {
    // Fetch categories, tags, and courses data using RTK Query hooks
    const { data: categoriesData, isLoading: categoriesLoading } = useGetAllCategoriesQuery();
    const { data: tagsData, isLoading: tagsLoading } = useGetAllTagsQuery();
    const { data: coursesData, isLoading: coursesLoading } = useGetAllPublishedCoursesQuery(); // Fetch courses

    // Sample total values (you can replace these with the actual data if necessary)
    const totalUsers = 1200;

    return (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

            {/* Total Users Card */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-1">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-700">
                        Total Users
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-center">{totalUsers}</p>
                </CardContent>
            </Card>

            {/* Total Categories Card */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-1">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-700">
                        Total Categories
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {categoriesLoading ? (
                        <p className="text-center">Loading categories...</p>
                    ) : (
                        <p className="text-3xl font-bold text-center">{categoriesData?.categories?.length}</p>
                    )}
                </CardContent>
            </Card>

            {/* Total Tags Card */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-1">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-700">
                        Total Tags
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {tagsLoading ? (
                        <p className="text-center">Loading tags...</p>
                    ) : (
                        <p className="text-3xl font-bold text-center">{tagsData?.tags?.length}</p>
                    )}
                </CardContent>
            </Card>

            {/* Total Published Courses Card */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-1">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-700">
                        Total Published Courses
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {coursesLoading ? (
                        <p className="text-center">Loading courses...</p>
                    ) : (
                        <p className="text-3xl font-bold text-center">{coursesData?.courses?.length}</p>
                    )}
                </CardContent>
            </Card>

        </div>
    );
};

export default Dashboard;
