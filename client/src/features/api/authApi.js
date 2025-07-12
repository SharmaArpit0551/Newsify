import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";

const USER_API = "https://newsify-myh1.onrender.com/api/user";
export const authApi = createApi({
  reducerPath: "authApi",
  tagTypes: ["Refetch_Bookmarks", "Refetch_History"],
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (inputData) => ({
        url: "register",
        method: "POST",
        body: inputData,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (inputData) => ({
        url: "forgotpassword",
        method: "POST",
        body: inputData,
      }),
    }),
    loginUser: builder.mutation({
      query: (inputData) => ({
        url: "login",
        method: "POST",
        body: inputData,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "logout",
        method: "GET",
      }),
      async onQueryStarted(_, { dispatch }) {
        try {
          dispatch(userLoggedOut({ user: null }));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    loadUser: builder.query({
      query: () => ({
        url: "profile",
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    updateUser: builder.mutation({
      query: (formData) => ({
        url: "profile/update",
        method: "PUT",
        body: formData,
      }),
    }),
    addBookmark: builder.mutation({
      query: (courseId) => ({
        url: `bookmark/${courseId}`,
        method: "POST",
        body: courseId,
      }),
      invalidatesTags: ["Refetch_Bookmark"],
    }),
    removeBookmark: builder.mutation({
      query: (courseId) => ({
        url: `bookmark/${courseId}`,
        method: "DELETE",
        body: courseId,
      }),
      invalidatesTags: ["Refetch_Bookmark"],
    }),
    getBookmarks: builder.query({
      query: () => "/bookmarks",
    }),
    readingHistory: builder.mutation({
      query: ({ userId, articleId }) => ({
        url: "history/read",
        method: "POST",
        body: { userId, articleId },
      }),
      invalidatesTags: ["Refetch_History"],
    }),
    getUserReadingHistory: builder.query({
      query: () => ({
        url: "reading-history",
        method: "GET",
      }),
      providesTags: ["Refetch_History"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useForgotPasswordMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useLoadUserQuery,
  useUpdateUserMutation,
  useAddBookmarkMutation,
  useRemoveBookmarkMutation,
  useGetBookmarksQuery,
  useReadingHistoryMutation,
  useGetUserReadingHistoryQuery,
} = authApi;
