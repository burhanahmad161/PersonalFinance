"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../AuthContext";
import { TextField, Button, Typography, Link, Box, CircularProgress, Grid } from "@mui/material";
import { Email as EmailIcon, Lock as LockIcon } from "@mui/icons-material";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

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
      console.log("Signing in user:", formData);
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "signin",
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await response.json();
  
      setLoading(false);
  
      if (response.ok) {
        localStorage.setItem('jwtToken', data.token);
        setMessage("Sign-in successful!");
        router.push("/Dashboard");
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Invalid email or password");
      }
    } catch (error) {
      setLoading(false);
      console.error("API error:", error);
      setMessage("Network error: Unable to sign in. Please try again.");
    }
  };

  return (
    <Grid
      container
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #4e73df, #1f456e)",
      }}
    >
      {/* Right Side: Form */}
      <Grid item xs={12} md={6} sx={{ padding: 4, backgroundColor: "white", borderRadius: "10px" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Welcome Back
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" mb={3}>
          Please sign in to your account to continue
        </Typography>

        <form onSubmit={handleSubmit}>
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
            {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
          </Button>

          {message && (
            <Typography
              variant="body2"
              color={message.includes("successful") ? "success.main" : "error.main"}
              align="center"
              sx={{ marginTop: "16px" }}
            >
              {message}
            </Typography>
          )}

          <Box mt={2} textAlign="center">
            <Link href="/SignUp" variant="body2" color="primary">
              Don’t have an account? Sign Up
            </Link>
          </Box>
        </form>
      </Grid>
    </Grid>
  );
};

export default SignIn;
