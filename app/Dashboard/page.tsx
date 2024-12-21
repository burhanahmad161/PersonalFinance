"use client";
import React, { use } from "react";
import Image from "next/image";
import { useEffect } from "react";
import { Pie, Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, BarElement } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, BarElement);
import { useRouter } from "next/navigation";
// Register the required components for the charts
//ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);
export default function Home() {
  // Data for the Pie chart
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [expenses, setExpenses] = React.useState([]);
  const [goals, setGoals] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const router = useRouter();
  const [userId, setUserId] = React.useState(null);
  const [budget, setBudget] = React.useState(0);
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
  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

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

  let total = 0;
  useEffect(() => {
    expenses.map((expense) => {
      total += expense.amount;
    });
  }, [expenses]);
  // Calculate total expenses
  const calculateTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  // Calculate remaining budget
  const remainingBudget = budget - calculateTotalExpenses();

  const pieData = {
    labels: expenses.map(expense => expense.expenseName),  // Category names dynamically
    datasets: [
      {
        label: "Account Distribution",
        data: expenses.map(expense => expense.amount),  // Amounts dynamically
        backgroundColor: expenses.map(() => generateRandomColor()), // Generate unique colors dynamically
        hoverBackgroundColor: expenses.map(() => generateRandomColor()), // Generate hover colors dynamically
        borderWidth: 1,
      },
    ],
  };
  const calculateTotal = calculateTotalExpenses();

  const barData2 = {
    labels: ["Budget", "Remaining Budget", "Total Expenses"],  // Category names
    datasets: [
      {
        label: "Budget Overview", // Label for the dataset
        data: [budget, remainingBudget, calculateTotal], // Amounts
        backgroundColor: expenses.map(() => generateRandomColor()), // Dynamic color
        borderColor: '#000000',
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: expenses.map(expense => expense.expenseName),  // Category names
    datasets: [
      {
        label: "Expenses per Category",
        data: expenses.map(expense => expense.amount), // Amounts
        backgroundColor: expenses.map(() => generateRandomColor()), // Dynamic color
        borderColor: '#000000',
        borderWidth: 1,
      },
    ],
  };
  // Data for the Line chart (Monthly Income and Expenses)
  const lineData = {
    labels: expenses.map(expense => {
      const date = new Date(expense.addingTime);  // Convert addingTime to Date object
      // Format date as day-month-year (e.g., 10-01-2024)
      return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    }),
    datasets: [
      {
        label: "Expenses",
        data: expenses.map(expense => expense.amount), // Use the expense amount for the y-axis
        borderColor: "#FFC107", // Yellow for expenses
        backgroundColor: "rgba(255, 193, 7, 0.2)", // Light yellow background
        tension: 0.2,
        fill: true,
      },
    ],
  };
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return 'Good Morning!';
    } else if (currentHour < 18) {
      return 'Good Afternoon!';
    } else {
      return 'Good Evening!';
    }
  };


  return (
    <>
    <div className="text-center"> 
      <h1>{getGreeting()}</h1>
    </div>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : expenses.length && goals.length > 0 ? (
        <div>
          <div className="flex flex-row">
            <div>
              <div className="mainDiv">
                <div className="balance-div">
                  <Bar
                    data={barData2}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false, // This makes sure the chart resizes based on the container
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                      },
                      scales: {
                        x: {
                          beginAtZero: true,
                        },
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                    style={{ height: '200px', width: '25%' }}
                  />
                </div>
              </div>
              <div className="balance-div">
                <Line data={lineData} />
              </div>
            </div>
            <div className="mainDiv">
              <div className="balance-div2">
                <h1><b>Total Expenses</b></h1>
                <div className="mt-8">
                  <Pie data={pieData} />
                </div>
              </div>
              <div className="balance-div3">
                <div className="mt-8">
                  <Bar
                    data={barData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false, // This makes sure the chart resizes based on the container
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                      },
                      scales: {
                        x: {
                          beginAtZero: true,
                        },
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                    style={{ height: '300px', width: '30%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">No Data found.</div>
      )}
    </>
  );

}
