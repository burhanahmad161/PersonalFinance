'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  LinearProgress,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Snackbar
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const SetFinancialGoals = () => {
  const [goals, setGoals] = useState([]);
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [amountSaved, setAmountSaved] = useState("");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [newAmount, setNewAmount] = useState(0);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`,
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
        alert("Error fetching user data.");
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchGoals(userId);
    }
  }, [userId]);

  const fetchGoals = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/goal/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setGoals(data);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error || 'Failed to load goals'}`);
      }
    } catch (error) {
      setMessage("Error: Failed to fetch goals.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    setLoading(true);  // Set loading state to true during operation
    try {
      const response = await fetch("/api/goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, goalName, goalAmount, amountSaved }),
      });
      const data = await response.json();
      if (response.ok) {
        setSnackbarMessage("Goal added successfully!");
        setSnackbarOpen(true);
        setGoalName("");
        setGoalAmount("");
        setAmountSaved("");
        fetchGoals(userId); // Refetch goals after adding a new one
      } else {
        setSnackbarMessage("Error: " + (data.error || "Unknown error"));
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Error: Failed to add goal.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);  // Reset loading state
    }
  };

  //................. Delete Goal .....................
  const handleDeleteGoal = (goal) => {
    setGoalToDelete(goal);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setGoalToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!goalToDelete) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/goal/${goalToDelete.goalId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setSnackbarMessage(`Goal "${goalToDelete.goalName}" has been deleted successfully.`);
        setSnackbarOpen(true);
        fetchGoals(userId); // Refetch goals after deletion
      } else {
        const errorData = await response.json();
        setSnackbarMessage(`Failed to delete goal: ${errorData.error || "Unknown error"}`);
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("An error occurred while deleting the goal.");
      setSnackbarOpen(true);
    } finally {
      handleCloseDialog();
      setLoading(false);  // Reset loading state
    }
  };

  //................. Edit Goal .....................
  const handleEditOpenDialog = (goal) => {
    setSelectedGoalId(goal.goalId);
    setNewAmount(goal.amountSaved);
    setOpenEditDialog(true);
  };

  const handleEditCloseDialog = () => {
    setOpenEditDialog(false);
    setSelectedGoalId(null);
    setNewAmount(0);
  };

  const handleEditGoal = async () => {
    if (newAmount <= 0) {
      setSnackbarMessage("Please enter a valid amount.");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/goal/${selectedGoalId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goalId: selectedGoalId, amount: newAmount }),
      });

      const data = await response.json();
      if (response.ok) {
        setSnackbarMessage("Goal updated successfully!");
        setSnackbarOpen(true);
        fetchGoals(userId); // Refetch the goals to update the UI
        handleEditCloseDialog(); // Close the edit dialog
      } else {
        setSnackbarMessage("Error: " + (data.error || "Unknown error"));
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Error: Failed to update goal.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);  // Reset loading state
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Paper className="p-6 shadow-lg max-w-4xl mx-auto bg-white">
        <h2 className="text-center text-blue-700 font-semibold mb-6">Set Financial Goals</h2>

        {/* Goal Form */}
        <Box mb={4}>
          <Typography variant="h6" className="mb-4">Add New Goal</Typography>
          <TextField
            label="Goal Name"
            variant="outlined"
            fullWidth
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="Goal Amount"
            variant="outlined"
            type="number"
            fullWidth
            value={goalAmount}
            onChange={(e) => setGoalAmount(Number(e.target.value))}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="Amount Saved"
            variant="outlined"
            type="number"
            fullWidth
            value={amountSaved}
            onChange={(e) => setAmountSaved(Number(e.target.value))}
            style={{ marginBottom: "20px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddGoal}
            className="w-full py-2"
            disabled={loading}
          >
            Add Goal
          </Button>
        </Box>

        {/* Goal List */}
        {/* Goal List */}
        <Typography variant="h6" className="mb-4">Your Financial Goals</Typography>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : goals.length > 0 ? (
          <Grid container spacing={4}>
            {goals.map((goal) => {
              const progress = (goal.amountSaved / goal.goalAmount) * 100;
              return (
                <Grid item xs={12} sm={6} key={goal.id}>
                  <Paper className="p-4 shadow-lg">
                    <Typography variant="h6">{goal.goalName}</Typography>
                    <Typography variant="body1" color="textSecondary">
                      Goal Amount: {goal.goalAmount.toFixed(2)} Rs
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Amount Saved: {goal.amountSaved.toFixed(2)} Rs
                    </Typography>

                    {/* Progress Bar */}
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        marginBottom: 2,
                        backgroundColor: "#e0e0e0",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: progress < 100 ? "#3f51b5" : "#4caf50",
                        },
                      }}
                    />

                    <Box display="flex" justifyContent="space-between">
                      <IconButton onClick={() => handleEditOpenDialog(goal)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteGoal(goal)}>
                        <Delete color="error" />
                      </IconButton>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <div className="text-center">No goals found.</div>
        )}
      </Paper>
      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your goal{" "}
            <strong>{goalToDelete?.goalName}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="primary"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Goal Dialog */}
      <Dialog open={openEditDialog} onClose={handleEditCloseDialog}>
        <DialogTitle>Update Goal Amount</DialogTitle>
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
          <Button onClick={handleEditCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditGoal} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </div>
  );
};

export default SetFinancialGoals;
