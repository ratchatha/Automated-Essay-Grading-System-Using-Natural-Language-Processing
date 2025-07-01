import React, { useEffect, useState } from "react";
import axios from "axios";
import { BsPencilSquare } from "react-icons/bs";
import { FiClipboard, FiPlus, FiEdit, FiTrash } from "react-icons/fi";

function DashboardExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get("/api/auth/exams", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setExams(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "เกิดข้อผิดพลาดในการโหลดข้อมูลข้อสอบ");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const getTotalQuestions = (exam) => {
    if (!exam.chapters) return 0;
    return exam.chapters.reduce((sum, chapter) => sum + chapter.questions.length, 0);
  };

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
            รหัส: {selectedExam.examId} | จำนวนคำถาม: {getTotalQuestions(selectedExam)}
          </p>

          <div className="space-y-6 text-sm text-gray-800">
            {(() => {
              let questionIndex = 1;
              return selectedExam.chapters.map((chapter, cIndex) => (
                <div key={cIndex}>
                  <h3 className="font-semibold text-base text-indigo-600 mb-2">
                    {chapter.chapterTitle}
                  </h3>
                  <ol className="space-y-3">
                    {chapter.questions.map((q, index) => (
                      <li key={index}>
                        <div className="p-4 bg-gray-50 border border-gray-300 rounded-lg">
                          <p className="font-bold mb-2">
                            ข้อ {questionIndex++}: {q.questionText || "ไม่มีข้อความคำถาม"}
                          </p>
                          {q.modelAnswers && q.modelAnswers.length > 0 && (
                            <ul className="list-disc pl-5 font-medium text-green-700">
                              {q.modelAnswers.map((answer, aIdx) => (
                                <li key={aIdx}>{answer}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              ));
            })()}
          </div>


          <button
            className="mt-4 px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg"
            onClick={() => setSelectedExam(null)}
          >
            ย้อนกลับ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2 ">
          <BsPencilSquare className="text-xl" />
          ข้อสอบทั้งหมด
        </h2>
        <div className="flex space-x-2">
          <button className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm">
            <FiPlus />
            เพิ่ม
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 border rounded hover:bg-gray-100 transition text-sm">
            <FiEdit />
            แก้ไข
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 border rounded hover:bg-gray-100 transition text-sm">
            <FiTrash />
            ลบ
          </button>
        </div>
      </div>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        !loading && (
          <ul className="space-y-3">
            {exams.map((exam) => (
              <li key={exam._id} className="p-4 bg-white border border-gray-300 rounded-lg shadow">
                <div className="font-semibold">{exam.title}</div>
                <div className="text-sm text-gray-600 mt-1">
                  รหัส: {exam.examId} | จำนวนคำถาม: {getTotalQuestions(exam)}
                </div>
                <div>
                  <button
                    onClick={() => setSelectedExam(exam)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    ดูรายละเอียด
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}

export default DashboardExams;
