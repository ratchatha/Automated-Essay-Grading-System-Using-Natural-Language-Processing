import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiClipboard } from "react-icons/fi";
import Pagination from "./Pagination";
import { FaRegChartBar  } from "react-icons/fa";

function DashboardResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // เพิ่ม state นี้

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/auth/answers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResults(res.data);
    } catch (err) {
      setError("โหลดข้อมูลล้มเหลว");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FaRegChartBar className="text-xl" />
        สรุปผลการสอบ
      </h2>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        !loading && (
          <>
            <table className="w-full table-fixed bg-gray-50 border border-gray-300 rounded-lg overflow-hidden font-medium">
              <thead className="bg-[#00A859] text-white">
                <tr>
                  <th className="p-3 text-center w-20">ลำดับ</th>
                  <th className="p-3 text-center w-80">รหัส</th>
                  <th className="p-3 text-left w-80">ชื่อ</th>
                  <th className="p-3 text-center w-40">คะแนน</th>
                  <th className="p-3 text-center w-40">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, index) => (
                  <tr
                    key={r.studentId}
                    className="bg-white border-b border-gray-300"
                  >
                    <td className="p-3 text-center">{index + 1}</td>
                    <td className="p-3 text-center">{r.studentId}</td>
                    <td className="p-3 text-left">{r.studentName}</td>
                    <td className="p-3 text-center">{r.answers?.score ?? "-"}</td>
                    <td
                      className={`p-3 text-center font-semibold ${r.status === "ผ่าน"
                        ? "text-green-600"
                        : "text-red-500"
                        }`}
                    >
                      {r.status ?? "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            <div className="flex justify-center items-center mt-4 px-2">
              <Pagination
                currentPage={currentPage}
                pageSize={pageSize}
                totalStudents={results.length}
                onPageChange={(page) => setCurrentPage(page)}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1); // reset page
                }}
                onRefresh={fetchResults}
              />
            </div>
          </>
        )
      )}

    </div>

  );
}

export default DashboardResults;
