import { useState, useEffect } from "react";
import axios from "axios";
import { FiSettings, FiPlus, FiTrash2 } from "react-icons/fi";

function DashboardConfig() {
    const [instructions, setInstructions] = useState([]);
    const [editing, setEditing] = useState(false);
    const [originalData, setOriginalData] = useState(null);
    const [originalInstructions, setOriginalInstructions] = useState([]);

    const [form, setForm] = useState({
        examType: "",
        semester: "",
        academicYear: "",
        subjectCategory: "",
        examDate: "",
        startTime: "",
        endTime: "",
        room: "",
    });

    // Fetch info
    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get("/api/auth/settings", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => {
                if (res.data.data) {
                    const data = res.data.data;
                    setForm({
                        examType: data.examInfo.examType,
                        semester: data.examInfo.semester,
                        academicYear: data.examInfo.academicYear,
                        subjectCategory: data.examSchedule.subjectCategory,
                        examDate: data.examSchedule.examDate?.substring(0, 10),
                        startTime: data.examSchedule.startTime,
                        endTime: data.examSchedule.endTime,
                        room: data.examSchedule.room,
                    });
                    setInstructions(data.instructions || []);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);


    // ฟังก์ชันอัปเดตค่าใน input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // เพิ่มคำชี้แจง
    const addInstruction = () => {
        setInstructions([...instructions, ""]);
    };

    // แก้ไขคำชี้แจงทีละข้อ
    const updateInstruction = (index, value) => {
        const updated = [...instructions];
        updated[index] = value;
        setInstructions(updated);
    };

    // ลบคำชี้แจงข้อใดข้อหนึ่ง
    const removeInstruction = (index) => {
        const updated = instructions.filter((_, i) => i !== index);
        setInstructions(updated);
    };

    //  Save info
    const handleSave = async () => {
        const token = localStorage.getItem("token");
        const payload = {
            examInfo: {
                examType: form.examType,
                semester: form.semester,
                academicYear: form.academicYear,
            },
            examSchedule: {
                subjectCategory: form.subjectCategory,
                examDate: form.examDate,
                startTime: form.startTime,
                endTime: form.endTime,
                room: form.room,
            },
            instructions: instructions,
        };

        try {
            await axios.put("/api/auth/settings", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("บันทึกข้อมูลสำเร็จ");
            setEditing(false);
        } catch (err) {
            console.log(err)
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <div className="space-y-13 w-full">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <FiSettings className="text-xl" />
                        การตั้งค่า
                    </h2>

                    {!editing ? (
                        <button
                            onClick={() => {
                                setEditing(true);
                                setOriginalData(form);
                                setOriginalInstructions(instructions);
                            }}
                            className="px-4 py-2 bg-[#1976D2] hover:bg-[#0C3B69] text-white rounded-lg"
                        >
                            แก้ไข
                        </button>
                    ) : (
                        <div className="flex space-x-3">
                            <button
                                onClick={() => {
                                    setEditing(false);
                                    setForm(originalData);
                                    setInstructions(originalInstructions);
                                }}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500"
                            >
                                บันทึก
                            </button>
                        </div>

                    )}
                </div>

                {/* SECTION 1 */}
                <section className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
                    <h3 className="text-lg font-semibold">ข้อมูลข้อสอบ</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="text-sm text-gray-500">ประเภทข้อสอบ</label>
                            <select
                                name="examType"
                                value={form.examType}
                                onChange={handleChange}
                                disabled={!editing}
                                className={`w-full border border-gray-300 rounded-lg p-2 mt-1 ${!editing ? "appearance-none bg-gray-100" : ""} `}
                                
                            >
                                <option>กลางภาค</option>
                                <option>ปลายภาค</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm text-gray-500">ภาคการศึกษา</label>
                            <select
                                name="semester"
                                value={form.semester}
                                onChange={handleChange}
                                disabled={!editing}
                                className={`w-full border border-gray-300 rounded-lg p-2 mt-1 ${!editing ? "appearance-none bg-gray-100" : ""}`}
                            >
                                <option>ภาคต้น</option>
                                <option>ภาคปลาย</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm text-gray-500">ปีการศึกษา</label>
                            <input
                                name="academicYear"
                                value={form.academicYear}
                                onChange={handleChange}
                                disabled={!editing}
                                className={`w-full border border-gray-300 rounded-lg p-2 mt-1 ${!editing ? "bg-gray-100" : ""}`}
                            />
                        </div>
                    </div>
                </section>

                {/* SECTION 2 */}
                <section className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
                    <h3 className="text-lg font-semibold">วันและสถานที่สอบ</h3>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        <div>
                            <label className="text-sm text-gray-500">หมวดวิชา</label>
                            <input
                                name="subjectCategory"
                                value={form.subjectCategory}
                                onChange={handleChange}
                                disabled={!editing}
                                className={`w-full border border-gray-300 rounded-lg p-2 mt-1  ${!editing ? "bg-gray-100" : ""}`}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-500">วันสอบ</label>
                            <input
                                type="date"
                                name="examDate"
                                value={form.examDate}
                                onChange={handleChange}
                                disabled={!editing}
                                className={`w-full border border-gray-300 rounded-lg p-2 mt-1  ${!editing ? "bg-gray-100" : ""}`}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-500">เวลาเริ่มสอบ</label>
                            <input
                                type="time"
                                name="startTime"
                                value={form.startTime}
                                onChange={handleChange}
                                disabled={!editing}
                                className={`w-full border border-gray-300 rounded-lg p-2 mt-1  ${!editing ? "bg-gray-100" : ""}`}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-500">เวลาสิ้นสุด</label>
                            <input
                                type="time"
                                name="endTime"
                                value={form.endTime}
                                onChange={handleChange}
                                disabled={!editing}
                                className={`w-full border border-gray-300 rounded-lg p-2 mt-1  ${!editing ? "bg-gray-100" : ""}`}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-500">ห้องสอบ</label>
                            <input
                                name="room"
                                value={form.room}
                                onChange={handleChange}
                                disabled={!editing}
                                className={`w-full border border-gray-300 rounded-lg p-2 mt-1  ${!editing ? "bg-gray-100" : ""}`}
                            />
                        </div>
                    </div>
                </section>

                {/* SECTION 3 */}
                <section className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">คำชี้แจง</h3>
                        {editing && (
                            <button
                                onClick={addInstruction}
                                className="flex items-center gap-2 px-3 py-2 bg-[#1976D2] hover:bg-[#0C3B69] text-white rounded-lg"
                            >
                                <FiPlus /> เพิ่มคำชี้แจง
                            </button>
                        )}
                    </div>

                    {instructions.map((inst, index) => (
                        <div key={index} className="flex gap-3 items-center">
                            <input
                                value={inst}
                                onChange={(e) => updateInstruction(index, e.target.value)}
                                disabled={!editing}
                                className={`flex-1 border border-gray-300 rounded-lg p-2 ${!editing ? "bg-gray-100 " : ""}`}
                                placeholder={`คำชี้แจงข้อที่ ${index + 1}`}
                            />
                            {editing && (
                                <button onClick={() => removeInstruction(index)} className="text-red-500 hover:text-red-600">
                                    <FiTrash2 size={20} />
                                </button>
                            )}
                        </div>
                    ))}
                </section>

            </div>
        </div>
    );
}

export default DashboardConfig;
