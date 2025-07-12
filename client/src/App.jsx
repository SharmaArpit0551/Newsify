import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Login from './pages/login.jsx'
import MainLayout from './layout/MainLayout.jsx'
import Herosection from './pages/student/Herosection.jsx'
import Courses from './pages/student/Courses.jsx'
import Profile from './pages/student/Profile.jsx'
import Sidebar from './pages/admin/Sidebar.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import CourseTable from './pages/admin/course/CourseTable.jsx'
import AddCourse from './pages/admin/course/AddCourse.jsx'
import EditCourse from './pages/admin/course/EditCourse.jsx'
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoutes'
import { ThemeProvider } from './components/ThemeProvider'
import ForgotPassword from './pages/ForgotPassword'
import CategoryTable from './pages/admin/category/CategoryTable.jsx'
import TagTable from './pages/admin/tag/TagTable.jsx'
import AddCategory from './pages/admin/category/AddCategory'
import EditCategory from './pages/admin/category/EditCategory'
import AddTag from './pages/admin/tag/AddTag'
import EditTag from './pages/admin/tag/EditTag'
import ArticleDetail from './pages/student/ArticleDetail'
import MyBookmarks from './pages/student/MyBookmarks.jsx'
import CategoriesTagsCard from './pages/student/Categories'
import ReadingHistory from './pages/student/ReadingHistory'
import Category from './pages/student/Category'
import Tag from './pages/student/Tag'


const appRouter = createBrowserRouter([{
  path: "/",
  element: <MainLayout />,
  children: [
    {
      path: "/",
      element:
        <>
          <Herosection />
          <Courses />
          <CategoriesTagsCard />
        </>
    },
    {
      path: "login",
      element: <Login />
    },
    {
      path: "login/forgotpassword",
      element: <ForgotPassword />
    },
    {
      path: "mybookmarks",
      element: (
        <ProtectedRoute>
          <MyBookmarks />
        </ProtectedRoute>
      )
    },
    {
      path: "myreadinghistory",
      element: (
        <ProtectedRoute>
          <ReadingHistory />
        </ProtectedRoute>
      )
    },
    {
      path: "profile",
      element: (
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      )
    },


    {
      path: "article-detail/:courseId",
      element: (
        <ProtectedRoute>
          <ArticleDetail />
        </ProtectedRoute>
      )
    },
    {
      path: "category-detail/:categoryId",
      element: (
        <ProtectedRoute>
          <Category />
        </ProtectedRoute>
      )
    },
    {
      path: "tag-detail/:tagId",
      element: (
        <ProtectedRoute>
          <Tag />
        </ProtectedRoute>
      )
    },


    {
      path: "admin",
      element: (
        <AdminRoute>
          <Sidebar />
        </AdminRoute>

      ),
      children: [
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "category",
          element: <CategoryTable />,
        },
        {
          path: "category/create",
          element: <AddCategory />,
        },
        {
          path: "category/:categoryId",
          element: <EditCategory />,
        },
        {
          path: "tag",
          element: <TagTable />,
        },
        {
          path: "tag/create",
          element: <AddTag />,
        },
        {
          path: "tag/:tagId",
          element: <EditTag />,
        },
        {
          path: "course",
          element: <CourseTable />,
        },
        {
          path: "course/create",
          element: <AddCourse />
        },
        {
          path: "course/:courseId",
          element: <EditCourse />
        },


      ]
    }

  ]
}])

function App() {

  return (

    <main>
      <ThemeProvider>
        <RouterProvider router={appRouter} />
      </ThemeProvider>
    </main>
  )
}

export default App
