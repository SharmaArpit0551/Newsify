import React, { useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import Course from './Course.jsx';
import { useGetAllPublishedCoursesQuery } from '@/features/api/courseApi.js';
import { useGetAllCategoriesQuery } from '@/features/api/categoryApi.js';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Courses = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // Track current page
    const itemsPerPage = 8; // Number of courses per page

    const { data: coursesData, isLoading: coursesLoading } = useGetAllPublishedCoursesQuery();
    const { data: categoriesData, isLoading: categoriesLoading } = useGetAllCategoriesQuery();

    const filterCourses = (courses) => {
        let filtered = courses;

        if (selectedCategory) {
            filtered = filtered.filter(course => course.category._id === selectedCategory);
        }

        if (startDate && endDate) {
            filtered = filtered.filter(course => {
                const courseDate = new Date(course.publishedAt);
                return courseDate >= startDate && courseDate <= endDate;
            });
        }

        if (searchQuery) {
            filtered = filtered.filter(course =>
                course.articleTitle.toLowerCase().includes(searchQuery.toLowerCase()) || // Search by title
                (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase())) // Search by description
            );
        }

        return filtered;
    };

   
    // Filtered courses
    const filteredCourses = filterCourses(coursesData?.courses || []);

    // Calculate pagination
    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentCourses = filteredCourses.slice(startIndex, startIndex + itemsPerPage);

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className='bg-gray-50 dark:bg-[#141414]'>
            <div className='max-w-7xl mx-auto p-6'>
                <h2 className='font-bold text-3xl text-center mb-10'>Latest Articles</h2>

                {/* Search Bar */}
                <div className="mb-4">
                    <label htmlFor="search" className="font-semibold">Search Courses:</label>
                    <input
                        type="text"
                        id="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by course title or description"
                        className="mt-2 p-2 border border-gray-300 rounded-md text-gray-900 w-full sm:w-30"
                    />
                </div>

                {/* Filters */}
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                    {/* Category Filter Dropdown */}
                    <div className="mb-2 sm:mb-0">
                        <label htmlFor="category" className="font-semibold">Filter by Category:</label>
                        <select
                            id="category"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="mt-2 ml-2 p-2 border border-gray-300 rounded-md text-gray-900"
                        >
                            <option value="">All Categories</option>
                            {categoriesLoading ? (
                                <option>Loading categories...</option>
                            ) : (
                                categoriesData?.categories?.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    {/* Date Range Filters */}
                    <div className="flex space-x-4 mt-2 sm:mt-0">
                        <div>
                            <label htmlFor="date" className="font-semibold text-center mt-4">Filter by Date:</label>
                            <div className="flex space-x-2">
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    placeholderText="Start Date"
                                    className="mt-2 p-1 border border-gray-300 rounded-md text-gray-900 w-32 sm:w-40" // Adjusted width
                                    dateFormat="MM/dd/yyyy"
                                />
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    placeholderText="End Date"
                                    className="mt-2 p-1 border border-gray-300 rounded-md text-gray-900 w-32 sm:w-40" // Adjusted width
                                    dateFormat="MM/dd/yyyy"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Courses List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {coursesLoading ? (
                        Array.from({ length: 8 }).map((_, index) => (
                            <CourseSkeleton key={index} />
                        ))
                    ) : currentCourses.length > 0 ? (
                        currentCourses.map((course) => <Course key={course._id} course={course} />)
                    ) : (
                        <p>No Articles available for the selected filters.</p>
                    )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-6 space-x-4">
                        <button
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            className="p-2 bg-gray-200 rounded-md"
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                className={`p-2 rounded-md ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            className="p-2 bg-gray-200 rounded-md"
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Courses;

const CourseSkeleton = () => {
    return (
        <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
            <Skeleton className="w-full h-36" />
            <div className="px-5 py-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-1/4" />
            </div>
        </div>
    );
};