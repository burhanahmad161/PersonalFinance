'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  LinearProgress,
} from "@mui/material";

const ManageBudget = () => {
  const [budget, setBudget] = useState(0);
  const [currentExpense, setCurrentExpense] = useState(0);
  const [newBudget, setNewBudget] = useState(0);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        console.log("Getting User ID");
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
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

  // Fetch current budget and expenses
  const fetchBudgetData = async () => {
    try {
      const response = await axios.get("/api/budget");
      const expenseResponse = await axios.get("/api/expenses");

      setBudget(response.data.budget);
      setCurrentExpense(expenseResponse.data.totalExpense);
    } catch (error) {
      console.error("Error fetching budget data:", error);
    }
  };

  useEffect(() => {
    fetchBudgetData();
  }, []);

  // Update budget
  const handleUpdateBudget = async () => {
    if (newBudget > 0) {
      try {
        const response = await axios.put("/api/budget", { budget: newBudget });
        setBudget(response.data.budget);
        setNewBudget(0); // Reset input field after update
      } catch (error) {
        console.error("Error updating budget:", error);
      }
    } else {
      alert("Please enter a valid budget amount");
    }
  };

  const remainingBudget = budget - currentExpense;
  const progress = (currentExpense / budget) * 100;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Paper className="p-6 shadow-lg max-w-4xl mx-auto bg-white">
        <h2 className="text-center text-blue-700 font-semibold mb-6">Manage Budget {userId}</h2>

        {/* Display Current Budget and Expense Tracker */}
        <Box mb={4}>
          <Typography variant="h6" color="textSecondary">
            Current Budget: ${budget.toFixed(2)}
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Current Expenses: ${currentExpense.toFixed(2)}
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Remaining Budget: ${remainingBudget.toFixed(2)}
          </Typography>
        </Box>

        {/* Budget Progress Bar */}
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 10,
            borderRadius: 5,
            marginBottom: 2,
            backgroundColor: "#e0e0e0",
            "& .MuiLinearProgress-bar": {
              backgroundColor: progress < 100 ? "#3f51b5" : "#f44336",
            },
          }}
        />

        {/* Update Budget Form */}
        <div className="flex gap-4 mb-6">
          <TextField
            label="New Budget"
            variant="outlined"
            type="number"
            value={newBudget}
            onChange={(e) => setNewBudget(Number(e.target.value))}
            fullWidth
            helperText="Set a new budget amount"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateBudget}
            className="py-2 bg-blue-600 hover:bg-blue-700 transition-all duration-200"
          >
            Update Budget
          </Button>
        </div>

        {/* Additional Information */}
        <Box mb={2}>
          <Typography variant="body1">
            Your current budget helps track your expenses and ensure you stay within your financial limits.
            You can always update it if your budget changes.
          </Typography>
        </Box>
      </Paper>
    </div>
  );
};

export default ManageBudget;
