'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Paper,
  Box,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Download } from "@mui/icons-material";

const AuditPage = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("");
  const [auditLogs, setAuditLogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userId, setUserId] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [goals, setGoals] = useState([]);

  // Fetch User ID
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
          console.error("User not authenticated", data.error);
        }
      } catch (error) {
        console.error("API error:", error);
        alert("Error fetching user data.");
      }
    };

    fetchUserId();
  }, []);

  // Fetch Data for Categories, Expenses, and Goals
  useEffect(() => {
    if (userId) {
      fetchCategories(userId);
      fetchExpenses(userId);
      fetchGoals(userId);
    }
  }, [userId]);

  const fetchCategories = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/category/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error || "Failed to load categories"}`);
      }
    } catch (error) {
      setMessage("Error: Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenses = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/expense/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      } else {
        setMessage("Error fetching expenses.");
      }
    } catch (error) {
      setMessage("Error fetching expenses.");
    } finally {
      setLoading(false);
    }
  };

  const fetchGoals = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/goal/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        setGoals(data);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error || "Failed to load goals"}`);
      }
    } catch (error) {
      setMessage("Error: Failed to fetch goals.");
    } finally {
      setLoading(false);
    }
  };

  // Generate Audit Logs
  const generateAuditLogsFromExpenses = () => {
    const expenseLogs = expenses.map((expense) => ({
      timestamp: expense.addingTime,
      action: "Expense Added",
      details: `Expense "${expense.expenseName}" of amount ${expense.amount} Rs was added to the category "${expense.expenseCategory}"`,
    }));

    const categoryLogs = categories.map((category) => ({
      timestamp: category.addingTime,
      action: "Category Added",
      details: `Added a category named ${category.newCategory}`,
    }));

    const goalLogs = goals.map((goal) => ({
      timestamp: goal.dateCreated,
      action: "Goal Added",
      details: `Added a goal named ${goal.goalName}, with ${goal.amountSaved} Rs savings and goal amount of ${goal.goalAmount} Rs`,
    }));

    setAuditLogs([...expenseLogs, ...categoryLogs, ...goalLogs]);
  };

  const handleDownloadLogs = () => {
    const headers = ["Timestamp", "Action", "Details"];
    const rows = auditLogs.map((log) => [
      new Date(log.timestamp).toLocaleString(),
      log.action,
      log.details,
    ]);

    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n";
    rows.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "audit_logs.csv");
    link.click();
  };

  useEffect(() => {
    generateAuditLogsFromExpenses();
  }, [expenses, categories, goals]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Paper className="p-6 shadow-lg max-w-4xl mx-auto bg-white">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : auditLogs.length > 0 ? (
          <Box ml={1}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Timestamp
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Action</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {auditLogs.map((log, index) => (
                    <TableRow
                      key={index}
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#f9f9f9" : "#e3f2fd",
                      }}
                    >
                      <TableCell>
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box mt={2}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDownloadLogs}
                startIcon={<Download />}
              >
                Download Logs
              </Button>
            </Box>
          </Box>
        ) : (
          <div className="text-center">No audit logs found.</div>
        )}
      </Paper>
    </div>
  );
};

export default AuditPage;
