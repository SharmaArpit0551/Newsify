import React from "react";
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
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useGetAllCategoriesQuery } from "@/features/api/categoryApi";
import { Edit } from "lucide-react";
import Papa from "papaparse"; // For CSV export

const CategoryTable = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetAllCategoriesQuery();
  console.log(data);

  if (isLoading) return <h1>Loading...</h1>;

  // Handle CSV export
  const handleExportCSV = () => {
    if (!data?.categories || data.categories.length === 0) return;

    // Prepare the data for CSV export
    const categoriesForExport = data.categories.map((category, index) => ({
      SrNo: index + 1,
      Title: category.name,
    }));

    // Convert the data to CSV
    const csv = Papa.unparse(categoriesForExport);

    // Create a downloadable link for the CSV file
    const link = document.createElement("a");
    link.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    link.target = "_blank";
    link.download = "categories.csv";
    link.click();
  };

  return (
    <div>
      {/* Export button */}
      <div className="mb-5">
        <Button onClick={handleExportCSV}>Export to CSV</Button>
      </div>

      {/* Create a New Category Button */}
      <Button onClick={() => navigate("/admin/category/create")}>
        Create a New Category
      </Button>

      {/* Table */}
      <Table className="mt-5">
        <TableCaption>A list of your categories.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Sr.No</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.categories?.map((category, index) => (
            <TableRow key={category._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(`/admin/category/${category._id}`)}
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

export default CategoryTable;
