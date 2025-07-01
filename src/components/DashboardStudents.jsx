import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiClipboard, FiPlus, FiEdit, FiTrash } from "react-icons/fi";
import Pagination from "./Pagination";

function DashboardStudents() {
  const [students, setStudents] = useState([]);
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
  // handle load student by ID
  const handleEditSearch = () => {
    const found = students.find((s) => s.studentId === editIdInput.trim());
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

  // PUT
  const handleEditStudent = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.put(`/api/students/${newStudent.studentId}`, newStudent, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("อัปเดตข้อมูลเรียบร้อย");
      setShowEdit(false);
      setIsEditMode(false);
      setEditIdInput("");
      setNewStudent({ studentId: "", studentName: "", department: "", password: "" });
      fetchStudents();
    } catch (err) {
      alert("อัปเดตข้อมูลไม่สำเร็จ");
    }
  };

  // GET
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
      setError("โหลดข้อมูลล้มเหลว");
    } finally {
      setLoading(false);
    }
  };

  // POST 
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
      alert("เพิ่มนักศึกษาไม่สำเร็จ");
    }
  };

  // DEL
  const handleDeleteStudent = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`/api/students/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowDelete(false);
      setDeleteId("");
      fetchStudents();
    } catch (err) {
      console.log(err)
      alert("ไม่พบนักศึกษาหรือเกิดข้อผิดพลาด");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const indexOfLast = currentPage * pageSize;
  const indexOfFirst = indexOfLast - pageSize;
  const currentStudents = students.slice(indexOfFirst, indexOfLast);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FiClipboard className="text-xl" />
          รายชื่อนักศึกษา
        </h2>

        <div className="flex space-x-2">
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm">
            <FiPlus />
            เพื่ม
          </button>

          <button
            onClick={() => setShowEdit(true)}
            className="flex items-center gap-1 px-3 py-1.5 border rounded hover:bg-gray-200 transition text-sm">
            <FiEdit />
            แก้ไข
          </button>

          <button
            onClick={() => setShowDelete(true)}
            className="flex items-center gap-1 px-3 py-1.5 border rounded hover:bg-gray-200 transition text-sm">
            <FiTrash />
            ลบ
          </button>
        </div>
      </div>

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
                  <th className="p-3 text-left  w-80">สาขา</th>
                  <th className="p-3 text-left">รหัสผ่าน</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.map((s, index) => (
                  <tr key={s.studentId} className="bg-white border-b border-gray-300">
                    <td className="p-3 text-center">{indexOfFirst + index + 1}</td>
                    <td className="p-3 text-center">{s.studentId}</td>
                    <td className="p-3 text-left">{s.studentName}</td>
                    <td className="p-3 text-left">{s.department}</td>
                    <td className="p-3 text-left">{s.password}</td>
                  </tr>
                ))}
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
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg relative">
            <h3 className="text-lg font-bold mb-4">เพิ่มนักศึกษา</h3>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">รหัสนักศึกษา</label>
                <input
                  type="text"
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
                  className="w-full border border-gray-300 rounded p-2">
                  <option value="" disabled>-- กรุณาเลือกสาขา --</option>
                  <option value="INFORMATION TECHNOLOGY">INFORMATION TECHNOLOGY</option>
                  <option value="Computer Science">Computer Science</option>
                </select>
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
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
                      <option value="INFORMATION TECHNOLOGY">INFORMATION TECHNOLOGY</option>
                      <option value="Computer Science">Computer Science</option>
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
