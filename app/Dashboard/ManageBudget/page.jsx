'use client';
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  LinearProgress,
  Snackbar,
  Alert,
  CircularProgress // Import CircularProgress for loading state
} from "@mui/material";

const ManageBudget = () => {
  const [budget, setBudget] = useState(0);
  const [currentExpense, setCurrentExpense] = useState([]);
  const [newBudget, setNewBudget] = useState(0);
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true); // Initially true
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar for success/error messages

  // Fetch User ID on component mount
  useEffect(() => {
    const fetchUserId = async () => {
      try {
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

  // Fetch User Budget
  useEffect(() => {
    if (userId) {
      fetchBudget(userId);
    }
  }, [userId]);

  const fetchBudget = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/budget/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const budgetData = await response.json();
        setBudget(budgetData[0].amount);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error || 'Failed to load categories'}`);
      }
    } catch (error) {
      setMessage("Error: Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Current Expenses
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
        setCurrentExpense(expensesData);
      } else {
        setMessage("Error fetching expenses.");
      }
    } catch (error) {
      setMessage("Error fetching expenses.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate total expenses
  const calculateTotalExpenses = () => {
    return currentExpense.reduce((total, expense) => total + expense.amount, 0);
  };

  // Calculate remaining budget
  const remainingBudget = budget - calculateTotalExpenses();
  const progress = (calculateTotalExpenses() / budget) * 100;

  // Create New Budget
  const CreateNewBudget = async (e) => {
    e.preventDefault();
    if (!newBudget) {
      setMessage("Please enter a Budget.");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await fetch('/api/budget', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newBudget, userId }),
      });

      const data = await response.json();

      if (response.status === 201) {
        setMessage('Budget added successfully!');
        setOpenSnackbar(true);
      } else {
        setMessage('Error: ' + (data.error || 'Unknown error'));
        setOpenSnackbar(true);
      }
    } catch (error) {
      setMessage("Error: Failed to create budget.");
      setOpenSnackbar(true);
    }
  };

  const deleteEverything = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete all your Data? This action cannot be undone.");
    if (!confirmDelete) {
      setMessage("Deletion canceled.");
      return; // Exit the function if the user cancels
    }
  
    console.log("Deleting all expenses");
    try {
      const response = await fetch(`/api/expense/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const response2 = await fetch(`/api/budget/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();  
      if (response.ok && response2.ok) {
        setCurrentExpense([]); // Clear the expenses list
        setMessage("Your data has been deleted successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setMessage("Error: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      setMessage("Error: Failed to delete expenses.");
    }
  }



  // Update Budget
  const UpdateBudget = async () => {
    if (newBudget <= 0) {
      setMessage("Please enter a valid amount.");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await fetch(`/api/budget/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: newBudget }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setMessage('Budget updated successfully!');
        setOpenSnackbar(true);
        // Refresh the page after updating the budget
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setMessage('Error: ' + (data.error || 'Unknown error'));
        setOpenSnackbar(true);
      }
    } catch (error) {
      setMessage("Error: Failed to update budget.");
      setOpenSnackbar(true);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Paper className="p-6 shadow-lg max-w-4xl mx-auto bg-white">
        <h2 className="text-center text-blue-700 font-semibold mb-6">Manage Budget</h2>

        {/* Loading Indicator */}
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <>
            {/* Display Current Budget and Expense Tracker */}
            <Box mb={4}>
              {budget !== 0 ? (
                <>
                  <Typography variant="h6" color="textSecondary">
                    Current Budget: {budget}.00 Rs
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    Current Expenses: {calculateTotalExpenses()}.00 Rs
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    Remaining Budget: {remainingBudget}.00 Rs
                  </Typography>
                </>

              ) : (
                <>
                  <Typography variant="h6" color="textSecondary">
                    You don't have a budget set. Please add a new budget below.
                  </Typography>
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
                    onClick={CreateNewBudget}
                    className="py-2 bg-blue-600 hover:bg-blue-700 transition-all duration-200"
                  >
                    Set Budget
                  </Button>
                </>
              )}
            </Box>

            {/* Budget Progress Bar */}
            {budget > 0 && (
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
            )}

            {/* Update Budget Form */}
            {budget > 0 && (
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
                  onClick={UpdateBudget}
                  className="py-2 bg-blue-600 hover:bg-blue-700 transition-all duration-200"
                >
                  Update Budget
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={deleteEverything}
                  className="py-2 bg-blue-600 hover:bg-blue-700 transition-all duration-200"
                >
                  Clear Expenses and Reset Budget
                </Button>
              </div>
            )}

            {/* Additional Information */}
            <Box mb={2}>
              <Typography variant="body1">
                Your current budget helps track your expenses and ensure you stay within your financial limits.
                You can always update it if your budget changes.
              </Typography>
            </Box>
          </>
        )}
      </Paper>

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={message.includes('Error') ? 'error' : 'success'}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ManageBudget;
