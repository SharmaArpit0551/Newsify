import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useGetCreatorCourseQuery } from "@/features/api/courseApi";
import { Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Papa from "papaparse";

const CourseTable = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetCreatorCourseQuery();

  const handleExportCSV = () => {
    if (!data?.courses || data.courses.length === 0) return;

    const coursesForExport = data.courses.map((course) => ({
      Title: course.articleTitle,
      Status: course.isPublished ? "Published" : "Draft",
      "Reading Time": course.readingTime ? `${course.readingTime} Min` : "NA",
    }));


    const csv = Papa.unparse(coursesForExport);


    const link = document.createElement("a");
    link.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    link.target = "_blank";
    link.download = "courses.csv";
    link.click();
  };

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div>

      <Button onClick={handleExportCSV} className="mb-5 mr-2">
        Export to CSV
      </Button>


      <Button onClick={() => navigate("/admin/course/create")}>Create a New Article</Button>

      {/* Table */}
      <Table className="mt-5">
        <TableCaption>A list of your recent Articles.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reading Time</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.courses.map((course) => (
            <TableRow key={course._id}>
              <TableCell>{course.articleTitle}</TableCell>
              <TableCell>
                <Badge>{course?.isPublished ? "Published" : "Draft"}</Badge>
              </TableCell>
              <TableCell>{course?.readingTime + " Min" || "NA"}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(`${course._id}`)}
                >
                  <Edit />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CourseTable;
