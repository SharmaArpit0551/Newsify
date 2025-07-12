import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const CATEGORY_API = "https://newsify-myh1.onrender.com/api/category";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  tagTypes: ["Refetch_Category"],
  baseQuery: fetchBaseQuery({
    baseUrl: CATEGORY_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    // Create a new category
    createCategory: builder.mutation({
      query: (categoryData) => ({
        url: "/create-category",
        method: "POST",
        body: categoryData,
      }),
      invalidatesTags: ["Refetch_Category"],
    }),

    // Get all categories
    getAllCategories: builder.query({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
      providesTags: ["Refetch_Category"],
    }),

    // Get a single category by ID
    getCategoryById: builder.query({
      query: (categoryId) => ({
        url: `/categories/${categoryId}`,
        method: "GET",
      }),
      providesTags: ["Refetch_Category"],
    }),

    // Update a category
    updateCategory: builder.mutation({
      query: ({ categoryId, categoryData }) => ({
        url: `/categories/${categoryId}`,
        method: "PUT",
        body: categoryData,
      }),
      invalidatesTags: ["Refetch_Category"],
    }),

    // Delete a category
    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `/categories/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Refetch_Category"],
    }),
    articlesByCategory: builder.query({
      query: (categoryId) => ({
        url: `/category-detail/${categoryId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useArticlesByCategoryQuery,
} = categoryApi;
