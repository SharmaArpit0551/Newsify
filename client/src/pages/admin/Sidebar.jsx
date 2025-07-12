import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row mt-16">
      {/* Mobile Menu Button */}
      <div className="lg:hidden p-4">
        <button
          className="flex items-center gap-2 p-2 bg-gray-200 dark:bg-gray-800 rounded-md"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <SquareLibrary size={22} />
          <span>Menu</span>
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${isMobileMenuOpen ? "block" : "hidden"
          } lg:block w-full lg:w-[250px] sm:w-[300px] space-y-8 border-r border-gray-300 dark:border-gray-700 p-5 fixed lg:sticky top-0 h-screen bg-white dark:bg-gray-900 z-50 lg:z-auto`}
      >
        <div className="space-y-4">
          <Link
            to="dashboard"
            className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <ChartNoAxesColumn size={22} />
            <h1>Dashboard</h1>
          </Link>
          <Link
            to="category"
            className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <SquareLibrary size={22} />
            <h1>Categories</h1>
          </Link>
          <Link
            to="tag"
            className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <SquareLibrary size={22} />
            <h1>Tags</h1>
          </Link>
          <Link
            to="course"
            className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <SquareLibrary size={22} />
            <h1>Articles</h1>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-10">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
