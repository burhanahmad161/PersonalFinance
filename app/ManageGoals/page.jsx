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
  Grid,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const SetFinancialGoals = () => {
  const [goals, setGoals] = useState([]);
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState(0);
  const [amountSaved, setAmountSaved] = useState(0);
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


  // Fetch existing goals
  const fetchGoals = async () => {
    try {
      const response = await axios.get("/api/goals");
      setGoals(response.data.goals);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // Handle adding a new goal
  const handleAddGoal = async () => {
    if (goalName && goalAmount > 0 && amountSaved >= 0) {
      const newGoal = {
        name: goalName,
        goalAmount: goalAmount,
        amountSaved: amountSaved,
      };

      try {
        const response = await axios.post("/api/goals", newGoal);
        setGoals((prevGoals) => [...prevGoals, response.data.goal]);
        setGoalName("");
        setGoalAmount(0);
        setAmountSaved(0);
      } catch (error) {
        console.error("Error adding goal:", error);
      }
    } else {
      alert("Please fill in all fields correctly.");
    }
  };

  // Handle deleting a goal
  const handleDeleteGoal = async (goalId) => {
    try {
      await axios.delete(`/api/goals/${goalId}`);
      setGoals(goals.filter(goal => goal.id !== goalId));
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  // Handle editing a goal
  const handleEditGoal = async (goalId, updatedGoal) => {
    try {
      const response = await axios.put(`/api/goals/${goalId}`, updatedGoal);
      const updatedGoals = goals.map(goal =>
        goal.id === goalId ? response.data.goal : goal
      );
      setGoals(updatedGoals);
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Paper className="p-6 shadow-lg max-w-4xl mx-auto bg-white">
        <h2 className="text-center text-blue-700 font-semibold mb-6">Set Financial Goals {userId}</h2>

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
          >
            Add Goal
          </Button>
        </Box>

        {/* Goal List */}
        <Typography variant="h6" className="mb-4">Your Financial Goals</Typography>
        <Grid container spacing={4}>
          {goals.map((goal) => {
            const progress = (goal.amountSaved / goal.goalAmount) * 100;
            return (
              <Grid item xs={12} sm={6} key={goal.id}>
                <Paper className="p-4 shadow-lg">
                  <Typography variant="h6">{goal.name}</Typography>
                  <Typography variant="body1" color="textSecondary">
                    Goal Amount: ${goal.goalAmount.toFixed(2)}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Amount Saved: ${goal.amountSaved.toFixed(2)}
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
                    <IconButton
                      onClick={() => handleEditGoal(goal.id, { ...goal, amountSaved: goal.amountSaved + 50 })}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteGoal(goal.id)}>
                      <Delete color="error" />
                    </IconButton>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    </div>
  );
};

export default SetFinancialGoals;
