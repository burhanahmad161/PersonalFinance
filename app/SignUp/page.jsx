"use client";
import { useState } from "react";
import { TextField, Button, Typography, Box, CircularProgress, Link } from "@mui/material";
import { Person as PersonIcon, Email as EmailIcon, Lock as LockIcon, Phone as PhoneIcon } from "@mui/icons-material";

const CreateUser = () => {
    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        password: "",
        phoneNumber: "",
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(""); // Clear previous messages
        setLoading(true);

        try {
            console.log("Form Data:", formData);
            const response = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "signup",
                    ...formData,
                }),
            });

            const text = await response.text();
            console.log("Raw response text:", text);

            const data = text ? JSON.parse(text) : {};

            if (response.status === 201) {
                setMessage("User created successfully!");
            } else {
                setMessage("Error: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            console.log("Error while submitting:", error);
            setMessage("Error: Failed to create user.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                background: "linear-gradient(to right, #4e73df, #1f456e)",
            }}
        >
            {/* Form Section */}
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 400,
                    padding: 4,
                    backgroundColor: "white",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Typography variant="h4" align="center" gutterBottom>
                    Create User
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Box mb={3}>
                        <TextField
                            label="User Name"
                            type="text"
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                startAdornment: <PersonIcon sx={{ color: "action.active", marginRight: 1 }} />,
                            }}
                        />
                    </Box>

                    <Box mb={3}>
                        <TextField
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                startAdornment: <EmailIcon sx={{ color: "action.active", marginRight: 1 }} />,
                            }}
                        />
                    </Box>

                    <Box mb={3}>
                        <TextField
                            label="Phone Number"
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                startAdornment: <PhoneIcon sx={{ color: "action.active", marginRight: 1 }} />,
                            }}
                        />
                    </Box>

                    <Box mb={3}>
                        <TextField
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                startAdornment: <LockIcon sx={{ color: "action.active", marginRight: 1 }} />,
                            }}
                        />
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ padding: "10px", marginTop: "16px" }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Create User"}
                    </Button>

                    {message && (
                        <Typography
                            variant="body2"
                            color={message.includes("successfully") ? "success.main" : "error.main"}
                            align="center"
                            sx={{ marginTop: "16px" }}
                        >
                            {message}
                        </Typography>
                    )}

                    <Box mt={2} textAlign="center">
                        <Link href="/" variant="body2" color="primary">
                            Already have an account? Sign In
                        </Link>
                    </Box>
                </form>
            </Box>
        </Box>
    );
};

export default CreateUser;
