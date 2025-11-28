import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaRegChartBar } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { BsPersonCircle } from "react-icons/bs";
import ExportPDF from "../components/ExportPDF";

function DashboardResults() {
  const [results, setResults] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditingScore, setIsEditingScore] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  // fetch teacher answer
  const fetchExams = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("/api/auth/exams", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExams(res.data);
    } catch (err) {
      console.error("โหลดข้อสอบล้มเหลว:", err);
      setError("ไม่สามารถโหลดเฉลยข้อสอบได้");
    } finally {
      setLoading(false);
    }
  };

  //fetch student answer
  const fetchResults = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("/api/auth/answers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(res.data);
    } catch (err) {
      setError("โหลดข้อมูลนักเรียนล้มเหลวโปรดลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  // save score
  const handleSaveScore = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/auth/answers/scores/${selectedStudent.studentId}`, {
        answers: selectedStudent.answers
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("บันทึกคะแนนสำเร็จ");
      fetchResults();
      fetchExams();
      //window.location.reload();
    } catch (err) {
      console.error(err);
      alert("บันทึกคะแนนไม่สำเร็จ ");
    }
  };

  useEffect(() => {
    fetchExams();
    fetchResults();
  }, []);

  const mergeCorrectAnswers = (student) => {
    if (!student || !student.examId || exams.length === 0) return student;
    const exam = exams.find((e) => e.examId === student.examId);
    if (!exam || !exam.questions) return student;

    const updatedAnswers = student.answers.map((ans) => {
      const question = exam.questions.find((q) => q.questionId === ans.questionId);
      const correctAnswer = question?.modelAnswers?.[0] || "-";
      const questionText = question?.questionText || "-";
      const answersScore = question?.answersScore || 0;

      return {
        ...ans,
        correctAnswer,
        questionText,
        answersScore,
      };
    });
    return { ...student, answers: updatedAnswers };
  };

  const handleSelectStudent = (student) => {
    const merged = mergeCorrectAnswers(student);
    setSelectedStudent(merged);
  };


  const totalStudents = results.length;
  const avgScore = results.reduce((sum, r) => sum + (r.totalScore || 0), 0) / (totalStudents || 1);
  const maxScore = Math.max(...results.map((r) => r.totalScore || 0), 0);
  const minScore = Math.min(...results.map((r) => r.totalScore || 0), 0);
  const topStudent = results.find((r) => r.totalScore === maxScore);

  return (
    <div>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : loading ? (
        <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FaRegChartBar className="text-xl" />
              สรุปผลคะแนน
            </h2>

            <div className="flex space-x-2">
              <ExportPDF data={results} type="score" />
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl shadow p-4 border border-gray-300 text-center">
              <p className="text-sm text-gray-500">จำนวนนักเรียนทั้งหมด</p>
              <h3 className="text-2xl font-bold text-[#00A859]">{totalStudents}</h3>
            </div>
            <div className="bg-white rounded-2xl shadow p-4 border border-gray-300 text-center">
              <p className="text-sm text-gray-500">คะแนนเฉลี่ย</p>
              <h3 className="text-2xl font-bold text-[#00A859]">{avgScore.toFixed(2)}</h3>
            </div>
            <div className="bg-white rounded-2xl shadow p-4 border border-gray-300 text-center">
              <p className="text-sm text-gray-500">คะแนนสูงสุด</p>
              <h3 className="text-2xl font-bold text-[#00A859]">{maxScore}</h3>
            </div>
            <div className="bg-white rounded-2xl shadow p-4 border border-gray-300 text-center">
              <p className="text-sm text-gray-500">คะแนนต่ำสุด</p>
              <h3 className="text-2xl font-bold text-[#00A859]">{minScore}</h3>
            </div>
          </div>

          {topStudent && (
            <div className="bg-[#e9fff3] border border-[#00A859]/40 rounded-2xl p-4 mb-6 shadow-sm">
              <div className="flex items-center gap-3">
                <BsPersonCircle className="text-4xl text-[#00A859]" />
                <div>
                  <h3 className="font-bold text-lg">
                    นักเรียนที่ได้คะแนนสูงสุด: {topStudent.studentName}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    รหัส {topStudent.studentId} | สาขา {topStudent.department} | วิชา{" "}
                    {topStudent.title}
                  </p>
                  <p className="font-semibold text-[#00A859] mt-1">
                    คะแนน {topStudent.totalScore} / {topStudent.answers?.length ?? 0}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/*Card View*/}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((r, index) => {
              const exam = exams.find((e) => e.examId === r.examId);
              const totalAnswersScore = exam?.totalAnswersScore ?? 0;

              const percent = totalAnswersScore && r.totalScore
                ? (r.totalScore / totalAnswersScore) * 100
                : 0;

              return (
                <div
                  key={r.studentId + index}
                  className="bg-white border border-gray-200 rounded-2xl shadow p-4 hover:shadow-md transition cursor-pointer"
                  onClick={() => handleSelectStudent(r)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-800 truncate flex-grow">
                      {index + 1}. {r.studentName}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">รหัสนักศึกษา: {r.studentId}</p>
                  <p className="text-sm text-gray-600">สาขา: {r.department}</p>
                  <p className="text-sm text-gray-600 mb-1">วิชา: {r.title}</p>
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>คะแนน:</span>
                    <span className="font-bold text-[#00A859]">
                      {r.totalScore ?? 0}/{totalAnswersScore}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                    <div
                      className="bg-[#00A859] h-3 rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/*Modal*/}
          {selectedStudent && (
            <div className="fixed inset-0 bg-black/30 backdrop-filter-none flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-2xl w-[95vw] max-w-[1600px] max-h-[90vh] overflow-y-auto p-10 relative">

                {/* text-[#00A859] */}
                <h3 className="text-2xl font-bold mb-6 text-left">
                  รายละเอียดคำตอบของ {selectedStudent.studentName}
                </h3>

                <div className="absolute top-5 right-7 flex gap-3">
                  {isEditingScore ? (
                    <>
                      <button
                        className="min-w-[90px] px-4 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 transition font-medium"
                        onClick={() => {
                          setSelectedStudent(originalData);
                          setIsEditingScore(false);
                        }}
                      >
                        ยกเลิก
                      </button>

                      <button
                        className="min-w-[90px] px-4 py-2 rounded-lg bg-[#00A859] text-white hover:bg-[#008c47] transition font-medium"
                        onClick={() => {
                          handleSaveScore();
                          setIsEditingScore(false);
                        }}
                      >
                        บันทึก
                      </button>
                    </>
                  ) : (
                    <button
                      className="min-w-[90px] px-4 py-2 rounded-lg bg-[#00A859] text-white hover:bg-[#008c47] transition font-medium"
                      onClick={() => {
                        setOriginalData(JSON.parse(JSON.stringify(selectedStudent)));
                        setIsEditingScore(true);
                      }}
                    >
                      แก้ไขคะแนน
                    </button>
                  )}
                </div>


                {/*ตารางคำตอบ */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200 text-sm md:text-base">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 border border-gray-300 w-[60px]">ข้อที่</th>
                        <th className="p-3 border border-gray-300 text-left ">คำถาม</th>
                        <th className="p-3 border border-gray-300 text-left ">คำตอบนักเรียน</th>
                        <th className="p-3 border border-gray-300 text-left">เฉลย / คำตอบอาจารย์</th>
                        <th className="p-3 border border-gray-300 w-[120px]">คะแนนที่ได้</th>
                        <th className="p-3 border border-gray-300 w-[120px]">คะแนนเต็ม</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudent.answers?.map((ans, i) => (
                        <tr key={i} className="border border-gray-300 hover:bg-gray-50">
                          <td className="p-3 text-center font-semibold text-gray-700 w-[5%]">{i + 1}</td>
                          <td className="p-3 align-top text-gray-800 w-[30%] break-words">{ans.questionText || "-"}</td>
                          <td className="p-3 align-top text-gray-800 w-[30%] break-words">{ans.studentAnswer || "-"}</td>
                          <td className="p-3 align-top text-gray-800 w-[40%] break-words">{ans.correctAnswer || "-"}</td>

                          <td className="p-3 text-center text-[#00A859] w-[5%]">
                            {isEditingScore ? (
                              <input
                                type="number"
                                min="0"
                                max={ans.answersScore ?? 0}
                                defaultValue={ans.score ?? 0}
                                onBlur={(e) => {
                                  let newScore = Number(e.target.value);
                                  const maxScore = ans.answersScore ?? 0;

                                  if (newScore < 0) {
                                    newScore = 0;
                                    e.target.value = 0;
                                  }
                                  
                                  if (newScore > maxScore) {
                                    newScore = maxScore;
                                    e.target.value = maxScore;
                                  }

                                  setSelectedStudent((prev) => ({
                                    ...prev,
                                    answers: prev.answers.map((item, index) =>
                                      index === i ? { ...item, score: newScore } : item
                                    )
                                  }));
                                }}
                                className="w-16 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A859]"
                              />
                            ) : (
                              ans.score ?? 0
                            )}
                          </td>
                          <td className="p-3 text-center text-[#00A859] w-[5%]">{ans.answersScore || "-"}</td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/*ปุ่มปิด */}
                <div className="flex justify-end mt-6">
                  {!isEditingScore && (
                    <button
                      className="bg-gray-200 px-5 py-2 rounded-lg hover:bg-gray-300 text-gray-700 font-medium transition"
                      onClick={() => setSelectedStudent(null)}
                    >
                      ย้อนกลับ
                    </button>
                  )}
                </div>

              </div>
            </div>
          )}


        </>
      )}
    </div>
  );
}

export default DashboardResults;
