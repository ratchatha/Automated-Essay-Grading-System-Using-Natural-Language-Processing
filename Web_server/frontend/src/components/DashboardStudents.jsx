import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiClipboard, FiPlus, FiEdit, FiTrash, FiSearch } from "react-icons/fi";
import Pagination from "./Pagination";
import CsvUploader from "../components/CsvUploader";
import ExportPDF from "../components/ExportPDF";
import SearchBar from "../components/SearchBar";

function DashboardStudents() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [newStudent, setNewStudent] = useState({
    studentId: "",
    studentName: "",
    department: "",
    password: ""
  });
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editIdInput, setEditIdInput] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  // Search and edit
  const handleEditSearch = () => {
    const found = students.find((s) => s.studentId === editIdInput.trim());

    if (!editIdInput.trim()) {
      alert("กรุณากรอกรหัสนักศึกษา");
      return;
    }

    if (!found) {
      alert("ไม่พบนักศึกษาที่ระบุ");
      return;
    }

    setNewStudent({
      studentId: found.studentId,
      studentName: found.studentName,
      department: found.department,
      password: found.password || "",
    });

    setIsEditMode(true);
  };

  // search name id
  const handleSearch = (term) => {
    if (!term.trim()) {
      setFilteredStudents(students);
      return;
    }

    const keyword = term.toLowerCase();
    const results = students.filter((s) => s.studentName?.toLowerCase().includes(keyword) || s.studentId?.toString().includes(keyword));
    setFilteredStudents(results);
    setCurrentPage(1); // รีเซ็ต pagination เมื่อค้นหาใหม่
  };

  // sort order
  const handleSortChange = (order) => {
    let sorted = [...filteredStudents];

    switch (order) {
      case "name-asc":
        sorted.sort((a, b) => a.studentName.localeCompare(b.studentName));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.studentName.localeCompare(a.studentName));
        break;
      case "id-asc":
        sorted.sort((a, b) => a.studentId.localeCompare(b.studentId));
        break;
      case "id-desc":
        sorted.sort((a, b) => b.studentId.localeCompare(a.studentId));
        break;
      default:
        sorted = [...students];
        break;
    }

    setFilteredStudents(sorted);
  };

  // GET Student
  const fetchStudents = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("/api/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
      setCurrentPage(1);
    } catch (err) {
      setError("โหลดข้อมูลนักศึกษาล้มเหลวโปรดลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  // POST Student
  const handleAddStudent = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post("/api/students/create", newStudent, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowAdd(false);
      setNewStudent({ studentId: "", studentName: "", department: "", password: "" });
      fetchStudents();
      alert("เพิ่มนักศึกษาสำเร็จ");
    } catch (err) {
      const errorMsg = err.response?.data?.error;
      alert(errorMsg);
    }
  };

  // PUT Student
  const handleEditStudent = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.put(`/api/students/${newStudent.studentId}`, newStudent, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("อัปเดตข้อมูลเรียบร้อย");
      handleEditStudentAnswer();
      setShowEdit(false);
      setIsEditMode(false);
      setEditIdInput("");
      setNewStudent({ studentId: "", studentName: "", department: "", password: "" });
      fetchStudents();
    } catch (err) {
      const errorMsg = err.response?.data?.error;
      alert(errorMsg);
    }
  };

  // DEL Student
  const handleDeleteStudent = async () => {

    if (!deleteId.trim()) {
      alert("กรุณากรอกรหัสนักศึกษา");
      return;
    }
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`/api/students/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("ลบนักศึกษาเรียบร้อยแล้ว");
      setShowDelete(false);
      setDeleteId("");
      fetchStudents();
      await handleDeleteStudentAnswer(deleteId);
    } catch (err) {
      const errorMsg = err.response?.data?.error;
      alert(errorMsg || 'ไม่พบรหัสนักศึกษา');
    }
  };

  // PUT Student Answer
  const handleEditStudentAnswer = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`/api/auth/answers/${newStudent.studentId}`, newStudent, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      const errorMsg = err.response?.data?.error;
      console.log(errorMsg)
    }
  };

  // DEL Student Answer
  const handleDeleteStudentAnswer = async (deleteAnswerId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`/api/auth/answers/${deleteAnswerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      //alert("ลบคำตอบนักศึกษาเรียบร้อยแล้ว");
    } catch (err) {
      const errorMsg = err.response?.data?.error;
      console.log(errorMsg)
      //alert(errorMsg || "ไม่พบคำตอบของนักศึกษา");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      setFilteredStudents(students);
    }
  }, [students]);

  const indexOfLast = currentPage * pageSize;
  const indexOfFirst = indexOfLast - pageSize;
  const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);

  return (
    <div>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        !loading && (
          <>
            <div className="flex justify-between items-center mb-8 gap-4 w-full overflow-x-auto">
              <h2 className="text-xl font-bold flex items-center gap-2 flex-shrink-0">
                <FiClipboard className="text-xl" />
                รายชื่อนักศึกษา
              </h2>

              <div className="flex-1 min-w-[300px] max-w-3xl">
                <SearchBar onSearch={handleSearch} onSortChange={handleSortChange} />
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <ExportPDF data={filteredStudents} type="list" />
                <button
                  onClick={() => setShowAdd(true)}
                  className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
                >
                  <FiPlus />
                  เพิ่ม
                </button>
                <button
                  onClick={() => setShowEdit(true)}
                  className="flex items-center gap-1 px-3 py-2 border rounded hover:bg-gray-200 transition text-sm"
                >
                  <FiEdit />
                  แก้ไข
                </button>
                <button
                  onClick={() => setShowDelete(true)}
                  className="flex items-center gap-1 px-3 py-2 border border-red-600 text-red-600 rounded hover:bg-[#BE1515] hover:text-white transition text-sm"
                >
                  <FiTrash />
                  ลบ
                </button>
              </div>
            </div>

            <table className="w-full table-fixed bg-gray-50 border border-gray-300 rounded-lg overflow-hidden font-medium">
              <thead className="bg-[#00A859] text-white">
                <tr>
                  <th className="p-3 text-center w-20">ลำดับ</th>
                  <th className="p-3 text-center w-80">รหัสนักศึกษา</th>
                  <th className="p-3 text-left w-80">ชื่อ</th>
                  <th className="p-3 text-left  w-80">สาขา</th>
                  <th className="p-3 text-left">รหัสผ่าน</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.length > 0 ? (
                  currentStudents.map((s, index) => (
                    <tr key={s.studentId} className="bg-white border-b border-gray-300 hover:bg-gray-100 transition">
                      <td className="p-3 text-center">{indexOfFirst + index + 1}</td>
                      <td className="p-3 text-center">{s.studentId}</td>
                      <td className="p-3 text-left">{s.studentName}</td>
                      <td className="p-3 text-left">{s.department}</td>
                      <td className="p-3 text-left">{"*".repeat(s.password?.length || 0)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-gray-500">
                      ไม่พบนักศึกษาที่ค้นหา
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex justify-center items-center mt-4 px-2">
              <Pagination
                currentPage={currentPage}
                pageSize={pageSize}
                totalStudents={students.length}
                onPageChange={(page) => setCurrentPage(page)}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
                onRefresh={fetchStudents}
              />
            </div>
          </>
        )
      )}

      {showAdd && (
        <div className="fixed inset-0 bg-black/30 backdrop-filter-none flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[95%] max-w-3xl shadow-lg relative overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-bold mb-4">เพิ่มนักศึกษา</h3>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">รหัสนักศึกษา</label>
                <input
                  type="text"
                  placeholder="กรอกรหัสนักศึกษา"
                  value={newStudent.studentId}
                  onChange={(e) => setNewStudent({ ...newStudent, studentId: e.target.value })}
                  className="w-full border border-gray-300 rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">ชื่อนักศึกษา</label>
                <input
                  type="text"
                  placeholder="กรอกชื่อนักศึกษา"
                  value={newStudent.studentName}
                  onChange={(e) => setNewStudent({ ...newStudent, studentName: e.target.value })}
                  className="w-full border border-gray-300 rounded p-2"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">รหัสผ่าน</label>
                <input
                  type="text"
                  placeholder="กรอกรหัสผ่าน"
                  value={newStudent.password}
                  onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                  className="w-full border border-gray-300 rounded p-2"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">สาขา</label>
                <select
                  value={newStudent.department}
                  onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
                  className="w-full border border-gray-300 rounded p-2">
                  <option value="" disabled>-- กรุณาเลือกสาขา --</option>
                  <option value="COMPUTER SCIENCE">COMPUTER SCIENCE</option>
                  <option value="INFORMATION TECHNOLOGY">INFORMATION TECHNOLOGY</option>
                  <option value="DATA SCIENCE">DATA SCIENCE</option>
                </select>
              </div>

              <div>
                <CsvUploader
                  onUploadSuccess={() => {
                    setShowAdd(false); // ปิด modal
                    setNewStudent({ studentId: "", studentName: "", department: "", password: "" });
                  }}
                />
              </div>


              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdd(false);
                    setNewStudent({ studentId: "", studentName: "", department: "", password: "" });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-200"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEdit && (
        <div className="fixed inset-0 bg-black/30 backdrop-filter-none flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg relative">
            {!isEditMode ? (
              <>
                <h3 className="text-lg font-bold mb-4">ระบุรหัสนักศึกษาเพื่อแก้ไข</h3>
                <input
                  type="text"
                  value={editIdInput}
                  onChange={(e) => setEditIdInput(e.target.value)}
                  placeholder="กรอกรหัสนักศึกษา"
                  className="w-full border border-gray-300 rounded p-2 mb-4"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowEdit(false);
                      setEditIdInput("");
                    }}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleEditSearch}
                    className="px-4 py-2 bg-[#1976D2] hover:bg-[#0C3B69] text-white rounded"
                  >
                    ถัดไป
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold mb-4">แก้ไขข้อมูลนักศึกษา</h3>
                <form onSubmit={handleEditStudent} className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">รหัสนักศึกษา</label>
                    <input
                      type="text"
                      value={newStudent.studentId}
                      disabled
                      className="w-full border border-gray-300 rounded p-2 bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">ชื่อนักศึกษา</label>
                    <input
                      type="text"
                      value={newStudent.studentName}
                      onChange={(e) => setNewStudent({ ...newStudent, studentName: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">รหัสผ่าน</label>
                    <input
                      type="text"
                      value={newStudent.password}
                      onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">สาขา</label>
                    <select
                      value={newStudent.department}
                      onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2"
                    >
                      <option value="" disabled>-- กรุณาเลือกสาขา --</option>
                      <option value="COMPUTER SCIENCE">COMPUTER SCIENCE</option>
                      <option value="INFORMATION TECHNOLOGY">INFORMATION TECHNOLOGY</option>
                      <option value="DATA SCIENCE">DATA SCIENCE</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEdit(false);
                        setIsEditMode(false);
                        setEditIdInput("");
                        setNewStudent({ studentId: "", studentName: "", department: "", password: "" });
                      }}
                      className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-200"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      บันทึกการแก้ไข
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {showDelete && (
        <div className="fixed inset-0 bg-black/30 backdrop-filter-none flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg relative">
            <h3 className="text-lg font-bold mb-4 ">ลบนักศึกษา</h3>
            <input
              type="text"
              value={deleteId}
              onChange={(e) => setDeleteId(e.target.value)}
              placeholder="กรอกรหัสนักศึกษา"
              className="w-full border border-gray-300 rounded p-2 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowDelete(false);
                  setDeleteId("");
                }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  const confirmed = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบนักศึกษา");
                  if (confirmed) {
                    handleDeleteStudent();
                  }
                }}
                className="px-4 py-2 bg-[#BE1515] text-white rounded hover:bg-[#850D0D]"
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default DashboardStudents;
