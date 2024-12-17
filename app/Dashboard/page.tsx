"use client";
import React from "react";
import Image from "next/image";
import { Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";
import { useRouter } from "next/navigation";
// Register the required components for the charts
ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

export default function Home() {
  // Data for the Pie chart
  const router = useRouter();
  const pieData = {
    labels: ["Savings", "Expenses", "Investments"],
    datasets: [
      {
        label: "Account Distribution",
        data: [50000, 20000, 13172.42], // Adjust the data as necessary
        backgroundColor: ["#4CAF50", "#FFC107", "#2196F3"],
        hoverBackgroundColor: ["#66BB6A", "#FFD54F", "#64B5F6"],
        borderWidth: 1,
      },
    ],
  };

  // Data for the Line chart (Monthly Income and Expenses)
  const lineData = {
    labels: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    datasets: [
      {
        label: "Monthly Income",
        data: [4000, 4200, 4500, 4800, 5000, 5300, 5600, 5800, 6000, 6200, 6400, 6600], // Example data for income
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        tension: 0.2,
        fill: true,
      },
      {
        label: "Monthly Expenses",
        data: [3500, 3700, 3800, 3900, 4200, 4300, 4500, 4600, 4700, 4800, 5000, 5200], // Example data for expenses
        borderColor: "#FFC107",
        backgroundColor: "rgba(255, 193, 7, 0.2)",
        tension: 0.2,
        fill: true,
      },
    ],
  };

  // Navbar Menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleNavigation = (path: string) => {
    // Close the menu and navigate to the desired page
    setAnchorEl(null);
    router.push(path);
  };

  return (
    <div>
      <div className="flex flex-row">
        <div>
          <div className="mainDiv">
            <div className="balance-div">
              <p>My balance</p>
              <div className="flex flex-row">
                <h1 className="text-3xl">$83,172.42</h1>
                <p className="mt-2 ml-4 text-green-800"><b>+6.7% </b></p>
                <p className="mt-2 ml-2">compare to last month</p>
              </div>
              <div className="flex flex-row">
                <p className="mt-4"><b>6549 7329 9821 1234</b></p>
                <button className="mt-2 ml-4 bg-green-500 hover:bg-green-700 p-1 text-white font-bold rounded">Copy</button>
              </div>
              <div className="flex flex-row">
                <button className="mt-12 ml-12 bg-green-500 hover:bg-green-700  p-4 text-white font-bold rounded box-">Send Money</button>
                <button className="mt-12 ml-4  bg-neutral-200 hover:bg-green-700  p-4 text-green-500 font-bold rounded">Request Money</button>
              </div>
            </div>
            <div className="balance-div">
              <Image className="mt-4 rounded" alt="income" src="data:image/jpeg;base64,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" width={30} height={50} />
              <h1 className="text-sm mt-6"><b>Monthy Income</b></h1>
              <br></br>
              <p className="text-3xl"><b>$16,281.45</b></p>
              <div className="flex flex-row">
                <p className="mt-2  text-green-800"><b>+9.8% </b></p>
                <p className="mt-2 ml-2">compare to last month</p>
              </div>
            </div>
            <div className="balance-div">
              <Image alt="image" className="mt-4 rounded" src="data:image/jpeg;base64,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" width={30} height={50} />
              <h1 className="text-sm mt-6"><b>Monthy Expenses</b></h1>
              <br></br>
              <p className="text-3xl"><b>$6,441.45</b></p>
              <div className="flex flex-row">
                <p className="mt-2  text-red-800"><b>-6.8% </b></p>
                <p className="mt-2 ml-2">compare to last month</p>
              </div>
            </div>
          </div>
          <div className="mt-8 ml-8">
            <Line data={lineData} />
          </div>
        </div>
        <div className="mainDiv">
          <div className="balance-div2">
            <h1><b>All Expenses</b></h1>
            <div className="flex flex-row gap-28">
              <div>
                <p className="text-sm mt-4">Daily</p>
                <p className="text-sm "><b>$682.20</b></p>
              </div>
              <div>
                <p className="text-sm mt-4">Weekly</p>
                <p className="text-sm "><b>$2682.20</b></p>
              </div>
              <div>
                <p className="text-sm mt-4">Monthly</p>
                <p className="text-sm "><b>$6682.20</b></p>
              </div>
            </div>
            <div className="mt-8">
              <Pie data={pieData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
