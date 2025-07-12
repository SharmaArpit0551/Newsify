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
} from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useGetAllTagsQuery } from "../../../features/api/tagApi";
import { Edit } from "lucide-react";
import Papa from "papaparse"; // For CSV export

const TagTable = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetAllTagsQuery();

  if (isLoading) return <h1>Loading...</h1>;

  // Handle CSV export
  const handleExportCSV = () => {
    if (!data?.tags || data.tags.length === 0) return;

    // Prepare the data for CSV export
    const tagsForExport = data.tags.map((tag, index) => ({
      SrNo: index + 1,
      Title: tag.name,
    }));

    // Convert the data to CSV
    const csv = Papa.unparse(tagsForExport);

    // Create a downloadable link for the CSV file
    const link = document.createElement("a");
    link.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    link.target = "_blank";
    link.download = "tags.csv";
    link.click();
  };

  return (
    <div>

      <div className="mb-5">
        <Button onClick={handleExportCSV}>Export to CSV</Button>
      </div>

      <Button onClick={() => navigate("/admin/tag/create")}>Create a New Tag</Button>
      <Table className="mt-5">
        <TableCaption>A list of your tags.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Sr.No</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.tags?.map((tag, index) => (
            <TableRow key={tag._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{tag.name}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(`/admin/tag/${tag._id}`)}
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

export default TagTable;
