'use client';
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  IconButton,
  MenuItem,
  InputLabel,
  FormControl,
  Card,
  Typography,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";
import UpdateIcon from "@mui/icons-material/Edit";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress for the loader

const ExpenseManager = () => {
  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState(0);
  const [expenseCategory, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const [newAmount, setNewAmount] = useState(0);

  // Fetch User ID on component mount
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
          body: JSON.stringify({ action: "getId" }),
        });
        const data = await response.json();
        if (response.ok) {
          setUserId(data.userId);
        } else {
          console.log("User not authenticated", data.error);
        }
      } catch (error) {
        console.error("API error:", error);
      }
    };
    fetchUserId();
  }, []);

  // Fetch User Categories
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
            setCategories(fetchedCategories);
            setCategory(fetchedCategories[0]?.name || "");
          } else {
            console.error("Error fetching categories");
          }
        } catch (error) {
          console.error("Error fetching categories", error);
        }
      };

      fetchCategories();
    }
  }, [userId]);

  // Function to fetch expenses by User ID
  useEffect(() => {
    if (userId) {
      fetchExpenses(userId);
    }
  }, [userId]);

  const fetchExpenses = async (userId) => {
    setLoading(true); // Show loader
    try {
      const response = await fetch(`/api/expense/${userId}`);
      if (response.ok) {
        const expensesData = await response.json();
        setExpenses(expensesData);
      } else {
        setMessage("Error fetching expenses.");
      }
    } catch (error) {
      setMessage("Error fetching expenses.");
    } finally {
      setLoading(false); // Hide loader
    }
  };

  // Handle adding a new expense
  const handleAddExpense = async (e) => {
    e.preventDefault();
    console.log("Adding expense:", expenseName, amount, expenseCategory);
    try {
      const response = await fetch("/api/expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, expenseName, amount, expenseCategory }),
      });
      const data = await response.json();
      if (response.ok) {
        setExpenses((prevExpenses) => [...prevExpenses, data]); // Add the new expense to the list
        setMessage("Expense added successfully!");
        setExpenseName(""); // Clear form fields
        setAmount(0);
        setCategory(categories[0]?.name || ""); // Reset category to default
      } else {
        setMessage("Error: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      setMessage("Error: Failed to add expense.");
    }
  };
  // Delete All Expenses
  const deleteAllExpenses = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete all your expenses? This action cannot be undone.");
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
  
      const data = await response.json();
      if (response.ok) {
        setExpenses([]); // Clear the expenses list
        setMessage("All expenses deleted successfully!");
      } else {
        setMessage("Error: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      setMessage("Error: Failed to delete expenses.");
    }
  };
  

  // Update expense amount
  const handleUpdateExpense = async () => {
    console.log("Updating expense amount:", selectedExpenseId, newAmount);
    if (newAmount <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }

    try {
      const response = await fetch(`/api/expense/${selectedExpenseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: newAmount }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Expense updated successfully!");
        fetchExpenses(userId); // Refetch the expenses to update the UI
        handleCloseDialog(); // Close the dialog
      } else {
        setMessage("Error: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      setMessage("Error: Failed to update expense.");
    }
  };

  // Handle opening/closing the dialog
  const handleOpenDialog = (expenseId, currentAmount) => {
    setSelectedExpenseId(expenseId);
    setNewAmount(currentAmount);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedExpenseId(null);
    setNewAmount(0);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card className="p-6 shadow-lg max-w-4xl mx-auto bg-white">
        <Typography variant="h4" gutterBottom className="text-center text-blue-700 font-semibold">
          Expense Manager
        </Typography>

        <div className="space-y-4 mb-6">
          {message && (
            <Typography variant="body1" color="secondary" className="text-center">
              {message}
            </Typography>
          )}

          <div className="flex gap-4">
            <TextField
              label="Expense Name"
              variant="outlined"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Amount"
              variant="outlined"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              fullWidth
            />
          </div>

          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={expenseCategory}
              onChange={(e) => setCategory(e.target.value)}
              label="Category"
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

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddExpense}
            fullWidth
          >
            Add Expense
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={deleteAllExpenses}
            fullWidth
          >
            Clear My Expanses
          </Button>
        </div>

        <Divider />

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : expenses.length > 0 ? (
          <TableContainer component={Paper} className="mt-6">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Expense Name</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.map((expense, index) => (
                  <TableRow key={index}>
                    <TableCell>{expense.expenseName}</TableCell>
                    <TableCell>{expense.amount.toFixed(2)} Rs</TableCell>
                    <TableCell>{expense.expenseCategory}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() =>
                          handleOpenDialog(expense.expenseId, expense.amount)
                        }
                      >
                        <UpdateIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <div className="text-center">No Expenses found.</div>
        )}
      </Card>

      {/* Update Amount Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update Expense</DialogTitle>
        <DialogContent>
          <TextField
            label="New Amount"
            variant="outlined"
            type="number"
            fullWidth
            value={newAmount}
            onChange={(e) => setNewAmount(Number(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateExpense} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ExpenseManager;
