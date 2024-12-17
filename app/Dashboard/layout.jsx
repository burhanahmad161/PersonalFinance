"use client";
import { useState } from "react";
import { Dashboard, AttachMoney, AccountBalanceWallet, Assessment, Category, History, Logout } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { AuthProvider } from "../../AuthContext";
const UserDashboard = ({ children }) => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(true);
  const router = useRouter();

  const handleLogout = () => {
    // Logic for logging out
    router.push("/");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navbar */}
      <div className={`bg-gray-800 text-white flex justify-between items-center p-4 transition-all ${isNavbarOpen ? "h-16" : "h-12"}`}>
        <div className="flex items-center">
          {/* You can add a logo or additional content here if needed */}
        </div>
        <nav className="flex justify-around w-full">
          <a href="/Dashboard" className="flex items-center p-3 hover:bg-gray-600">
            <Dashboard className="mr-2" />
            {isNavbarOpen && <span>Dashboard</span>}
          </a>
          <a href="/Dashboard/ManageBudget" className="flex items-center p-3 hover:bg-gray-600">
            <AttachMoney className="mr-2" />
            {isNavbarOpen && <span>Manage Budget</span>}
          </a>
          <a href="/Dashboard/ManageExpense" className="flex items-center p-3 hover:bg-gray-600">
            <AccountBalanceWallet className="mr-2" />
            {isNavbarOpen && <span>Manage Expense</span>}
          </a>
          <a href="/Dashboard/ManageGoals" className="flex items-center p-3 hover:bg-gray-600">
            <Assessment className="mr-2" />
            {isNavbarOpen && <span>Manage Financial Goals</span>}
          </a>
          <a href="/Dashboard/ManageCategories" className="flex items-center p-3 hover:bg-gray-600">
            <Category className="mr-2" />
            {isNavbarOpen && <span>Manage Categories</span>}
          </a>
          <a href="/Dashboard/GenerateReport" className="flex items-center p-3 hover:bg-gray-600">
            <Assessment className="mr-2" />
            {isNavbarOpen && <span>Generate Report</span>}
          </a>
          <a href="/Dashboard/AuditLog" className="flex items-center p-3 hover:bg-gray-600">
            <History className="mr-2" />
            {isNavbarOpen && <span>Audit Log</span>}
          </a>
          <button onClick={handleLogout} className="flex items-center p-3 bg-red-500 hover:bg-red-600">
            <Logout className="mr-2" />
            {isNavbarOpen && <span>Sign Out</span>}
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 bg-gray-100">
        <AuthProvider>
          {children}
        </AuthProvider>
      </div>
    </div>
  );
};

export default UserDashboard;
