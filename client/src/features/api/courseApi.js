import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = "https://newsify-myh1.onrender.com/api/course";
export const courseApi = createApi({
  reducerPath: "courseApi",
  tagTypes: ["Refetch_Creator_Course", "Refetch_Lecture"],
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_API,
    credentials: "include",
  }),

  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (formData) => ({
        url: "",
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),

    getAllPublishedCourses: builder.query({
      query: () => ({
        url: "/published-courses",
        method: "GET",
      }),
    }),
    getCreatorCourse: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),
      providesTags: ["Refetch_Creator_Course"],
    }),

    updateCourse: builder.mutation({
      query: ({ formData, courseId }) => ({
        url: `/${courseId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),

    getCourseById: builder.query({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "GET",
      }),
      providesTags: ["Refetch_Creator_Course"],
    }),

    publishCourse: builder.mutation({
      query: ({ courseId, query }) => ({
        url: `/${courseId}?publish=${query}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),

    summarizeDescription: builder.mutation({
      query: (courseId) => ({
        url: `${courseId}/summarize`,
        method: "POST",
        body: { courseId },
      }),
    }),

    deleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `${courseId}`,
        method: "DELETE",
        body: { courseId },
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),
    
    getArticleByCategory: builder.query({
      query: (courseId) => `related/${courseId}`,
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetAllPublishedCoursesQuery,
  useGetCreatorCourseQuery,
  useUpdateCourseMutation,
  useGetCourseByIdQuery,
  usePublishCourseMutation,
  useSummarizeDescriptionMutation,
  useDeleteCourseMutation,
  useGetArticleByCategoryQuery,
} = courseApi;
