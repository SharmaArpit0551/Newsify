import React from 'react';
import { useGetAllCategoriesQuery } from '@/features/api/categoryApi.js';
import { useGetAllTagsQuery } from '@/features/api/tagApi';
import { Link } from 'react-router-dom';

const CategoriesTagsCard = () => {
    const { data: categoriesData, isLoading: categoriesLoading } = useGetAllCategoriesQuery();
    const { data: tagsData, isLoading: tagsLoading } = useGetAllTagsQuery();

    return (
        <div className="bg-gray-50 dark:bg-[#141414] py-6">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="font-bold text-3xl text-center mb-6">Categories & Tags</h2>

                {/* Categories & Tags Section */}
                <div className="bg-white dark:bg-[#2c2c2c] shadow-lg rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Categories Section */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-center">Categories</h3>
                            {categoriesLoading ? (
                                <p>Loading categories...</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

                                    {categoriesData?.categories?.map((category) => (
                                        <Link to={`category-detail/${category._id}`}>
                                            <div
                                                key={category._id}
                                                className="bg-gray-100 dark:bg-[#3c3c3c] rounded-lg p-4 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-[#4d4d4d] transition-all"
                                            >
                                                <p className="text-center">{category.name}</p>
                                            </div>
                                        </Link>
                                    ))}

                                </div>
                            )}
                        </div>

                        {/* Tags Section */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-center">Tags</h3>
                            {tagsLoading ? (
                                <p>Loading tags...</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {tagsData?.tags?.map((tag) => (
                                        <Link to={`tag-detail/${tag._id}`}>
                                            <div
                                                key={tag._id}
                                                className="bg-gray-100 dark:bg-[#3c3c3c] rounded-lg p-4 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-[#4d4d4d] transition-all"
                                            >
                                                <p className="text-center">{tag.name}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default CategoriesTagsCard;
