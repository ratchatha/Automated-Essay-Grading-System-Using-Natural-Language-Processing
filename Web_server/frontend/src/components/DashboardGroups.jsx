import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { BsPencilSquare } from "react-icons/bs";
import { FaLayerGroup } from "react-icons/fa";
import { FiPlus, FiEdit, FiTrash } from "react-icons/fi";
import Pagination from "./Pagination";

function DashboardGroups() {
    const [groups, setGroups] = useState([]);
    const [students, setStudents] = useState([]);
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showSelectDelete, setShowSeclectDelete] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterDept, setFilterDept] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

    const [selectedGroup, setSelectedGroup] = useState(null);
    const [showSelectEdit, setShowSelectEdit] = useState(false);

    const [isEditMode, setIsEditMode] = useState(false);
    const [editGroupInput, setEditGroupInput] = useState("");
    const [deleteGroupId, setDeleteGroupId] = useState("");


    const [newGroup, setNewGroup] = useState({
        groupId: "",
        groupName: "",
        students: [],
        exams: ""
    });
    const [editGroup, setEditGroup] = useState({
        groupId: "",
        groupName: "",
        students: [],
        exams: [],
    });

    // get group
    const fetchGroups = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            const res = await axios.get("/api/auth/group", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setGroups(res.data || []);
            setError(null);
        } catch (err) {
            console.error("โหลดกลุ่มล้มเหลว:", err);
            setError("ไม่สามารถโหลดข้อมูลกลุ่มได้");
        } finally {
            setLoading(false);
        }
    };

    // get student
    const fetchStudents = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            const res = await axios.get("/api/students", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStudents(res.data);
        } catch (err) {
            setError("โหลดข้อมูลนักศึกษาล้มเหลวโปรดลองใหม่อีกครั้ง");
        } finally {
            setLoading(false);
        }
    };

    // Fetch exams
    const fetchExams = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            const res = await axios.get("/api/auth/exams", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setExams(res.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.error || "เกิดข้อผิดพลาดในการโหลดข้อมูลข้อสอบ");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
        fetchStudents();
        fetchExams();
    }, []);
    // ค้นหากลุ่มก่อนแก้ไข
    const handleSearchGroup = async () => {
        if (!editGroupInput || editGroupInput.trim() === "") {
            alert("กรุณากรอกรหัสกลุ่ม");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`/api/auth/group/${editGroupInput}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data) {
                const examValue = Array.isArray(res.data.exams) ? res.data.exams[0]?._id || res.data.exams[0] || "" : res.data.exams?._id || res.data.exams || "";
                setEditGroup({
                    _id: res.data._id,
                    groupId: res.data.groupId,
                    groupName: res.data.groupName,
                    exams: examValue,
                    students: res.data.students.map((s) => s._id),
                });
                setIsEditMode(true);
            } else {
                alert("ไม่พบกลุ่มที่ระบุ");
            }
        } catch (err) {
            alert((err.response?.data?.error) || "เกิดข้อผิดพลาดในการค้นหากลุ่ม");
            console.error(err.response?.data?.error);
        }
    };

    // ฟังก์ชันบันทึกการแก้ไข
    const handleEditGroupSubmit = async (e, groupData) => {
        if (e) e.preventDefault();

        try {
            const group = groupData || editGroup;
            const token = localStorage.getItem("token");

            const payload = {
                ...group,
                students: Array.isArray(group.students)
                    ? group.students.map((s) => (typeof s === "object" ? s._id : s))
                    : [],
                exams: Array.isArray(group.exams)
                    ? group.exams.map((ex) => (typeof ex === "object" ? ex._id : ex))
                    : [],
            };

            await axios.put(`/api/auth/group/${group.groupId}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("บันทึกการแก้ไขกลุ่มเรียบร้อยแล้ว");

            // ปิด modal และ reset state
            setShowEdit(false);
            setShowSelectEdit(false);
            setIsEditMode(false);
            setEditGroupInput("");
            setEditGroup({ groupId: "", groupName: "", exams: [], students: [] });
            setSelectedGroup(null);

            fetchGroups(); // โหลดกลุ่มใหม่
        } catch (err) {
            alert("ไม่สามารถบันทึกการแก้ไขได้");
            console.error(err.response?.data?.error || err);
        }
    };

    // add group
    const handleAddGroup = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            await axios.post("/api/auth/group", newGroup, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("เพิ่มกลุ่มสำเร็จ");
            fetchGroups();
            setShowAdd(false);
            setNewGroup({ groupId: "", groupName: "", students: [], exams: "" });
        } catch (err) {
            alert(err.response?.data?.error);
        }
    }

    // del group
    const handleDeleteGroup = async () => {

        if (!deleteGroupId.trim()) {
            alert("กรุณากรอกรหัสกลุ่ม");
            return;
        }

        const token = localStorage.getItem("token");
        try {
            await axios.delete(`/api/auth/group/${deleteGroupId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert(`ลบกลุ่ม ${deleteGroupId} สำเร็จ`);
            setShowDelete(false);
            setDeleteGroupId("");
            fetchGroups(); // โหลดข้อมูลใหม่
        } catch (err) {
            console.error("ลบกลุ่มล้มเหลว:", err);
            alert(err.response?.data?.error || "เกิดข้อผิดพลาดในการลบกลุ่ม");
        }
    };

    // del seclet group
    const handleSeclectDeleteGroup = async () => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`/api/auth/group/${selectedGroup.groupId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // อัปเดต state ของกลุ่มหลังจากลบ
            setGroups(groups.filter(g => g.groupId !== selectedGroup.groupId));
            setShowDelete(false);
            setSelectedGroup(null);
            alert("ลบกลุ่มสำเร็จ");
        } catch (err) {
            console.error("ลบกลุ่มล้มเหลว:", err);
            alert("เกิดข้อผิดพลาดในการลบกลุ่ม");
        }
    };

    // filter student and department
    const filteredStudents = useMemo(() => {
        return students.filter((student) => {
            const matchesSearch =
                student.studentId.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                student.studentName.toLowerCase().includes(debouncedSearch.toLowerCase());

            const matchesDept = filterDept ? student.department === filterDept : true;

            return matchesSearch && matchesDept;
        });
    }, [students, debouncedSearch, filterDept]);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);


    const currentGroups = groups

    return (
        <div className="space-y-6">
            {error ? (
                <p className="text-red-500">{error}</p>
            ) : loading ? (
                <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <FaLayerGroup className="text-lg" />
                            กลุ่มทั้งหมด
                        </h2>

                        <div className="flex items-center gap-2 flex-shrink-0">
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
                                <BsPencilSquare />
                                แก้ไข
                            </button>
                            <button
                                onClick={() => setShowDelete(true)}
                                className="flex items-center gap-1 px-3 py-2 border border-[#BE1515] text-red-600 rounded hover:bg-[#BE1515] hover:text-white transition text-sm"
                            >
                                <FiTrash />
                                ลบ
                            </button>
                        </div>
                    </div>

                    {/* card view */}
                    {currentGroups.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {currentGroups.map((group, index) => (
                                <div
                                    key={group._id}
                                    className="bg-white border border-gray-300 rounded-xl shadow hover:shadow-md transition duration-200 p-4"
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="text-lg font-bold text-[#00A859]">
                                            {group.groupName || "ไม่มีชื่อกลุ่ม"}
                                        </h3>
                                        <span className="text-sm text-gray-500">
                                            {index + 1}
                                        </span>
                                    </div>

                                    <div className="text-gray-700 space-y-1">
                                        <p>
                                            <span className="font-semibold text-gray-700">รหัสกลุ่ม:</span>{" "}
                                            {group.groupId}
                                        </p>
                                        <p>
                                            <span className="font-semibold text-gray-700">จำนวนสมาชิก:</span>{" "}
                                            {group.students?.length || 0} คน
                                        </p>
                                    </div>

                                    <div className="mt-4 flex justify-end gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedGroup(group);
                                                setShowSelectEdit(true);
                                            }}
                                            className="text-sm px-3 py-1 border border-[#00A859] text-[#00A859] rounded hover:bg-[#00A859] hover:text-white transition"
                                        >
                                            แก้ไข
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedGroup(group);
                                                setShowSeclectDelete(true)
                                            }}
                                            className="text-sm px-3 py-1 border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition"
                                        >
                                            ลบ
                                        </button>
                                    </div>

                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 mt-10">
                            ไม่มีพบกลุ่ม
                        </div>
                    )}

                </>

            )}

            {showAdd && (
                <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-xl w-[95%] max-w-4xl shadow-lg relative overflow-y-auto max-h-[90vh]">
                        <h3 className="text-lg font-bold mb-4">เพิ่มกลุ่ม</h3>

                        <form onSubmit={handleAddGroup} className="space-y-4">
                            <div>
                                <label className="block mb-1 font-medium">รหัสกลุ่ม</label>
                                <input
                                    type="text"
                                    placeholder="กรอกรหัสกลุ่ม"
                                    value={newGroup.groupId}
                                    onChange={(e) =>
                                        setNewGroup({ ...newGroup, groupId: e.target.value })
                                    }
                                    className="w-full border border-gray-300 rounded p-2"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">ชื่อกลุ่ม</label>
                                <input
                                    type="text"
                                    placeholder="กรอกชื่อกลุ่ม"
                                    value={newGroup.groupName}
                                    onChange={(e) =>
                                        setNewGroup({ ...newGroup, groupName: e.target.value })
                                    }
                                    className="w-full border border-gray-300 rounded p-2"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">เลือกข้อสอบสำหรับกลุ่มนี้</label>
                                <select
                                    value={newGroup.exams || ""}
                                    onChange={(e) => setNewGroup({ ...newGroup, exams: [e.target.value] })}
                                    className="border border-gray-300 rounded p-2 text-sm w-full"
                                >
                                    <option value="">-- เลือกข้อสอบ --</option>
                                    {exams.map((exam) => (
                                        <option key={exam._id} value={exam._id}>
                                            {exam.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">เลือกนักศึกษาที่ต้องการเพิ่มในกลุ่ม</label>

                                {/* ส่วนค้นหาและตัวกรอง */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                                    {/* ช่องค้นหา */}
                                    <input
                                        type="text"
                                        placeholder="ค้นหาด้วยรหัสหรือชื่อ"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="flex-1 border border-gray-300 rounded p-2 text-sm w-full"
                                    />

                                    <select
                                        value={filterDept}
                                        onChange={(e) => setFilterDept(e.target.value)}
                                        className="border border-gray-300 rounded p-2 text-sm"
                                    >
                                        <option value="">ทั้งหมด</option>
                                        <option value="COMPUTER SCIENCE">COMPUTER SCIENCE</option>
                                        <option value="INFORMATION TECHNOLOGY">INFORMATION TECHNOLOGY</option>
                                        <option value="DATA SCIENCE">DATA SCIENCE</option>
                                    </select>

                                    {/* ปุ่มเลือกทั้งหมด / ยกเลิก */}
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setNewGroup({
                                                    ...newGroup,
                                                    students: filteredStudents.map((s) => s._id),
                                                })
                                            }
                                            className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                                        >
                                            เลือกทั้งหมด
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setNewGroup({ ...newGroup, students: [] })}
                                            className="px-3 py-2 bg-gray-100 text-sm rounded border border-gray-300 rounded hover:bg-gray-200 transition "
                                        >
                                            ยกเลิกทั้งหมด
                                        </button>
                                    </div>
                                </div>

                                {/* ตารางนักศึกษา */}
                                <div className="overflow-x-auto rounded-lg border border-gray-300 mt-2 max-h-64 overflow-y-auto">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead className="bg-gray-100 sticky top-0 z-10">
                                            <tr>
                                                <th className="px-4 py-2 text-center w-12 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                                    เลือก
                                                </th>
                                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                                    รหัสนักศึกษา
                                                </th>
                                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                                    ชื่อ
                                                </th>
                                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                                    สาขา
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredStudents.length > 0 ? (
                                                filteredStudents.map((student) => (
                                                    <tr key={student._id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-2 text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={newGroup.students.includes(student._id)}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setNewGroup({ ...newGroup, students: [...newGroup.students, student._id], });
                                                                    } else {
                                                                        setNewGroup({
                                                                            ...newGroup,
                                                                            students: newGroup.students.filter(
                                                                                (id) => id !== student._id
                                                                            ),
                                                                        });
                                                                    }
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-4 py-2 text-sm text-gray-700">
                                                            {student.studentId}
                                                        </td>
                                                        <td className="px-4 py-2 text-sm text-gray-700">
                                                            {student.studentName}
                                                        </td>
                                                        <td className="px-4 py-2 text-sm text-gray-700">
                                                            {student.department}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="4"
                                                        className="text-center py-4 text-gray-500 text-sm"
                                                    >
                                                        ไม่พบนักศึกษาที่ตรงกับการค้นหา
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>

                                    </table>
                                </div>


                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAdd(false);
                                        setNewGroup({ groupId: "", groupName: "", students: [], exams: "" });
                                        setSearchTerm("");
                                        setFilterDept("");
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
                    <div className="bg-white p-6 rounded-xl w-[95%] max-w-5xl shadow-lg relative overflow-y-auto max-h-[90vh]">
                        {!isEditMode ? (
                            <>
                                <h3 className="text-lg font-bold mb-4">ระบุรหัสกลุ่มเพื่อแก้ไข</h3>
                                <input
                                    type="text"
                                    value={editGroupInput}
                                    onChange={(e) => setEditGroupInput(e.target.value)}
                                    placeholder="กรอกรหัสกลุ่ม"
                                    className="w-full border border-gray-300 rounded p-2 mb-4"
                                />
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setShowEdit(false);
                                            setEditGroupInput("");
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        onClick={handleSearchGroup}
                                        className="px-4 py-2 bg-[#1976D2] hover:bg-[#0C3B69] text-white rounded"
                                    >
                                        ถัดไป
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>

                                <h3 className="text-lg font-bold mb-4">แก้ไขข้อมูลกลุ่ม</h3>
                                <form onSubmit={handleEditGroupSubmit} className="space-y-4">

                                    <div>
                                        <label className="block mb-1 font-medium">รหัสกลุ่ม</label>
                                        <input
                                            type="text"
                                            value={editGroup.groupId}
                                            disabled
                                            onChange={(e) => setEditGroup({ ...editGroup, groupId: e.target.value })}
                                            className="w-full border border-gray-300 rounded p-2 bg-gray-100"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 font-medium">ชื่อกลุ่ม</label>
                                        <input
                                            type="text"
                                            value={editGroup.groupName}
                                            onChange={(e) => setEditGroup({ ...editGroup, groupName: e.target.value })}
                                            className="w-full border border-gray-300 rounded p-2"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 font-medium">ข้อสอบที่ใช้ในกลุ่ม</label>
                                        <select
                                            value={editGroup.exams || ""}
                                            onChange={(e) => setEditGroup({ ...editGroup, exams: [e.target.value] })}
                                            className="w-full border border-gray-300 rounded p-2"
                                        >
                                            <option value="">-- เลือกข้อสอบ --</option>
                                            {exams.map((exam) => (
                                                <option key={exam._id} value={exam._id}>
                                                    {exam.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>


                                    <div>
                                        <label className="block mb-1 font-medium">เลือกนักศึกษาที่ต้องการแก้ไขในกลุ่ม</label>

                                        {/* ส่วนค้นหาและตัวกรอง */}
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                                            <input
                                                type="text"
                                                placeholder="ค้นหาด้วยรหัสหรือชื่อ"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="flex-1 border border-gray-300 rounded p-2 text-sm w-full"
                                            />

                                            <select
                                                value={filterDept}
                                                onChange={(e) => setFilterDept(e.target.value)}
                                                className="border border-gray-300 rounded p-2 text-sm"
                                            >
                                                <option value="">ทั้งหมด</option>
                                                <option value="COMPUTER SCIENCE">COMPUTER SCIENCE</option>
                                                <option value="INFORMATION TECHNOLOGY">INFORMATION TECHNOLOGY</option>
                                                <option value="DATA SCIENCE">DATA SCIENCE</option>
                                            </select>

                                            {/* ปุ่มเลือกทั้งหมด / ยกเลิก */}
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setEditGroup({
                                                            ...editGroup,
                                                            students: filteredStudents.map((s) => s._id),
                                                        })
                                                    }
                                                    className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                                                >
                                                    เลือกทั้งหมด
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setEditGroup({ ...editGroup, students: [] })}
                                                    className="px-3 py-2 bg-gray-100 text-sm rounded border border-gray-300 rounded hover:bg-gray-200 transition "
                                                >
                                                    ยกเลิกทั้งหมด
                                                </button>
                                            </div>
                                        </div>

                                        {/* ตารางนักศึกษา */}
                                        <div className="overflow-x-auto rounded-lg border border-gray-300 mt-2 max-h-64 overflow-y-auto">
                                            <table className="min-w-full divide-y divide-gray-300">
                                                <thead className="bg-gray-100 sticky top-0 z-10">
                                                    <tr>
                                                        <th className="px-4 py-2 text-center w-12 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                                            เลือก
                                                        </th>
                                                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                                            รหัสนักศึกษา
                                                        </th>
                                                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                                            ชื่อ
                                                        </th>
                                                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                                            สาขา
                                                        </th>
                                                    </tr>
                                                </thead>

                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {filteredStudents.length > 0 ? (
                                                        filteredStudents.map((student) => (
                                                            <tr key={student._id} className="hover:bg-gray-50">
                                                                <td className="px-4 py-2 text-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={editGroup.students.includes(student._id)}
                                                                        onChange={(e) => {
                                                                            if (e.target.checked) {
                                                                                setEditGroup({
                                                                                    ...editGroup,
                                                                                    students: [...editGroup.students, student._id],
                                                                                });
                                                                            } else {
                                                                                setEditGroup({
                                                                                    ...editGroup,
                                                                                    students: editGroup.students.filter(
                                                                                        (id) => id !== student._id
                                                                                    ),
                                                                                });
                                                                            }
                                                                        }}
                                                                    />
                                                                </td>
                                                                <td className="px-4 py-2 text-sm text-gray-700">
                                                                    {student.studentId}
                                                                </td>
                                                                <td className="px-4 py-2 text-sm text-gray-700">
                                                                    {student.studentName}
                                                                </td>
                                                                <td className="px-4 py-2 text-sm text-gray-700">
                                                                    {student.department}
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td
                                                                colSpan="4"
                                                                className="text-center py-4 text-gray-500 text-sm"
                                                            >
                                                                ไม่พบนักศึกษาที่ตรงกับการค้นหา
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>

                                            </table>
                                        </div>

                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowEdit(false);
                                                setIsEditMode(false);
                                                setEditGroupInput("");
                                                setEditGroup({ groupName: "", exams: [], students: [] });
                                                setSearchTerm("");
                                                setFilterDept("");
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

            {showSelectEdit && selectedGroup && (
                <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-xl w-[95%] max-w-5xl shadow-lg relative overflow-y-auto max-h-[90vh]">
                        <h3 className="text-lg font-bold mb-4">แก้ไขข้อมูลกลุ่ม</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleEditGroupSubmit(e, selectedGroup);
                                setShowSelectEdit(false);
                            }}
                            className="space-y-4"
                        >
                            {/* รหัสกลุ่ม */}
                            <div>
                                <label className="block mb-1 font-medium">รหัสกลุ่ม</label>
                                <input
                                    type="text"
                                    value={selectedGroup.groupId}
                                    disabled
                                    className="w-full border border-gray-300 rounded p-2 bg-gray-100"
                                />
                            </div>

                            {/* ชื่อกลุ่ม */}
                            <div>
                                <label className="block mb-1 font-medium">ชื่อกลุ่ม</label>
                                <input
                                    type="text"
                                    value={selectedGroup.groupName}
                                    onChange={(e) =>
                                        setSelectedGroup({ ...selectedGroup, groupName: e.target.value })
                                    }
                                    className="w-full border border-gray-300 rounded p-2"
                                    required
                                />
                            </div>

                            {/* เลือกข้อสอบ */}
                            <div>
                                <label className="block mb-1 font-medium">ข้อสอบที่ใช้ในกลุ่ม</label>
                                <select
                                    value={selectedGroup.exams?.[0]?._id || ""}
                                    onChange={(e) => {
                                        const selectedExam = exams.find((ex) => ex._id === e.target.value);
                                        setSelectedGroup({ ...selectedGroup, exams: [selectedExam] });
                                    }}
                                    className="w-full border border-gray-300 rounded p-2"
                                >
                                    <option value="">-- เลือกข้อสอบ --</option>
                                    {exams.map((exam) => (
                                        <option key={exam._id} value={exam._id}>
                                            {exam.title}
                                        </option>
                                    ))}
                                </select>

                            </div>


                            <div>
                                <label className="block mb-1 font-medium">เลือกนักศึกษาที่ต้องการแก้ไขในกลุ่ม</label>

                                {/* ส่วนค้นหาและตัวกรอง */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                                    <input
                                        type="text"
                                        placeholder="ค้นหาด้วยรหัสหรือชื่อ"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="flex-1 border border-gray-300 rounded p-2 text-sm w-full"
                                    />

                                    <select
                                        value={filterDept}
                                        onChange={(e) => setFilterDept(e.target.value)}
                                        className="border border-gray-300 rounded p-2 text-sm"
                                    >
                                        <option value="">ทั้งหมด</option>
                                        <option value="COMPUTER SCIENCE">COMPUTER SCIENCE</option>
                                        <option value="INFORMATION TECHNOLOGY">INFORMATION TECHNOLOGY</option>
                                        <option value="DATA SCIENCE">DATA SCIENCE</option>
                                    </select>

                                    {/* ปุ่มเลือกทั้งหมด / ยกเลิก */}
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSelectedGroup({
                                                    ...selectedGroup, students: [...selectedGroup.students, ...filteredStudents.filter((s) => !selectedGroup.students.some((sel) => sel._id === s._id)),],
                                                })

                                            }
                                            className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                                        >
                                            เลือกทั้งหมด
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedGroup({ ...selectedGroup, students: [] })}
                                            className="px-3 py-2 bg-gray-100 text-sm rounded border border-gray-300 rounded hover:bg-gray-200 transition "
                                        >
                                            ยกเลิกทั้งหมด
                                        </button>
                                    </div>

                                </div>

                                {/* ตารางนักศึกษา */}
                                <div className="overflow-x-auto rounded-lg border border-gray-300 mt-2 max-h-64 overflow-y-auto">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead className="bg-gray-100 sticky top-0 z-10">
                                            <tr>
                                                <th className="px-4 py-2 text-center w-12 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                                    เลือก
                                                </th>
                                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                                    รหัสนักศึกษา
                                                </th>
                                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                                    ชื่อ
                                                </th>
                                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                                    สาขา
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredStudents.length > 0 ? (
                                                filteredStudents.map((student) => (
                                                    <tr key={student._id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-2 text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedGroup.students.some((s) => s._id === student._id)}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setSelectedGroup({
                                                                            ...selectedGroup,
                                                                            students: [...selectedGroup.students, student],
                                                                        });
                                                                    } else {
                                                                        setSelectedGroup({
                                                                            ...selectedGroup,
                                                                            students: selectedGroup.students.filter(
                                                                                (s) => s._id !== student._id
                                                                            ),
                                                                        });
                                                                    }
                                                                }}
                                                            />

                                                        </td>
                                                        <td className="px-4 py-2 text-sm text-gray-700">
                                                            {student.studentId}
                                                        </td>
                                                        <td className="px-4 py-2 text-sm text-gray-700">
                                                            {student.studentName}
                                                        </td>
                                                        <td className="px-4 py-2 text-sm text-gray-700">
                                                            {student.department}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="4"
                                                        className="text-center py-4 text-gray-500 text-sm"
                                                    >
                                                        ไม่พบนักศึกษาที่ตรงกับการค้นหา
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>

                                    </table>
                                </div>

                            </div>

                            {/* ปุ่มบันทึก / ยกเลิก */}
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowSelectEdit(false);
                                        setSelectedGroup(null);
                                        setSearchTerm("");
                                        setFilterDept("");
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
                    </div>
                </div>
            )}

            {showDelete && (
                <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-xl w-[95%] max-w-md shadow-lg relative">
                        <h3 className="text-lg font-bold mb-4 ">ลบกลุ่ม</h3>

                        <input
                            type="text"
                            placeholder="กรอกรหัสกลุ่ม"
                            value={deleteGroupId}
                            onChange={(e) => setDeleteGroupId(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2 mb-4" s
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setShowDelete(false);
                                    setDeleteGroupId("");
                                }}
                                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                            >
                                ยกเลิก
                            </button>

                            <button
                                onClick={() => {
                                    const confirmed = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบกลุ่มนี้");
                                    if (confirmed) {
                                        handleDeleteGroup();
                                    }
                                }}
                                className="px-4 py-2 bg-[#BE1515] text-white rounded hover:bg-[#850D0D]"
                            >
                                ยืนยันการลบ
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showSelectDelete && selectedGroup && (
                <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-xl shadow-md w-96">
                        <h2 className="text-lg font-bold mb-4">ยืนยันการลบกลุ่ม</h2>
                        <p>คุณต้องการลบกลุ่ม {selectedGroup.groupName} ใช่หรือไม่?</p>
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => setShowSeclectDelete(false)}
                                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleSeclectDeleteGroup}
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

export default DashboardGroups;
