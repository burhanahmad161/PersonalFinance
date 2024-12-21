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
import { Bar } from "react-chartjs-2"; // Import Bar chart
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GenerateReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("");
  const [reportData, setReportData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userId, setUserId] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // Fetch Categories
  useEffect(() => {
    if (userId) {
      fetchCategories(userId);
    }
  }, [userId]);

  const fetchCategories = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/category/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const categoriesData = await response.json();
        setCategories(categoriesData);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Failed to load categories'}`);
      }
    } catch (error) {
      alert("Error: Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Expenses
  useEffect(() => {
    if (userId) {
      fetchExpenses(userId);
    }
  }, [userId]);

  const fetchExpenses = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/expense/${userId}`);
      if (response.ok) {
        const expensesData = await response.json();
        setExpenses(expensesData);
      } else {
        alert("Error fetching expenses.");
      }
    } catch (error) {
      alert("Error fetching expenses.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Report Data
  const fetchReportData = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    if (start > end) {
      alert("Start date must be earlier than end date.");
      return;
    }

    const filteredExpenses = expenses.filter((expense) => {
      const expenseTime = new Date(expense.addingTime).getTime();
      const isWithinDateRange = expenseTime >= start && expenseTime <= end;
      const isMatchingCategory = category ? expense.expenseCategory === category : true;

      return isWithinDateRange && isMatchingCategory;
    });

    setReportData(
      filteredExpenses.map((expense) => ({
        name: expense.expenseName || "N/A",
        amount: expense.amount || 0,
        category: expense.expenseCategory || "Uncategorized",
        date: expense.addingTime,
      }))
    );
  };

  // Chart Data Preparation
  const chartData = {
    labels: reportData.map((expense) => expense.name), // X-axis labels
    datasets: [
      {
        label: "Amount (Rs)",
        data: reportData.map((expense) => expense.amount), // Y-axis data
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: "Expense Report" },
    },
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Paper className="p-6 shadow-lg max-w-4xl mx-auto bg-white">
        <h2 className="text-center text-blue-700 font-semibold mb-6">Generate Financial Report</h2>

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
                      <MenuItem key={cat.id} value={cat.newCategory}>
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

        {/* Report Chart */}
        {reportData.length > 0 && (
          <Box mt={4}>
            <Typography variant="h6" className="mb-4">Generated Report</Typography>
            <Bar data={chartData} options={chartOptions} />
          </Box>
        )}
      </Paper>
    </div>
  );
};

export default GenerateReport;
