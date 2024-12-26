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
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ManageCategories = () => {
  // States
  const [token, setToken] = useState("");
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmationName, setConfirmationName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Fetch User ID on initial render
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

  // Fetch categories once userId is available
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
        setMessage(`Error: ${errorData.error || 'Failed to load categories'}`);
      }
    } catch (error) {
      setMessage("Error: Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory) {
      setMessage("Please enter a category name.");
      return;
    }

    try {
      const response = await fetch('/api/category', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newCategory, userId }),
      });

      const data = await response.json();

      if (response.status === 201) {
        setCategories((prevCategories) => [...prevCategories, data]);
        setNewCategory(""); // Clear input after adding
        setMessage('Category added successfully!');
      } else {
        setMessage('Error: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      setMessage("Error: Failed to create category.");
    }
  };

  const handleOpenDialog = (category) => {
    setSelectedCategory(category);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCategory(null);
    setConfirmationName("");
  };

  const handleConfirmDelete = async () => {
    if (confirmationName !== selectedCategory.newCategory) {
      alert("The entered name does not match the category name. Deletion cancelled.");
      return;
    }

    try {
      const response = await fetch(`/api/category/${selectedCategory.categoryId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category.categoryId !== selectedCategory.categoryId)
        );
        alert(`Category "${selectedCategory.newCategory}" has been deleted successfully.`);
      } else {
        const errorData = await response.json();
        console.error("Error deleting category:", errorData);
        alert(`Failed to delete category: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("An error occurred while deleting the category.");
    } finally {
      handleCloseDialog();
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Paper className="p-6 shadow-lg max-w-4xl mx-auto bg-white">
        <h2 className="text-center text-blue-700 font-semibold mb-6">Manage Categories</h2>

        {/* Add New Category Form */}
        <div className="flex gap-4 mb-6">
          <TextField
            label="New Category"
            variant="outlined"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddCategory}
            className="py-2 bg-blue-600 hover:bg-blue-700 transition-all duration-200"
          >
            Add Category
          </Button>
        </div>

        {/* Message Display */}
        {message && <div className="text-center text-red-500 mb-4">{message}</div>}

        {/* Categories Table */}
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : categories.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="font-semibold text-blue-700">Category Name</TableCell>
                  <TableCell className="font-semibold text-blue-700">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.categoryId}>
                    <TableCell>{category.newCategory}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenDialog(category)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <div className="text-center">No categories found.</div>
        )}
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the category{" "}
            <strong>{selectedCategory?.newCategory}</strong>? Please type the
            category name below to confirm.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            value={confirmationName}
            onChange={(e) => setConfirmationName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="primary"
            variant="contained"
            disabled={confirmationName !== selectedCategory?.newCategory}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageCategories;
