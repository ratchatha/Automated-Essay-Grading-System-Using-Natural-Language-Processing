import React from 'react'
import Navbar from '../components/Navbar'
import DashboardDeatils from "../components/DashboardDetails"

function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <DashboardDeatils />
    </div>
  )
}

export default Dashboard