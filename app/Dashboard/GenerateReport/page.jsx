'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Paper,
  Box,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Download } from "@mui/icons-material";

const GenerateReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("");
  const [reportData, setReportData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        console.log("Getting User ID");
        console.log(localStorage.getItem("jwtToken"));
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`
          },
          body: JSON.stringify({ action: "getId" })
        });

        const data = await response.json();
        if (response.ok) {
          setUserId(data.userId);
        } else {
          console.log("User not authenticated", data.error);
        }
      } catch (error) {
        console.error("API error:", error);
        alert("Error fetching user data.");
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchCategories = async () => {
        try {
          const response = await fetch(`/api/category/${userId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });

          if (response.ok) {
            const fetchedCategories = await response.json();
            setCategories(fetchedCategories); // Set fetched categories in state
            setCategory(fetchedCategories[0]?.name || ""); // Set the first category as default
            console.log("Fetched categories:", fetchedCategories);
          } else {
            const errorData = await response.json();
            console.error("Error fetching categories:", errorData);
          }
        } catch (error) {
          console.error("Error fetching categories in catch:", error);
        }
      };

      fetchCategories();
    }
  }, [userId]);


  // Fetch the report data based on filters
  const fetchReportData = async () => {
    if (!startDate || !endDate) {
      alert("Please select a valid date range.");
      return;
    }

    try {
      const params = {
        startDate,
        endDate,
        category: category || undefined,
      };
      const response = await axios.get("/api/reports", { params });
      setReportData(response.data.report);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  // Handle download report (can be expanded for PDF or CSV export)
  const handleDownloadReport = () => {
    // For simplicity, let's assume we want to download the report as a CSV.
    const headers = ["Name", "Amount", "Category", "Date"];
    const rows = reportData.map((row) => [
      row.name,
      row.amount,
      row.category,
      row.date,
    ]);

    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n";
    rows.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "financial_report.csv");
    link.click();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Paper className="p-6 shadow-lg max-w-4xl mx-auto bg-white">
        <h2 className="text-center text-blue-700 font-semibold mb-6">Generate Financial Report {userId}</h2>

        {/* Filter Section */}
        <Box mb={4}>
          <Typography variant="h6" className="mb-4">Filters</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="End Date"
                type="date"
                fullWidth
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Category"
                  className="bg-gray-100"
                >
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.name}>
                        {cat.newCategory}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No categories available</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={fetchReportData}
            className="mt-4 w-full"
          >
            Generate Report
          </Button>
        </Box>

        {/* Report Display */}
        {reportData.length > 0 && (
          <Box mt={4}>
            <Typography variant="h6" className="mb-4">Generated Report</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.amount}</TableCell>
                      <TableCell>{row.category}</TableCell>
                      <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box mt={2}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDownloadReport}
                startIcon={<Download />}
              >
                Download Report
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </div>
  );
};

export default GenerateReport;
