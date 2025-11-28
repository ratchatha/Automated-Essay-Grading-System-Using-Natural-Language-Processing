import React, { useEffect, useState } from "react";
import axios from "axios";
import { BsPencilSquare } from "react-icons/bs";
import { FiPlus, FiEdit, FiTrash } from "react-icons/fi";
import ExamForm from "../components/ExamForm";
import CsvUploader from "../components/CsvUploader";
import { FaPlusCircle, FaTrashAlt, FaTrash } from "react-icons/fa"

function DashboardExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  //const [useExam, setUseExam] = useState(null);
  const [selectedExamId, setSelectedExamId] = useState(localStorage.getItem("selectedExamId") || "");

  // Modal states
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // For editing and deleting
  const [editIdInput, setEditIdInput] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  // Form data for add/edit
  const [examForm, setExamForm] = useState({
    examId: "",
    title: "",
    questions: [
      {
        questionId: "Q1",
        questionText: "",
        modelAnswers: [""],
        answersScore: 0,
      },
    ],
    totalAnswersScore: 0,
  });
  const [originalExamData, setOriginalExamData] = useState(null);

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
    fetchExams();
  }, []);

  const getTotalQuestions = (exam) => {
    if (!exam.questions) return 0;
    return exam.questions.length;
  };

  useEffect(() => {
    if (showAdd) {
      setExamForm({
        examId: "",
        title: "",
        questions: [
          {
            questionId: "Q1",
            questionText: "",
            modelAnswers: [""],
            answersScore: 0,
          },
        ],
      });
    }
  }, [showAdd]);

  // Add exam
  const handleAddExam = async (e) => {
    e.preventDefault();

    setExamForm(prev => ({
      ...prev,
      examId: prev.examId.trim()
    }));

    const token = localStorage.getItem("token");
    try {
      await axios.post("/api/auth/exams", examForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("เพิ่มข้อสอบสำเร็จ");
      setShowAdd(false);
      setExamForm({
        examId: "",
        title: "",
        questions: [
          {
            questionId: "Q1",
            questionText: "",
            modelAnswers: [""],
            answersScore: 0,
          },
        ],
        totalAnswersScore: 0,
      });

      fetchExams();
    } catch (err) {
      console.error(" Error add exam:", err);
      const errorMessage = err.response?.data?.message || err.message || "เกิดข้อผิดพลาดในการเพิ่มข้อสอบ กรุณาลองใหม่อีกครั้ง";
      alert(`${errorMessage}`);
    }
  };

  // Search exam for edit
  const handleEditSearch = () => {
    const found = exams.find((ex) => ex.examId === editIdInput.trim());
    if (!found) {
      alert("ไม่พบข้อสอบที่ระบุ");
      return;
    }
    setOriginalExamData(JSON.parse(JSON.stringify(found)));
    setExamForm(JSON.parse(JSON.stringify(found)));
    setIsEditMode(true);
  };

  // Update exam
  const handleEditExam = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.put(`/api/auth/exams/${examForm.examId}`, examForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("อัปเดตข้อมูลข้อสอบเรียบร้อย");
      setShowEdit(false);
      setIsEditMode(false);
      setEditIdInput("");
      setExamForm({
        examId: "",
        title: "",
        questions: [
          {
            questionId: "Q1",
            questionText: "",
            modelAnswers: [""],
            answersScore: 0,
          },
        ],
        totalAnswersScore: 0,
      });
      fetchExams();
    } catch (err) {
      alert("อัปเดตข้อมูลข้อสอบไม่สำเร็จ");
      console.error("Error updating exam:", err);
    }
  };

  // Delete exam
  const handleDeleteExam = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`/api/auth/exams/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("ลบข้อสอบสำเร็จ");
      if (selectedExamId === deleteId.trim()) {
        localStorage.removeItem("selectedExamId");
        setSelectedExamId("")
      }
      setShowDelete(false);
      setDeleteId("");
      fetchExams();
    } catch (err) {
      alert("ลบข้อสอบไม่สำเร็จหรือไม่พบข้อสอบ");
    }
  };


  const handleSelectExam = (exam) => {
    alert(`เลือกข้อสอบ ${exam.examId} สำเร็จ`);
    localStorage.setItem("selectedExamId", exam.examId);
    setSelectedExamId(exam.examId);
  };

  // SelectExamInfo
  if (selectedExam) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BsPencilSquare className="text-xl" />
          ข้อสอบทั้งหมด
        </h2>

        <div className="p-4 bg-white border border-gray-300 rounded-lg shadow">
          <div className="mb-1 font-semibold">{selectedExam.title}</div>
          <p className="text-sm text-gray-600 mb-2">
            รหัส: {selectedExam.examId} | จำนวนคำถาม: {getTotalQuestions(selectedExam)} | คะแนนรวม: {selectedExam.totalAnswersScore}
          </p>

          <div className="space-y-6 text-sm text-gray-800">
            <ol className="space-y-3">
              {selectedExam.questions.map((q, index) => (
                <li key={index}>
                  <div className="p-4 bg-gray-50 border border-gray-300 rounded-lg">
                    <p className="font-bold mb-2">
                      ข้อ {index + 1}: {q.questionText || "ไม่มีข้อความคำถาม"} [{q.answersScore}]
                    </p>

                    {q.modelAnswers && q.modelAnswers.length > 0 && (
                      <div className="font-medium text-green-700 flex">
                        <span className="font-semibold text-green-800 whitespace-nowrap">
                          คำตอบ:
                        </span>
                        <span className="ml-2 break-words text-green-700">
                          {q.modelAnswers.join(", ")}
                        </span>
                      </div>

                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex justify-end">
            <button
              className="mt-4 px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg"
              onClick={() => setSelectedExam(null)}
            >
              ย้อนกลับ
            </button>
          </div>


        </div>
      </div>
    );
  }

  return (
    <div>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        !loading && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BsPencilSquare className="text-xl" />
                ข้อสอบทั้งหมด
              </h2>

              <div className="flex space-x-2">
                <button
                  onClick={() => setShowAdd(true)}
                  className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
                >
                  <FiPlus />
                  เพื่ม
                </button>
                <button
                  onClick={() => setShowEdit(true)}
                  className="flex items-center gap-1 px-3 py-2 border rounded hover:bg-gray-100 transition text-sm"
                >
                  <FiEdit />
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

            <ul className="space-y-3">
              {exams.map((exam) => (
                <li
                  key={exam._id}
                  className={`p-4 border rounded-2xl shadow transition-all duration-200 ${selectedExamId === exam.examId
                    ? "border-green-500 bg-green-50" // 
                    : "border-gray-300 bg-white hover:border-gray-500"
                    }`}
                >
                  <div className="font-semibold">{exam.title}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    รหัส: {exam.examId} | จำนวนคำถาม: {getTotalQuestions(exam)}
                  </div>

                  <div className="flex space-x-4 mt-2">
                    <button
                      onClick={() => setSelectedExam(exam)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      ดูรายละเอียด
                    </button>

                    {/* ปุ่มเลือกข้อสอบ */}
                    <button
                      onClick={() => handleSelectExam(exam)}
                      className="text-[#00A859] hover:underline text-sm"
                    >
                      เลือกข้อสอบ
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )
      )}

      {showAdd && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-3xl shadow-lg relative overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-bold mb-4">เพิ่มข้อสอบ</h3>
            <form onSubmit={handleAddExam} className="space-y-4">
              {/* รหัส & ชื่อข้อสอบ */}
              <div>
                <label className="block mb-1 font-medium">รหัสข้อสอบ</label>
                <input
                  type="text"
                  placeholder="กรอกรหัสข้อสอบ"
                  value={examForm.examId}
                  onChange={(e) => setExamForm({ ...examForm, examId: e.target.value })}
                  className="w-full border border-gray-300 rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">ชื่อข้อสอบ</label>
                <input
                  type="text"
                  placeholder="กรอกชื่อข้อสอบ"
                  value={examForm.title}
                  onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                  className="w-full border border-gray-300 rounded p-2"
                  required
                />
              </div>

              {/* เพิ่มคำถาม */}
              <div>
                <label className="block font-medium mb-1">คำถาม</label>
                {examForm.questions.map((q, index) => (
                  <div key={index} className="mb-4 border border-gray-300 p-3 rounded bg-gray-50">
                    <p className="text mb-1">ข้อ.{index + 1}</p>

                    <input
                      type="text"
                      placeholder={`กรอกคำถาม`}
                      value={q.questionText}
                      onChange={(e) => {
                        const updatedQuestions = [...examForm.questions];
                        updatedQuestions[index].questionText = e.target.value;
                        setExamForm({ ...examForm, questions: updatedQuestions });
                      }}
                      className="w-full mb-2 p-2 border border-gray-300 rounded"
                      required
                    />

                    <label className="block mb-1">คำตอบ</label>
                    <textarea
                      placeholder="กรอกคำตอบ"
                      value={q.modelAnswers[0] || ""}
                      onChange={(e) => {
                        const updatedQuestions = [...examForm.questions];
                        updatedQuestions[index].modelAnswers[0] = e.target.value;
                        setExamForm({ ...examForm, questions: updatedQuestions });
                      }}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />

                    <label className="block mb-1">คะแนน</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      value={q.answersScore ?? ""}
                      onChange={(e) => {
                        const updatedQuestions = [...examForm.questions];
                        updatedQuestions[index].answersScore = Number(e.target.value);
                        setExamForm({ ...examForm, questions: updatedQuestions });
                      }}
                      className="w-20 p-2 border border-gray-300 rounded"
                    />

                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...examForm.questions];
                          updated.splice(index, 1);
                          setExamForm({ ...examForm, questions: updated });
                        }}
                        className="flex items-center gap-2 bg-[#BE1515] hover:bg-[#850D0D] text-white px-4 py-2 rounded-md transition"
                      >
                        <FaTrashAlt size={14} />
                        ลบคำถาม
                      </button>
                    </div>


                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const nextId = `Q${examForm.questions.length + 1}`;
                    setExamForm({
                      ...examForm,
                      questions: [
                        ...examForm.questions,
                        {
                          questionId: nextId,
                          questionText: "",
                          modelAnswers: [""],
                          answersScore: 0,
                        },
                      ],
                    });
                  }}

                  className="flex items-center gap-2 px-3 py-3 text-sm font-medium text-white bg-[#1976D2] hover:bg-[#0C3B69] rounded-md transition"
                >
                  <FaPlusCircle size={16} />
                  เพิ่มคำถาม
                </button>
              </div>

              {/* button */}
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdd(false);
                    setExamForm({
                      examId: "",
                      title: "",
                      questions: [
                        {
                          questionId: "Q1",
                          questionText: "",
                          modelAnswers: [""],
                          answersScore: 0,
                        },
                      ],
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-200"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  onClick={(e) => {
                    const confirmed = window.confirm("คุณต้องการบันทึกข้อสอบนี้หรือไม่?");
                    if (!confirmed) {
                      e.preventDefault();
                    }
                  }}
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
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-3xl shadow-lg relative overflow-y-auto max-h-[90vh]">
            {!isEditMode ? (
              <>
                <h3 className="text-lg font-bold mb-4">ระบุรหัสข้อสอบเพื่อแก้ไข</h3>
                <input
                  type="text"
                  value={editIdInput}
                  onChange={(e) => setEditIdInput(e.target.value)}
                  placeholder="กรอกรหัสข้อสอบ"
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
                <h3 className="text-lg font-bold mb-4">แก้ไขข้อมูลข้อสอบ</h3>
                <form onSubmit={handleEditExam} className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">รหัสข้อสอบ</label>
                    <input
                      type="text"
                      value={examForm.examId}
                      disabled
                      className="w-full border border-gray-300 rounded p-2 bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">ชื่อข้อสอบ</label>
                    <input
                      type="text"
                      value={examForm.title}
                      onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2"
                      required
                    />
                  </div>

                  {/* แก้ไขคำถาม*/}
                  {examForm.questions.map((question, index) => (
                    <div key={index} className="border border-gray-300 rounded p-4 mb-4 bg-gray-50">
                      <label className="block mb-1 font-medium">
                        ข้อ.{index + 1}
                      </label>
                      <input
                        type="text"
                        value={question.questionText}
                        onChange={(e) => {
                          const updatedQuestions = [...examForm.questions];
                          updatedQuestions[index].questionText = e.target.value;
                          setExamForm({ ...examForm, questions: updatedQuestions });
                        }}
                        className="w-full border border-gray-300 rounded p-2 mb-2"
                        placeholder="กรอกคำถาม"
                        required
                      />

                      <label className="block mb-1 font-medium">คำตอบตัวอย่าง</label>
                      {question.modelAnswers.map((ans, ansIndex) => (
                        <div key={ansIndex} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={ans}
                            onChange={(e) => {
                              const updatedQuestions = [...examForm.questions];
                              updatedQuestions[index].modelAnswers[ansIndex] = e.target.value;
                              setExamForm({ ...examForm, questions: updatedQuestions });
                            }}
                            className="w-full border border-gray-300 rounded p-2"
                            placeholder={`กรอกตัวอย่างคำตอบ ${ansIndex + 1}`}
                          />

                          <button
                            type="button"
                            onClick={() => {
                              const updatedQuestions = [...examForm.questions];
                              updatedQuestions[index].modelAnswers.splice(ansIndex, 1);
                              setExamForm({ ...examForm, questions: updatedQuestions });
                            }}
                            className="text-[#BE1515] hover:text-[#850D0D] text-sm"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      ))}

                      <div className="mt-3">
                        <label className="block mb-1 font-medium">คะแนน</label>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={question.answersScore || 0}
                          onChange={(e) => {
                            const updatedQuestions = [...examForm.questions];
                            updatedQuestions[index].answersScore = Number(e.target.value);
                            setExamForm({ ...examForm, questions: updatedQuestions });
                          }}
                          className="w-20 border border-gray-300 rounded p-2"
                          placeholder="0"
                        />
                      </div>

                      <div className="flex justify-between items-center mt-5 border-t border-gray-300 pt-3">

                        <button
                          type="button"
                          onClick={() => {
                            const updatedQuestions = [...examForm.questions];
                            updatedQuestions[index].modelAnswers.push("");
                            setExamForm({ ...examForm, questions: updatedQuestions });
                          }}
                          className="flex items-center gap-2 bg-[#1976D2] hover:bg-[#0C3B69] text-white px-3 py-2 rounded-md transition"
                        >
                          <FaPlusCircle size={14} />
                          เพิ่มคำตอบ
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm("คุณต้องการลบคำถามข้อนี้ใช่หรือไม่?")) {
                              const updatedQuestions = [...examForm.questions];
                              updatedQuestions.splice(index, 1);
                              setExamForm({ ...examForm, questions: updatedQuestions });
                            }
                          }}
                          className="flex items-center gap-2 bg-[#BE1515] hover:bg-[#850D0D] text-white px-3 py-2 rounded-md transition"
                        >
                          <FaTrashAlt size={14} />
                          ลบคำถาม
                        </button>

                      </div>
                    </div>

                  ))}

                  {/* ปุ่มเพื่มคำถาม */}
                  <div className="text-left mb-4">
                    <button
                      type="button"
                      onClick={() => {
                        const newQuestion = {
                          questionId: `Q${examForm.questions.length + 1}`,
                          questionText: "",
                          modelAnswers: [""],
                          answersScore: 0,
                        };
                        setExamForm({
                          ...examForm,
                          questions: [...examForm.questions, newQuestion],
                        });
                      }}

                      className="flex items-center gap-2 px-3 py-3 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition"
                    >
                      <FaPlusCircle size={16} />
                      เพิ่มคำถาม
                    </button>
                  </div>

                  {/* ปุ่มยกเลิก/ยืนยัน */}
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (originalExamData) {
                          setExamForm(JSON.parse(JSON.stringify(originalExamData)));
                        } else {
                          setExamForm({
                            examId: "",
                            title: "",
                            questions: [
                              {
                                questionId: "Q1",
                                questionText: "",
                                modelAnswers: [""],
                                answersScore: 0,
                              },
                            ],
                          });
                        }
                        setShowEdit(false);
                        setIsEditMode(false);
                        setEditIdInput("");
                      }}
                      className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-200 transition"
                    >
                      ยกเลิก
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        if (window.confirm("คุณต้องการบันทึกการแก้ไขใช่หรือไม่?")) {
                          e.target.form.requestSubmit();
                        }
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
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
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg relative">
            <h3 className="text-lg font-bold mb-4">ลบข้อสอบ</h3>
            <input
              type="text"
              value={deleteId}
              onChange={(e) => setDeleteId(e.target.value)}
              placeholder="กรอกรหัสข้อสอบ"
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
                  const confirmed = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบข้อสอบ");
                  if (confirmed) {
                    handleDeleteExam();
                  }
                }}
                className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
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

export default DashboardExams;
