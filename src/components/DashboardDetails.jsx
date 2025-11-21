import React, { useState } from "react";
import DashboardStudents from "./DashboardStudents";
import DashboardExams from "./DashboardExams";
import DashboardResults from "./DashboardResults";
import DashboardConfig from "./DashboardConfig";
import DashboardGroups from "./DashboardGroups";
import { MdEditNote } from "react-icons/md";
import { FaUserGraduate, FaRegChartBar } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { MdGroup } from "react-icons/md";

function DashboardDetails() {
  const [activeTab, setActiveTab] = useState("students");

  const renderContent = () => {
    switch (activeTab) {
      case "students":
        return <DashboardStudents />;
      case "groups":
        return <DashboardGroups />;
      case "exams":
        return <DashboardExams />;
      case "summary":
        return <DashboardResults />;
      case "config":
        return <DashboardConfig />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 p-4 shadow-lg">
        <h2 className="text-xl font-bold mb-6 text-[#00A859] text-center">Admin</h2>
        <ul className="space-y-3">
          <li
            className={`cursor-pointer p-3 rounded-lg hover:bg-gray-100 flex items-center gap-2 ${activeTab === "students" ? "bg-gray-200 font-semibold" : ""}`}
            onClick={() => setActiveTab("students")}
          >
            <FaUserGraduate className="text-sm" />
            นักเรียน
          </li>
          <li
            className={`cursor-pointer p-3 rounded-lg hover:bg-gray-100 flex items-center gap-2 ${activeTab === "groups" ? "bg-gray-200 font-semibold" : "" }`}
            onClick={() => setActiveTab("groups")}
          >
            <MdGroup className="text-xl" />
            กลุ่ม
          </li>
          <li
            className={`cursor-pointer p-3 rounded-lg hover:bg-gray-100 flex items-center gap-1 ${activeTab === "exams" ? "bg-gray-200 font-semibold" : ""}`}
            onClick={() => setActiveTab("exams")}
          >
            <MdEditNote className="text-2xl" />
            ข้อสอบ
          </li>
          <li
            className={`cursor-pointer p-3 rounded-lg hover:bg-gray-100 flex items-center gap-2 ${activeTab === "summary" ? "bg-gray-200 font-semibold" : ""}`}
            onClick={() => setActiveTab("summary")}
          >
            <FaRegChartBar className="text-xl" />
            สรุปผล
          </li>
          <li
            className={`cursor-pointer p-3 rounded-lg hover:bg-gray-100 flex items-center gap-2 ${activeTab === "config" ? "bg-gray-200 font-semibold" : ""}`}
            onClick={() => setActiveTab("config")}
          >
            <FiSettings className="text-xl" />
            การตั้งค่า
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">{renderContent()}</div>
    </div>
  );
}

export default DashboardDetails;
